import { createContext, useContext, useEffect, useState } from "react";
import { Book } from "@/modules/books/utils/books";

interface BooksContextType {
    books: Book[];
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
    selectedBook: Book | null;
    setSelectedBook: React.Dispatch<React.SetStateAction<Book | null>>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: React.ReactNode }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("selectedBook");
        if (stored) setSelectedBook(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedBook", JSON.stringify(selectedBook));
    }, [selectedBook]);

    return (
        <BooksContext.Provider value={{ books, setBooks, selectedBook, setSelectedBook }}>
            {children}
        </BooksContext.Provider>
    );
};

export const useBooks = () => {
    const context = useContext(BooksContext);
    if (!context) {
        throw new Error("useBooks must be used within a BooksProvider");
    }
    return context;
};