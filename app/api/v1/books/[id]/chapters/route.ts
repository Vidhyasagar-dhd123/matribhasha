import connection from "@/lib/database";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import { getChaptersByBook, createChapter } from "@/modules/books/services/chapter.service";
import { z } from "zod";

const ChapterCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  chapterNo: z.number().int().min(1),
  startingPage: z.number().int().optional(),
  endingPage: z.number().int().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapters = await getChaptersByBook(id);
    return Response.json(chapters, { status: 200 });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return Response.json({ message: "Failed to fetch chapters" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await authenticateUser(req);
    if (!isAdminUser(currentUser)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const json = await req.json();
    const parsed = ChapterCreateSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid chapter data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const chapter = await createChapter({
      ...parsed.data,
      bookUUID: id,
    });

    return Response.json(chapter, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return Response.json({ message: "Failed to create chapter" }, { status: 500 });
  }
}
