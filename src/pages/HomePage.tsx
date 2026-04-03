import Icon from "@/components/ui/icon";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: "1 200", label: "Учеников", icon: "Users", color: "purple" },
  { value: "84", label: "Учителя", icon: "BookOpen", color: "pink" },
  { value: "32", label: "Класса", icon: "School", color: "cyan" },
  { value: "6", label: "Корпусов", icon: "Building2", color: "yellow" },
];

const quickLinks = [
  {
    title: "Расписание уроков",
    desc: "Актуальное расписание для всех классов на неделю",
    icon: "CalendarDays",
    page: "schedule",
    color: "from-purple-600 to-violet-600",
    glow: "glow-purple",
  },
  {
    title: "Объявления",
    desc: "Важные события, мероприятия и новости школы",
    icon: "Bell",
    page: "announcements",
    color: "from-pink-600 to-rose-600",
    glow: "glow-pink",
  },
  {
    title: "Контакты",
    desc: "Телефоны, адрес и режим работы администрации",
    icon: "Phone",
    page: "contacts",
    color: "from-cyan-600 to-teal-600",
    glow: "glow-cyan",
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-pink-600/15 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-purple-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Портал активен · 2025–2026 учебный год
          </div>

          <h1
            className="font-display text-5xl sm:text-7xl font-bold mb-6 leading-tight tracking-wide"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-white">ШКОЛА</span>
            <br />
            <span className="gradient-text">РАСПИСАНИЕ</span>
          </h1>

          <p
            className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Единый портал для учеников, учителей и родителей.
            Актуальное расписание, объявления и важные события — всё в одном месте.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => onNavigate("schedule")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-base hover:opacity-90 transition-all hover:scale-105 glow-purple"
            >
              Посмотреть расписание
            </button>
            <button
              onClick={() => onNavigate("announcements")}
              className="px-8 py-4 rounded-xl glass border border-white/15 text-white font-semibold text-base hover:bg-white/10 transition-all hover:scale-105"
            >
              Последние объявления
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 text-center glass-hover animate-slide-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div
                className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  stat.color === "purple"
                    ? "bg-purple-500/20 text-purple-400"
                    : stat.color === "pink"
                    ? "bg-pink-500/20 text-pink-400"
                    : stat.color === "cyan"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                <Icon name={stat.icon} size={20} />
              </div>
              <div className="font-display text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="font-display text-3xl font-bold text-white mb-8 tracking-wide">
          БЫСТРЫЙ ДОСТУП
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {quickLinks.map((link, i) => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`glass rounded-2xl p-6 text-left glass-hover group animate-slide-up`}
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 ${link.glow} group-hover:scale-110 transition-transform`}
              >
                <Icon name={link.icon} size={22} className="text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2 tracking-wide">
                {link.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{link.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-purple-400 text-sm font-medium">
                Открыть <Icon name="ArrowRight" size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* News ticker */}
      <section className="border-t border-white/5 bg-white/2 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <span className="flex-shrink-0 px-3 py-1 rounded-lg bg-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider">
            Новости
          </span>
          <p className="text-white/40 text-sm truncate">
            📣 Завтра, 4 апреля — родительское собрание в 18:00 · 🏆 Олимпиада по математике — 10 апреля · 🎨 Выставка рисунков в актовом зале
          </p>
        </div>
      </section>
    </div>
  );
}
