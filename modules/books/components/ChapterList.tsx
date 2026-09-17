import React from "react";
import { LayoutList, BookOpen } from "lucide-react";
import { useReader } from "../contexts/read.context";

const ChapterList = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { book } = useReader();

  return (
    <div
      {...props}
      className="w-64 z-30 h-full bg-background border-r border-border shadow-2xl flex flex-col"
    >
      <div className="p-4 border-b border-border font-semibold text-sm text-foreground flex items-center gap-2">
        <BookOpen size={16} className="text-primary" />
        <span>Chapters</span>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"].map((val, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl hover:bg-muted/50 cursor-pointer flex items-center gap-3 text-xs font-semibold text-foreground transition"
          >
            <LayoutList size={14} className="text-muted-foreground" />
            <span>{val}</span>
          </div>
        ))}
      </div>
      {book?.data?.title && (
        <div className="p-3 border-t border-border text-[11px] text-muted-foreground truncate">
          {book.data.title}
        </div>
      )}
    </div>
  );
};

export default ChapterList;