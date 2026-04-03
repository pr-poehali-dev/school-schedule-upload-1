import { useState } from "react";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import SchedulePage from "@/pages/SchedulePage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import ContactsPage from "@/pages/ContactsPage";
import AdminPage from "@/pages/AdminPage";

type Page = "home" | "schedule" | "announcements" | "contacts" | "admin";

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={(p) => setCurrentPage(p as Page)} />;
      case "schedule":
        return <SchedulePage />;
      case "announcements":
        return <AnnouncementsPage />;
      case "contacts":
        return <ContactsPage />;
      case "admin":
        return <AdminPage />;
      default:
        return <HomePage onNavigate={(p) => setCurrentPage(p as Page)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p as Page)}
      />
      <main>{renderPage()}</main>
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/25 text-xs">
          <span>© 2026 МАОУ «Средняя общеобразовательная школа №1»</span>
          <span>Все права защищены</span>
        </div>
      </footer>
    </div>
  );
}
