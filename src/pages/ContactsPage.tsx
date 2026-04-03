import Icon from "@/components/ui/icon";

const contacts = [
  {
    icon: "Phone",
    label: "Приёмная директора",
    value: "+7 (495) 123-45-67",
    color: "from-purple-600 to-violet-600",
    glow: "glow-purple",
  },
  {
    icon: "Phone",
    label: "Учительская",
    value: "+7 (495) 123-45-68",
    color: "from-blue-600 to-cyan-600",
    glow: "glow-cyan",
  },
  {
    icon: "Mail",
    label: "Электронная почта",
    value: "school@example.edu.ru",
    color: "from-pink-600 to-rose-600",
    glow: "glow-pink",
  },
  {
    icon: "MapPin",
    label: "Адрес",
    value: "г. Москва, ул. Школьная, д. 1",
    color: "from-amber-600 to-orange-600",
    glow: "",
  },
];

const schedule = [
  { day: "Понедельник – Пятница", time: "08:00 – 19:00" },
  { day: "Суббота", time: "09:00 – 15:00" },
  { day: "Воскресенье", time: "Выходной" },
];

const staff = [
  {
    name: "Александрова Марина Владимировна",
    role: "Директор",
    email: "director@school.ru",
    icon: "Crown",
  },
  {
    name: "Тихонов Сергей Борисович",
    role: "Завуч по учебной работе",
    email: "zavuch@school.ru",
    icon: "BookOpen",
  },
  {
    name: "Федорова Ольга Ивановна",
    role: "Психолог",
    email: "psych@school.ru",
    icon: "Heart",
  },
  {
    name: "Воронов Андрей Сергеевич",
    role: "Социальный педагог",
    email: "social@school.ru",
    icon: "Users",
  },
];

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-background bg-grid pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center glow-cyan">
              <Icon name="Phone" size={20} className="text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-white tracking-wide">
              КОНТАКТЫ
            </h1>
          </div>
          <p className="text-white/50">МАОУ «Средняя общеобразовательная школа №1»</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contacts.map((c, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-5 glass-hover animate-slide-up"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 ${c.glow}`}
                  >
                    <Icon name={c.icon} size={18} className="text-white" />
                  </div>
                  <p className="text-white/45 text-xs mb-1">{c.label}</p>
                  <p className="text-white font-semibold">{c.value}</p>
                </div>
              ))}
            </div>

            {/* Staff */}
            <div>
              <h2 className="font-display text-2xl font-bold text-white tracking-wide mb-4">
                АДМИНИСТРАЦИЯ
              </h2>
              <div className="space-y-3">
                {staff.map((s, i) => (
                  <div
                    key={i}
                    className="glass rounded-2xl p-4 flex items-center gap-4 glass-hover animate-slide-up"
                    style={{ animationDelay: `${0.3 + i * 0.07}s` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon name={s.icon} size={18} className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{s.name}</p>
                      <p className="text-white/45 text-xs">{s.role}</p>
                    </div>
                    <div className="flex-shrink-0 text-purple-400 text-xs">
                      {s.email}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Hours */}
            <div
              className="glass rounded-2xl p-5 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Clock" size={16} className="text-cyan-400" />
                <h3 className="font-display text-lg font-bold text-white tracking-wide">
                  РЕЖИМ РАБОТЫ
                </h3>
              </div>
              <div className="space-y-3">
                {schedule.map((s, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center text-sm ${
                      i === schedule.length - 1
                        ? "border-t border-white/10 pt-3"
                        : ""
                    }`}
                  >
                    <span className="text-white/60">{s.day}</span>
                    <span
                      className={`font-semibold ${
                        s.time === "Выходной" ? "text-red-400" : "text-white"
                      }`}
                    >
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="glass rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="h-48 bg-gradient-to-br from-purple-900/40 to-cyan-900/30 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-grid opacity-50" />
                <div className="relative text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/30 border-2 border-purple-400/60 flex items-center justify-center mx-auto mb-2 pulse-glow">
                    <Icon name="MapPin" size={20} className="text-purple-400" />
                  </div>
                  <p className="text-white/60 text-sm">ул. Школьная, д. 1</p>
                  <p className="text-white/30 text-xs">г. Москва</p>
                </div>
              </div>
              <div className="p-4">
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity glow-purple">
                  Открыть на карте
                </button>
              </div>
            </div>

            {/* Quick contact */}
            <div
              className="glass rounded-2xl p-5 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-display text-lg font-bold text-white tracking-wide mb-3">
                НАПИСАТЬ НАМ
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-colors"
                />
                <textarea
                  placeholder="Сообщение..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
                />
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity glow-pink">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
