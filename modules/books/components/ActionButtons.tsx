import { useState } from "react";
import { Heart, BookmarkIcon, BookOpenIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function ActionButtons({id}:{id:string}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const router = useRouter()
  return (
    <div className="flex flex-row md:flex-col min-h-full justify-between items-center gap-4">
      <button
        aria-label="Like this book"
        onClick={() => setLiked(!liked)}
        className="bg-[var(--secondary)] rounded-full p-2 hover:bg-gray-100 transition">
        <Heart className={`text-red-400 ${liked ? "fill-red-400" : ""}`} />
      </button>
      <button
        aria-label="Bookmark this book"
        onClick={() => setBookmarked(!bookmarked)}
        className="bg-[var(--secondary)] rounded-full p-2 hover:bg-gray-100 transition">
        <BookmarkIcon className={`text-red-400 ${bookmarked ? "fill-red-400" : ""}`} />
      </button>
      <button onClick={()=>router.push(`/Read/${id}`)} aria-label="Read this book" className="rounded-full bg-red-700 p-2 hover:bg-red-800 transition">
        <BookOpenIcon className="text-white" />
      </button>
    </div>
  );
}

export default ActionButtons