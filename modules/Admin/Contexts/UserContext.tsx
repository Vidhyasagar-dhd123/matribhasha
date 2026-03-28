import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/modules/user/types/auth";
import { getUsers } from "../Services/users";
interface UserContextType {
    users: User[]|null;
    selectedUser: User|null;
    setSelectedUser: (user: User|null) => void;
}

const UsersContext = createContext<UserContextType | undefined>({}as UserContextType);

export const UsersProvider = ({ children }:{ children: React.ReactNode }) => {
    // Values and state for books can be defined here
    const [users, setUsers] = useState<User[]|null>([]);
    const [selectedUser, setSelectedUser] = useState<User|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Functions to manipulate books can also be defined here, e.g., addBook, removeBook, etc.
    useEffect(() => {
        getUsers({}).then((res) => {
            console.log("Users fetched:", res?.users);
            setUsers(res?.users || null);
        }).catch((err) => {
            console.error("Error fetching users:", err);
        });
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }, [selectedUser]);

    const values = {users, selectedUser, setSelectedUser};
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