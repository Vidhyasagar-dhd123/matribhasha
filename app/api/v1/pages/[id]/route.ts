import connection from "@/lib/database";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connection();
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language");
    const { id } = await params;

    if (!id) {
      return Response.json({ message: "Invalid Request" }, { status: 400 });
    }

    let page;
    if (mongoose.Types.ObjectId.isValid(id)) {
      page = await Page.findById(id);
    }
    if (!page) {
      page = await Page.findOne({ bookUUID: id }).sort({ pageNumber: 1 });
    }

    if (!page) {
      return Response.json({ message: "Page Not Found" }, { status: 404 });
    }

    const query: Record<string, unknown> = {
      pageId: page._id,
      language: language || page.originalLanguage,
    };

    const versionedPage = await PageVersion.findOne(query)
      .populate("authorId", "name email username")
      .populate("pageId", "pageNumber bookUUID");

    if (!versionedPage) {
      return Response.json({ message: "No Translation For This Page" }, { status: 404 });
    }

    return Response.json(versionedPage, { status: 200 });
  } catch (err) {
    console.error("Pages API error:", err);
    return Response.json({ message: "Error Occurred" }, { status: 500 });
  }
}
