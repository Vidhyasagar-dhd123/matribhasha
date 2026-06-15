import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/modules/user/types/auth";
import { getUsers } from "../Services/users";
interface UserContextType {
    users: User[]|null;
    selectedUser: User|null;
    setSelectedUser: (user: User|null) => void;
    refreshUsers: () => Promise<void>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    totalCount: number;
    loading: boolean;
}

const UsersContext = createContext<UserContextType | undefined>({}as UserContextType);

export const UsersProvider = ({ children }:{ children: React.ReactNode }) => {
    // Values and state for books can be defined here
    const [users, setUsers] = useState<User[]|null>([]);
    const [selectedUser, setSelectedUser] = useState<User|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const limit = 10;

    // Functions to manipulate books can also be defined here, e.g., addBook, removeBook, etc.
    const refreshUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsers({ search: searchQuery, page, limit, sort: "newest" });
            setUsers(res?.users || null);
            setTotalPages(res?.totalPages || 1);
            setTotalCount(res?.totalCount || 0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUsers().catch((err) => {
            console.error("Error fetching users:", err);
        });
    }, [page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }, [selectedUser]);

    const values = {users, selectedUser, setSelectedUser, refreshUsers, searchQuery, setSearchQuery, page, setPage, totalPages, totalCount, loading};
    return (<UsersContext.Provider value={values}>{children}</UsersContext.Provider>);
};

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return context;
};

export default UsersContext;