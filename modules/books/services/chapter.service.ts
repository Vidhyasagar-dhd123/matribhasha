import connection from "@/lib/database";
import Chapter from "../models/Chapter.model";
import Book from "../models/Book.model";

export async function getChaptersByBook(bookUUID: string) {
  await connection();
  return Chapter.find({ bookUUID }).sort({ chapterNo: 1 }).lean();
}

export async function createChapter(data: {
  title: string;
  bookUUID: string;
  chapterNo: number;
  startingPage?: number;
  endingPage?: number;
}) {
  await connection();
  const chapter = await Chapter.create(data);
  await Book.findOneAndUpdate(
    { uuid: data.bookUUID },
    { $addToSet: { chapters: chapter._id } }
  );
  return chapter;
}

export async function deleteChapter(chapterId: string) {
  await connection();
  const chapter = await Chapter.findByIdAndDelete(chapterId);
  if (chapter) {
    await Book.findOneAndUpdate(
      { uuid: chapter.bookUUID },
      { $pull: { chapters: chapter._id } }
    );
  }
  return chapter;
}
