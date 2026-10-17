import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
