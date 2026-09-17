"use client";
import { useSearchParams } from "next/navigation";
import BooksPanel from "./BooksPanel";
import { BooksProvider } from "../contexts/BooksContext";
import UserPanel from "./UserPanel";
import { UsersProvider } from "../contexts/UserContext";
import AdminDashboardPanel from "./AdminDashboardPanel";
import AdminSettingsPanel from "./AdminSettingsPanel";
import PdfIntelligencePanel from "./PdfIntelligencePanel";


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
            case 'pdf-ai':
                return <PdfIntelligencePanel />;
            default:
                return <AdminDashboardPanel />;
        }
    }

    return <AdminDashboardPanel />;
}

export default AdminLinkProvider;