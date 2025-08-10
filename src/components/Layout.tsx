import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-800">

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
