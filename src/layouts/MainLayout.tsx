import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <main className="min-h-screen flex flex-col">
      <Topbar />
      <div className="min-w-full min-h-full flex grow">
        <Sidebar />
        <div className="p-4 grow overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
