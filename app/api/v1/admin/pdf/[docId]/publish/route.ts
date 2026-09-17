import authenticateUser, { isAdminUser } from "@/lib/auth";
import connection from "@/lib/database";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import indicTransClient from "@/modules/translation/services/indicTrans.service";
import crypto from "crypto";

interface PublishPageItem {
  pageNumber: number;
  originalContent?: string;
  translatedContent?: string;
  content?: string;
}

interface IndicTransRawPage {
  page_number?: number;
  pageNumber?: number;
  combined_text?: string;
  raw_text?: string;
  content?: string;
}

interface IndicTransTranslationItem {
  page_number?: number;
  pageNumber?: number;
  translated_text?: string;
  content?: string;
}

/**
 * Normalizes text content while preserving critical paragraph breaks,
 * sentence lines, and OCR boundary sequences.
 */
function preserveBreakingSequences(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Preserve intentional paragraph breaks (\n\n) while cleaning trailing whitespace on lines
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { docId } = await params;
    const body = await req.json();

    await connection();

    const authorId = currentUser?.id || (currentUser as { _id?: string })?._id;
    const {
      bookUUID,
      createNewBook = true,
      bookDetails = {},
      publishOriginal = true,
      publishTranslated = true,
      targetLanguage = "hin_Deva",
      pages: customPagesList,
    } = body;

    let targetBook = null;
    const origLang = (bookDetails.originalLanguage || "en").toLowerCase();
    const transLang = targetLanguage.toLowerCase();

    // 1. Resolve or Create Target Book
    if (createNewBook) {
      const generatedUuid = bookDetails.uuid || `book-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
      targetBook = new Book({
        title: bookDetails.title || `PDF Document #${docId}`,
        author: bookDetails.author || currentUser?.username || "Admin",
        description: bookDetails.description || `Extracted and translated from PDF document #${docId}`,
        genre: bookDetails.genre || "General",
        isbn13: bookDetails.isbn13 || bookDetails.isbn || "",
        originalLanguage: origLang,
        coverURI: bookDetails.coverURI || "",
        uploadURI: bookDetails.uploadURI || `/api/v1/admin/pdf/${docId}`,
        uuid: generatedUuid,
        uploaded: true,
        translatedLanguages: [],
        pages: [],
      });
      await targetBook.save();
    } else if (bookUUID) {
      targetBook = await Book.findOne({
        $or: [{ uuid: bookUUID }, { _id: bookUUID }],
      });
      if (!targetBook) {
        return Response.json({ message: `Target book '${bookUUID}' not found.` }, { status: 404 });
      }

      // Update existing book metadata if provided
      if (bookDetails.title) targetBook.title = bookDetails.title;
      if (bookDetails.author) targetBook.author = bookDetails.author;
      if (bookDetails.description) targetBook.description = bookDetails.description;
      if (bookDetails.genre) targetBook.genre = bookDetails.genre;
      if (bookDetails.coverURI) targetBook.coverURI = bookDetails.coverURI;
      if (bookDetails.isbn13 || bookDetails.isbn) targetBook.isbn13 = bookDetails.isbn13 || bookDetails.isbn;
    } else {
      return Response.json({ message: "Must specify createNewBook or bookUUID." }, { status: 400 });
    }

    // 2. Prepare Sequential Page Data
    let sequentialPages: PublishPageItem[] = [];

    if (Array.isArray(customPagesList) && customPagesList.length > 0) {
      // Sort strictly by page number to maintain sequential integrity
      sequentialPages = customPagesList
        .map((p) => ({
          pageNumber: Number(p.pageNumber || p.page_number || 1),
          originalContent: preserveBreakingSequences(p.originalContent || p.raw_text || p.content),
          translatedContent: preserveBreakingSequences(p.translatedContent || p.translated_text || p.content),
        }))
        .sort((a, b) => a.pageNumber - b.pageNumber);
    } else {
      // Auto-fetch pages & translations from IndicTrans
      try {
        const [pagesRes, transRes] = await Promise.all([
          indicTransClient.getPages(docId, { all: true }).catch(() => null),
          indicTransClient.getTranslations(docId, transLang, true).catch(() => null),
        ]);

        const rawPages = ((pagesRes?.data?.pages || pagesRes?.data || pagesRes?.pages || []) as IndicTransRawPage[])
          .sort((a, b) => Number(a.page_number || a.pageNumber || 0) - Number(b.page_number || b.pageNumber || 0));

        const transPages = (transRes?.data?.translations || transRes?.data || transRes?.translations || []) as IndicTransTranslationItem[];
        const transMap = new Map<number, string>();
        for (const t of transPages) {
          const pNum = Number(t.page_number || t.pageNumber);
          if (pNum) transMap.set(pNum, t.translated_text || t.content || "");
        }

        sequentialPages = rawPages.map((p) => {
          const pNum = Number(p.page_number || p.pageNumber || 1);
          return {
            pageNumber: pNum,
            originalContent: preserveBreakingSequences(p.combined_text || p.raw_text || p.content),
            translatedContent: preserveBreakingSequences(transMap.get(pNum) || ""),
          };
        });
      } catch (fetchErr) {
        console.warn("Failed to auto-fetch document pages from IndicTrans", fetchErr);
      }
    }

    if (sequentialPages.length === 0) {
      return Response.json({ message: "No pages found to publish." }, { status: 400 });
    }

    const createdPages = [];
    const createdVersions = [];

    // 3. Process each page sequentially and maintain unbroken numbering
    for (let i = 0; i < sequentialPages.length; i++) {
      const item = sequentialPages[i];
      const pageNum = item.pageNumber || i + 1;

      // Ensure Page entry exists in MongoDB
      let pageDoc = await Page.findOne({
        bookUUID: targetBook.uuid,
        pageNumber: pageNum,
      });

      if (!pageDoc) {
        pageDoc = new Page({
          bookId: targetBook._id,
          bookUUID: targetBook.uuid,
          pageNumber: pageNum,
          originalLanguage: targetBook.originalLanguage || origLang,
        });
        await pageDoc.save();
      }

      // Upsert Original Version
      if (publishOriginal && item.originalContent) {
        const origVersion = await PageVersion.findOneAndUpdate(
          {
            pageId: pageDoc._id,
            language: origLang,
            authorId: authorId,
          },
          {
            $set: {
              content: item.originalContent,
              language: origLang,
              authorId: authorId,
              pageId: pageDoc._id,
            },
          },
          { upsert: true, new: true }
        );
        createdVersions.push(origVersion);
      }

      // Upsert Translated Version
      if (publishTranslated && item.translatedContent) {
        const transVersion = await PageVersion.findOneAndUpdate(
          {
            pageId: pageDoc._id,
            language: transLang,
            authorId: authorId,
          },
          {
            $set: {
              content: item.translatedContent,
              language: transLang,
              authorId: authorId,
              pageId: pageDoc._id,
            },
          },
          { upsert: true, new: true }
        );
        createdVersions.push(transVersion);
      }

      createdPages.push(pageDoc);
    }

    // 4. Update Book Metadata, Page IDs, and Language Inventory
    const allBookPages = await Page.find({ bookUUID: targetBook.uuid }).sort({ pageNumber: 1 });
    const pageIds = allBookPages.map((p) => p._id);
    const distinctLanguages = await PageVersion.distinct("language", { pageId: { $in: pageIds } });

    targetBook.pages = pageIds;
    targetBook.totalPages = allBookPages.length;
    targetBook.uploaded = true;
    targetBook.translatedLanguages = Array.from(
      new Set([...(targetBook.translatedLanguages || []), ...distinctLanguages.filter(Boolean)])
    );
    targetBook.isTranslated = targetBook.translatedLanguages.some(
      (l: string) => l.toLowerCase() !== targetBook.originalLanguage.toLowerCase()
    );

    await targetBook.save();

    return Response.json(
      {
        success: true,
        message: `Book "${targetBook.title}" successfully published with ${createdPages.length} sequential pages and ${createdVersions.length} versions.`,
        data: {
          book: targetBook,
          totalPages: createdPages.length,
          publishedVersionsCount: createdVersions.length,
          languages: targetBook.translatedLanguages,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Publish error:", err);
    const msg = err instanceof Error ? err.message : "Failed to publish book";
    return Response.json({ message: msg }, { status: 500 });
  }
}
