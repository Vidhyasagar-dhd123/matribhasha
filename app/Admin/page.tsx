"use server";

import AdminLinkProvider from "@/modules/Admin/components/AdminLinkProvider";
import AdminSidebar from "@/modules/Admin/components/AdminSidebar";
import SidebarContainer from "@/modules/shared/components/SidebarContainer"


const AdminPanel = () =>{
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