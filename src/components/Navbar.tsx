import { useState } from "react";
import Icon from "@/components/ui/icon";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "schedule", label: "Расписание", icon: "CalendarDays" },
  { id: "announcements", label: "Объявления", icon: "Bell" },
  { id: "contacts", label: "Контакты", icon: "Phone" },
  { id: "admin", label: "Админ", icon: "Shield" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow-purple">
              <Icon name="GraduationCap" size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text tracking-wide">
              ШКОЛАПОРТАЛ
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                } ${item.id === "admin" ? "border border-pink-500/40 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10" : ""}`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
