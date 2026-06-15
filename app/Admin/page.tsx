"use client";

import AdminLinkProvider from "@/modules/Admin/components/AdminLinkProvider";
import AdminSidebar from "@/modules/Admin/components/AdminSidebar";
import SidebarContainer from "@/modules/shared/components/SidebarContainer"
import { useAuth } from "@/modules/auth/contexts/authContext";


const AdminPanel = () =>{
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user || user.role !== "admin") {
        return <div className="min-h-screen flex items-center justify-center">Unauthorized</div>
    }

    return <div className="relative min-h-screen bg-secondary/50 overflow-hidden">
    <SidebarContainer isOpen={true} align="left">
        <AdminSidebar/>
    </SidebarContainer>
    <main className="ml-64 p-8">
        <AdminLinkProvider/>
    </main>
    </div>
}

export default AdminPanel