"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/modules/shared/components/Button";
import { Card, CardContent } from "@/modules/shared/components/cards";
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Layers, User as UserIcon } from "lucide-react";
import { useReader } from "@/modules/books/contexts/read.context";
import ReadQueryManager from "@/modules/books/components/ReadQueryManager";
import { idToHeading } from "@/lib/utils";

export const OuterContainer = ({
  children,
  type,
  id,
  onSave,
}: {
  children: React.ReactNode;
  id: string;
  type: string;
  onSave?: () => void | Promise<void>;
}) => {
  const { page, pages, author, language } = useReader();
  const [fontSize, setFontSize] = React.useState(16);
  const [openVersions, setOpenVersions] = useState(false);

  const pagesList = pages?.data || [];
  const activePageNumber = page?.data?.pageNumber ?? 1;
  const currentIndex = pagesList.findIndex((p) => p.pageNumber === activePageNumber);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      page.set(pagesList[currentIndex - 1]);
    } else if (activePageNumber > 1) {
      const prev = pagesList.find((p) => p.pageNumber === activePageNumber - 1);
      if (prev) page.set(prev);
    }
  }, [currentIndex, activePageNumber, pagesList, page]);

  const goToNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < pagesList.length - 1) {
      page.set(pagesList[currentIndex + 1]);
    } else if (pagesList.length > 0) {
      const next = pagesList.find((p) => p.pageNumber === activePageNumber + 1);
      if (next) page.set(next);
    }
  }, [currentIndex, activePageNumber, pagesList, page]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col flex-1">
      <Card className="w-full border h-[78vh] md:h-[82vh] flex flex-col bg-card shadow-sm rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border relative shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={goToPrev}
              disabled={currentIndex <= 0 && activePageNumber <= 0}
              className="h-8 w-8 p-0 cursor-pointer"
              title="Previous Page"
            >
              <ArrowLeft size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={goToNext}
              disabled={pagesList.length > 0 && currentIndex === pagesList.length - 1}
              className="h-8 w-8 p-0 cursor-pointer"
              title="Next Page"
            >
              <ArrowRight size={16} />
            </Button>
            <h2 className="ml-2 font-semibold text-sm sm:text-base text-foreground hidden sm:block truncate max-w-[200px]">
              {idToHeading(id)}
            </h2>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
              Page: {activePageNumber}
            </span>
          </div>

          {type === "ref" && (
            <div className="relative flex items-center gap-2">
              {/* Active version badge */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg border border-border">
                <UserIcon size={12} className="text-primary" />
                <span className="font-medium text-foreground truncate max-w-[90px]">
                  {author?.data?.authorId?.name || "Author"}
                </span>
                <span className="uppercase font-mono font-bold text-primary text-[11px]">
                  ({language?.data || "en"})
                </span>
              </div>

              <button
                onClick={() => setOpenVersions(!openVersions)}
                className={`flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  openVersions ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted text-foreground"
                }`}
              >
                <Layers size={13} />
                <span>Versions</span>
              </button>

              {openVersions && (
                <div className="absolute top-10 right-0 z-50 rounded-xl shadow-2xl border border-border bg-background overflow-hidden">
                  <ReadQueryManager />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <CardContent
          className="overflow-y-auto scrollbar-hide p-4 md:p-6 text-justify border-b border-border flex-1 min-h-0 text-foreground"
          style={{ fontSize: `${fontSize}px` }}
        >
          {type === "ref" ? <ReferencePage id={id} /> : children}
        </CardContent>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 shrink-0 bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Button
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() => setFontSize((f) => Math.max(12, f - 1))}
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </Button>
            <span>Font: {fontSize}px</span>
            <Button
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() => setFontSize((f) => Math.min(24, f + 1))}
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </Button>
          </div>

          {type === "edit" && onSave && (
            <Button variant="default" onClick={onSave} className="font-semibold text-xs px-3.5 py-1.5">
              Save Changes
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export const ReferencePage = ({ id }: { id: string }) => {
  const { page, author, language } = useReader();
  const [refContent, setRefContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getPageVersion = async () => {
      const pageNum = page?.data?.pageNumber ?? 1;
      const params = new URLSearchParams();
      if (author?.data?.authorId?.email) params.append("author", author.data.authorId.email);
      if (language?.data) params.append("language", language.data);

      const query = params.toString() ? `?${params.toString()}` : "";
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/pages/${page?.data?.bookUUID || id}/${pageNum}${query}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setRefContent(data?.content || "No translation recorded for this version.");
        } else if (isMounted) {
          setRefContent("No translation version found for the selected author and language.");
        }
      } catch {
        if (isMounted) setRefContent("Unable to load reference page.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getPageVersion();
    return () => {
      isMounted = false;
    };
  }, [page?.data?.bookUUID, page?.data?.pageNumber, author?.data, language?.data, id]);

  if (loading) {
    return <div className="p-4 text-xs text-muted-foreground">Loading reference text...</div>;
  }

  return (
    <div className="space-y-3 font-serif leading-relaxed whitespace-pre-wrap select-text text-foreground">
      <div className="text-xs font-sans text-muted-foreground border-b border-border/60 pb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <UserIcon size={12} className="text-primary" />
          <span>Version Author: <strong className="text-foreground">{author?.data?.authorId?.name || "Original Author"}</strong></span>
        </span>
        <span className="uppercase font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
          {language?.data || "en"}
        </span>
      </div>
      <p className="mt-3 text-base leading-loose text-justify">{refContent}</p>
    </div>
  );
};
