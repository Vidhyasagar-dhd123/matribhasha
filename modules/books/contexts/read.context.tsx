"use client";

import React, { useContext, createContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { Book } from "../utils/books";
import { Page } from "../utils/page";
import { Values } from "../utils/readcontext";
import { Author } from "../utils/authors";
import { PageVersion } from "../utils/pageversion";

const ReadContext = createContext<Values | null>(null);

export const ReadProvider = ({ id, children }: { id: string; children: ReactNode }) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Author[] | null>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [pages, setPages] = useState<Page[] | null>([]);
  const [chapter, setChapter] = useState<object>({});
  const [chapters, setChapters] = useState<object[]>([]);
  const [contentPage, setContentPage] = useState<PageVersion | null>(null);
  const [book, setBook] = useState<Book | null>(null);

  // Load Book Details
  useEffect(() => {
    let isMounted = true;
    const loadBook = async () => {
      try {
        const data = await fetch(`/api/v1/books/${id}`);
        if (data.ok && isMounted) {
          const resBook = await data.json();
          setBook(resBook);
          if (resBook.originalLanguage && !language) {
            setLanguage(resBook.originalLanguage);
          }
        }
      } catch (err) {
        console.error("Error loading book:", err);
      }
    };
    if (id) loadBook();
    return () => {
      isMounted = false;
    };
  }, [id, language]);

  // Load Book Pages
  const loadPages = useCallback(async (bookIdentifier: string) => {
    try {
      const data = await fetch(`/api/v1/books/${bookIdentifier}/pages`);
      if (data.ok) {
        const requestedPages = await data.json();
        setPages(requestedPages);
        if (Array.isArray(requestedPages) && requestedPages.length > 0) {
          setPage((prev) => prev || requestedPages[0]);
        }
      }
    } catch (err) {
      console.error("Error loading pages:", err);
    }
  }, []);

  useEffect(() => {
    if (book?.uuid) {
      loadPages(book.uuid);
    }
  }, [book?.uuid, loadPages]);

  // Load Active Page Content when page or language changes
  useEffect(() => {
    let isMounted = true;
    const loadPageContent = async () => {
      if (!book?.uuid || page?.pageNumber === undefined) return;
      try {
        const params = new URLSearchParams();
        if (language) params.set("language", language);
        if (author?.authorId?.email) params.set("author", author.authorId.email);

        const res = await fetch(`/api/v1/pages/${book.uuid}/${page.pageNumber}?${params.toString()}`);
        if (res.ok && isMounted) {
          const versionData = await res.json();
          setContentPage(versionData);
        } else if (isMounted) {
          setContentPage(null);
        }
      } catch {
        if (isMounted) setContentPage(null);
      }
    };

    loadPageContent();
    return () => {
      isMounted = false;
    };
  }, [book?.uuid, page?.pageNumber, language, author?.authorId?.email]);

  const value: Values = useMemo(
    () => ({
      book: { data: book, set: setBook },
      authors: { data: authors, set: setAuthors },
      author: { data: author, set: setAuthor },
      page: { data: page, set: setPage },
      pages: { data: pages, set: setPages },
      chapter: { data: chapter, set: setChapter },
      chapters: { data: chapters, set: setChapters },
      language: { data: language, set: setLanguage },
      content: { data: contentPage, set: setContentPage },
    }),
    [book, authors, author, page, pages, chapter, chapters, language, contentPage]
  );

  return <ReadContext.Provider value={value}>{children}</ReadContext.Provider>;
};

export const useReader = () => {
  const context = useContext(ReadContext);
  if (!context) {
    throw new Error("useReader must be used inside ReadProvider");
  }
  return context;
};