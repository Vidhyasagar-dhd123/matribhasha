import {Book} from "../utils/books.d"

function StatsGrid({ book }: { book: Book }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 shadow  rounded-xl flex flex-col items-center hover:shadow-lg transition-shadow">
        <h1 className="  p-2 font-bold">{book.originalLanguage}</h1>
        <p className=" ">Language</p>
      </div>
      <div className="p-4 shadow  rounded-xl flex flex-col items-center hover:shadow-lg transition-shadow">
        <h1 className="  p-2 font-bold">{"reviews"}</h1>
        <p className=" ">Stars</p>
      </div>
      <div className="p-4 shadow  rounded-xl flex flex-col items-center hover:shadow-lg transition-shadow">
        <h1 className="  p-2 font-bold">{book.pages?.length}</h1>
        <p className=" ">Pages</p>
      </div>
      <div className="p-4 shadow  rounded-xl flex flex-col items-center hover:shadow-lg transition-shadow">
        <h1 className="  p-2 font-bold">{"edits"}</h1>
        <p className=" ">Edits</p>
      </div>
    </div>
  );
}

export default StatsGrid