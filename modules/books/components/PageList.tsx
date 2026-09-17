"use client";

import React from "react";
import { useReader } from "../contexts/read.context";

const PageList = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { page, pages } = useReader();

  const pagesArray = pages?.data || [];
  if (pagesArray.length === 0) {
    return null;
  }

  return (
    <aside className={`w-full bg-card/60 backdrop-blur border-t border-border py-2 px-4 ${className}`} {...props}>
      <div className="mx-auto max-w-5xl flex items-center justify-start gap-1.5 overflow-x-auto py-1 scrollbar-thin">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-2 shrink-0">
          Pages ({pagesArray.length}):
        </span>
        {pagesArray.map((p, idx) => {
          const isActive = page?.data?.pageNumber === p.pageNumber;
          return (
            <button
              key={p._id || idx}
              onClick={() => page.set(p)}
              className={`flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg text-xs font-semibold transition shrink-0 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={`Jump to Page ${p.pageNumber}`}
            >
              {p.pageNumber}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default PageList;