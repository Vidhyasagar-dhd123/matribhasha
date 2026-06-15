import { createContext, useContext, useEffect, useState } from "react";
import { Book } from "@/modules/books/utils/books";
import { getBooks } from "../Services/books";

interface BooksContextType {
    books: Book[];
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
    selectedBook: Book | null;
    setSelectedBook: React.Dispatch<React.SetStateAction<Book | null>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    totalCount: number;
    loading: boolean;
    refreshBooks: () => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider = ({ children }: { children: React.ReactNode }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    useEffect(() => {
        const stored = localStorage.getItem("selectedBook");
        if (stored) setSelectedBook(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedBook", JSON.stringify(selectedBook));
    }, [selectedBook]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const refreshBooks = async () => {
        setLoading(true);
        try {
            const response = await getBooks({
                search: searchQuery,
                page,
                limit,
                sort: "newest",
            });

            if (Array.isArray(response)) {
                setBooks(response);
                setTotalCount(response.length);
                setTotalPages(1);
            } else {
                setBooks(response?.books || []);
                setTotalCount(response?.totalCount || 0);
                setTotalPages(response?.totalPages || 1);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshBooks().catch((error) => {
            console.error("Error fetching books:", error);
        });
    }, [page, searchQuery]);

    return (
        <BooksContext.Provider value={{ books, setBooks, selectedBook, setSelectedBook, searchQuery, setSearchQuery, page, setPage, totalPages, totalCount, loading, refreshBooks }}>
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