"use client";

import { useEffect } from "react";
import { useReader } from "../contexts/read.context";
import { Languages, User as UserIcon } from "lucide-react";

const ReadQueryManager = () => {
  const { authors, page, author, language } = useReader();

  useEffect(() => {
    const getAuthors = async () => {
      if (!page?.data?.bookUUID || page?.data?.pageNumber === undefined) return;
      try {
        const data = await fetch(
          `/api/v1/pages/${page.data.bookUUID}/${page.data.pageNumber}/authors`
        );
        if (data.ok) {
          const req_author = await data.json();
          authors?.set(req_author);
        }
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
    };

    getAuthors();
  }, [page?.data?.bookUUID, page?.data?.pageNumber]);

  return (
    <div className="w-72 z-30 h-full bg-background border-l border-border shadow-2xl flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <Languages size={16} className="text-primary" />
          <span>Versions & Authors</span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {authors?.data?.length || 0}
        </span>
      </div>

      <div className="overflow-y-auto flex-1 p-2 space-y-1.5">
        {authors?.data && authors.data.length > 0 ? (
          authors.data.map((value, key) => {
            const isSelected =
              author?.data?.authorId?.email === value?.authorId?.email &&
              language?.data === value?.language;

            return (
              <div
                key={key}
                onClick={() => {
                  author?.set(value);
                  language?.set(value?.language);
                }}
                className={`p-3 rounded-xl cursor-pointer transition border flex flex-col gap-1.5 ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-card border-border/70 hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground truncate">
                    <UserIcon size={12} className="text-muted-foreground shrink-0" />
                    <span className="truncate">{value?.authorId?.name || "Original Author"}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-primary/20 text-primary">
                    {value?.language || "en"}
                  </span>
                </div>

                <div className="text-[11px] text-muted-foreground truncate pl-4">
                  {value?.authorId?.email || "Community translation"}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No versions available for this page yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadQueryManager;