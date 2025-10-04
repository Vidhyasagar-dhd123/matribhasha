import { Book } from "../utils/books";

function AboutSection({ book }: { book: Book }) {
  return (
    <article className="bg-[var(--secondary)] max-w-4xl rounded-xl flex flex-col m-10 md:m-0 md:flex-row justify-center items-center md:items-start md:justify-start">
      <div className="grid grid-cols-1 p-2 sm:grid-cols-2 gap-4 w-full">
        <div className="border rounded p-4">
          <h2 className="mb-2 text-lg font-bold">About this book</h2>
          <div className="grid p-4 grid-cols-2 py-2 rounded gap-2">
            <div>ISBN No.</div>
            <div>{"book.isbn"}</div>
            <div>Published</div>
            <div>{"Published"}</div>
            <div>Page Count</div>
            <div>{book.pages?.length}</div>
            <div>Author</div>
            <div>{book.author}</div>
            <div>Versions</div>
            <div>{"something"}</div>
          </div>
        </div>
        <div className="p-4 md:mt-0 border rounded">
          <h2 className="mb-2 text-lg font-bold">Description</h2>
          <div className="px-4 text-sm">
            <p>{book.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default AboutSection