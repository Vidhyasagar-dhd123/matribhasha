"use client";
import { useSearchParams } from "next/navigation";
import BooksPanel from "./BooksPanel";
import { BooksProvider } from "../Contexts/BooksContext";
import UserPanel from "./UserPanel";
import { UsersProvider } from "../Contexts/UserContext";


const AdminLinkProvider = () => {
    // Get Query Params and redirect to the appropriate admin page
    const searchParams = useSearchParams();
    const adminPage = searchParams.get('page');
    if (adminPage) {
        switch (adminPage) {
            case 'users':
                return (
                    <UsersProvider>
                        <UserPanel/>
                    </UsersProvider>
            );
            case 'settings':
                return <div>Settings Panel - Coming Soon</div>;
            case 'books':
                return (
                    <BooksProvider>
                        <BooksPanel />
                    </BooksProvider>
                );
        }
    }
}

export default AdminLinkProvider;