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
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-xs">
          <span>© 2026 МАОУ «Средняя общеобразовательная школа №4»</span>
          <a
            href="https://t.me/Schedule_Lessons4_LSK"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-500/60 hover:text-cyan-400 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-2.01 9.478c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.16 14.27l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.656.315z"/></svg>
            Мы в телеграме
          </a>
        </div>
      </footer>
    </div>
  );
}