"use client";
import { useSearchParams } from "next/navigation";
import BooksPanel from "./BooksPanel";
import { BooksProvider } from "../Contexts/BooksContext";
import UserPanel from "./UserPanel";
import { UsersProvider } from "../Contexts/UserContext";
import AdminDashboardPanel from "./AdminDashboardPanel";
import AdminSettingsPanel from "./AdminSettingsPanel";


const AdminLinkProvider = () => {
    // Get Query Params and redirect to the appropriate admin page
    const searchParams = useSearchParams();
    const adminPage = searchParams.get('page');
    if (adminPage) {
        switch (adminPage) {
            case 'dashboard':
                return <AdminDashboardPanel />;
            case 'users':
                return (
                    <UsersProvider>
                        <UserPanel/>
                    </UsersProvider>
            );
            case 'settings':
                return <AdminSettingsPanel />;
            case 'books':
                return (
                    <BooksProvider>
                        <BooksPanel />
                    </BooksProvider>
                );
            default:
                return <AdminDashboardPanel />;
        }
    }

    return <AdminDashboardPanel />;
}

export default AdminLinkProvider;