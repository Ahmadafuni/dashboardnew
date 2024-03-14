import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <Topbar />
      <div className="min-w-full min-h-full flex grow">
        <Sidebar />
        <Outlet />
      </div>
    </main>
  );
}
