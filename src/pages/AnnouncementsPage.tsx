import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getAnnouncements } from "@/lib/api";

type AnnouncementCategory = "all" | "events" | "academic" | "admin" | "sport";

interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: Exclude<AnnouncementCategory, "all">;
  pinned: boolean;
  status: string;
}

const categories = [
  { id: "all", label: "Все", icon: "LayoutGrid" },
  { id: "admin", label: "Администрация", icon: "Building" },
  { id: "academic", label: "Учёба", icon: "BookOpen" },
  { id: "events", label: "События", icon: "Sparkles" },
  { id: "sport", label: "Спорт", icon: "Trophy" },
];

const categoryStyles: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  academic: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  events: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  sport: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const categoryLabels: Record<string, string> = {
  admin: "Администрация",
  academic: "Учёба",
  events: "Событие",
  sport: "Спорт",
};

export default function AnnouncementsPage() {
  const [activeCategory, setActiveCategory] = useState<AnnouncementCategory>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnnouncements(false).then((res) => {
      if (res.ok && res.announcements) {
        setAnnouncements(
          res.announcements.map((a: Record<string, unknown>) => ({
            ...a,
            date: new Date(a.created_at as string).toLocaleDateString("ru-RU"),
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const filtered = announcements.filter(
    (a) => activeCategory === "all" || a.category === activeCategory
  );
  const pinned = filtered.filter((a) => a.pinned);
  const regular = filtered.filter((a) => !a.pinned);

  return (
    <div className="min-h-screen bg-background bg-grid pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center glow-pink">
              <Icon name="Bell" size={20} className="text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-white tracking-wide">ОБЪЯВЛЕНИЯ</h1>
          </div>
          <p className="text-white/50">{loading ? "Загрузка..." : `${filtered.length} объявлений`}</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as AnnouncementCategory)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white glow-pink"
                  : "glass border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <Icon name={cat.icon} size={14} />
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-3 w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-yellow-400 text-sm font-medium">
                  <Icon name="Pin" size={14} />
                  Закреплённые
                </div>
                <div className="space-y-3">
                  {pinned.map((a, i) => (
                    <AnnouncementCard
                      key={a.id}
                      a={a}
                      expanded={expandedId === a.id}
                      onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
                      delay={i * 0.05}
                      pinned
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {regular.map((a, i) => (
                <AnnouncementCard
                  key={a.id}
                  a={a}
                  expanded={expandedId === a.id}
                  onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
                  delay={i * 0.05 + 0.1}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="glass rounded-2xl p-12 text-center animate-fade-in">
                <Icon name="BellOff" size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40">Объявлений в этой категории нет</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({
  a, expanded, onToggle, delay, pinned,
}: {
  a: Announcement;
  expanded: boolean;
  onToggle: () => void;
  delay: number;
  pinned?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl overflow-hidden glass-hover cursor-pointer animate-slide-up ${
        pinned ? "border border-yellow-500/25" : ""
      }`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onToggle}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                  categoryStyles[a.category] || "bg-white/10 text-white/60 border-white/20"
                }`}
              >
                {categoryLabels[a.category] || a.category}
              </span>
              {pinned && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                  📌 Закреплено
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white text-base leading-snug mb-1">{a.title}</h3>
            <p className="text-white/40 text-xs flex items-center gap-1">
              <Icon name="Calendar" size={11} />
              {a.date}
              {a.author && a.author !== "Администрация" && (
                <span className="ml-2 flex items-center gap-1">
                  <Icon name="User" size={11} />
                  {a.author}
                </span>
              )}
            </p>
          </div>
          <Icon
            name={expanded ? "ChevronUp" : "ChevronDown"}
            size={18}
            className="text-white/30 flex-shrink-0 mt-1"
          />
        </div>
        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
            <p className="text-white/70 text-sm leading-relaxed">{a.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
