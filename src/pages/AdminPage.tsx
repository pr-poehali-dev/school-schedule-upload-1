import { useState } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_PASSWORD = "admin123";

interface PendingAnnouncement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student" | "parent";
  active: boolean;
}

const initialAnnouncements: PendingAnnouncement[] = [
  {
    id: 1,
    title: "Конкурс чтецов — запись участников",
    content: "Объявляется набор участников на школьный конкурс чтецов «Живое слово». Регистрация до 15 апреля.",
    author: "Смирнова Т.В.",
    date: "03.04.2026",
    status: "pending",
  },
  {
    id: 2,
    title: "Субботник — перенос даты",
    content: "В связи с прогнозируемыми осадками субботник переносится с 19 на 26 апреля.",
    author: "Федорова О.И.",
    date: "02.04.2026",
    status: "pending",
  },
  {
    id: 3,
    title: "Экскурсия в музей для 8 классов",
    content: "11 апреля запланирована экскурсия в Исторический музей. Стоимость: 350 рублей. Сбор у входа в 09:30.",
    author: "Петрова Н.С.",
    date: "01.04.2026",
    status: "pending",
  },
];

const initialUsers: User[] = [
  { id: 1, name: "Александрова М.В.", email: "director@school.ru", role: "admin", active: true },
  { id: 2, name: "Иванова А.П.", email: "ivanova@school.ru", role: "teacher", active: true },
  { id: 3, name: "Смирнова Т.В.", email: "smirnova@school.ru", role: "teacher", active: true },
  { id: 4, name: "Козлов Д.И.", email: "kozlov@school.ru", role: "teacher", active: true },
  { id: 5, name: "Петров А.Д.", email: "petrov_student@school.ru", role: "student", active: false },
  { id: 6, name: "Захаров В.Н.", email: "zakharov@school.ru", role: "parent", active: true },
];

const roleLabels: Record<User["role"], string> = {
  admin: "Администратор",
  teacher: "Учитель",
  student: "Ученик",
  parent: "Родитель",
};

const roleColors: Record<User["role"], string> = {
  admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  teacher: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  student: "bg-green-500/20 text-green-300 border-green-500/30",
  parent: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

type AdminTab = "overview" | "announcements" | "schedule" | "users";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [users, setUsers] = useState(initialUsers);
  const [scheduleFile, setScheduleFile] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Неверный пароль. Попробуйте ещё раз.");
    }
  };

  const handleAnnouncement = (id: number, action: "approved" | "rejected") => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
  };

  const toggleUserActive = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  const changeUserRole = (id: number, role: User["role"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const pendingCount = announcements.filter((a) => a.status === "pending").length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background bg-grid pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="glass rounded-3xl p-8 border border-pink-500/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center mx-auto mb-4 glow-pink">
                <Icon name="Shield" size={28} className="text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white tracking-wide mb-1">
                АДМИН-ПАНЕЛЬ
              </h1>
              <p className="text-white/40 text-sm">Доступ только для администраторов</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Пароль администратора</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Введите пароль..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-pink-500/60 focus:bg-white/8 transition-all text-sm"
                />
                {error && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-fade-in">
                    <Icon name="AlertCircle" size={12} />
                    {error}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:opacity-90 transition-all hover:scale-105 glow-pink"
              >
                Войти в панель
              </button>
            </div>

            <p className="text-center text-white/25 text-xs mt-6">
              Демо-пароль: <code className="text-pink-400/70">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: "overview", label: "Обзор", icon: "LayoutDashboard" },
    { id: "announcements", label: "Объявления", icon: "Bell", badge: pendingCount },
    { id: "schedule", label: "Расписание", icon: "CalendarDays" },
    { id: "users", label: "Пользователи", icon: "Users" },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center glow-pink">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white tracking-wide">
                АДМИН-ПАНЕЛЬ
              </h1>
              <p className="text-white/40 text-xs">Добро пожаловать, Администратор</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-sm transition-all"
          >
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white glow-pink"
                  : "glass border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
              {tab.badge && tab.badge > 0 ? (
                <span className="ml-1 w-5 h-5 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="animate-slide-up">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Ожидают проверки", value: pendingCount, icon: "Clock", color: "text-yellow-400", bg: "bg-yellow-500/15" },
                { label: "Пользователей", value: users.length, icon: "Users", color: "text-purple-400", bg: "bg-purple-500/15" },
                { label: "Активных учителей", value: users.filter(u => u.role === "teacher" && u.active).length, icon: "BookOpen", color: "text-blue-400", bg: "bg-blue-500/15" },
                { label: "Заблокировано", value: users.filter(u => !u.active).length, icon: "Lock", color: "text-red-400", bg: "bg-red-500/15" },
              ].map((s, i) => (
                <div key={i} className="glass rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                    <Icon name={s.icon} size={18} className={s.color} />
                  </div>
                  <div className={`font-display text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-white/50 text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-white tracking-wide mb-4">ПОСЛЕДНИЕ ДЕЙСТВИЯ</h3>
              <div className="space-y-3">
                {[
                  { icon: "CheckCircle", text: "Объявление «Родительское собрание» опубликовано", time: "2 ч назад", color: "text-green-400" },
                  { icon: "Upload", text: "Загружено расписание для 8А класса", time: "5 ч назад", color: "text-purple-400" },
                  { icon: "UserCheck", text: "Активирован аккаунт Иванова А.П.", time: "1 дн назад", color: "text-blue-400" },
                  { icon: "XCircle", text: "Отклонено объявление о сборе средств", time: "2 дн назад", color: "text-red-400" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Icon name={a.icon} size={16} className={a.color} />
                    <span className="text-white/70 flex-1">{a.text}</span>
                    <span className="text-white/30 text-xs">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements moderation */}
        {activeTab === "announcements" && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={14} className="text-white/40" />
              <p className="text-white/40 text-sm">Объявления ожидают проверки перед публикацией</p>
            </div>
            {announcements.map((a) => (
              <div key={a.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{a.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                        a.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                        a.status === "approved" ? "bg-green-500/20 text-green-300 border-green-500/30" :
                        "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}>
                        {a.status === "pending" ? "На проверке" : a.status === "approved" ? "Опубликовано" : "Отклонено"}
                      </span>
                    </div>
                    <p className="text-white/45 text-xs flex items-center gap-2">
                      <Icon name="User" size={11} /> {a.author} · {a.date}
                    </p>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">{a.content}</p>
                {a.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAnnouncement(a.id, "approved")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium hover:bg-green-500/30 transition-all"
                    >
                      <Icon name="CheckCircle" size={14} /> Опубликовать
                    </button>
                    <button
                      onClick={() => handleAnnouncement(a.id, "rejected")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/30 transition-all"
                    >
                      <Icon name="XCircle" size={14} /> Отклонить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Schedule upload */}
        {activeTab === "schedule" && (
          <div className="animate-slide-up space-y-6">
            <div className="glass rounded-2xl p-6 border border-dashed border-white/20">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Upload" size={28} className="text-purple-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-white tracking-wide mb-2">
                  ЗАГРУЗИТЬ РАСПИСАНИЕ
                </h3>
                <p className="text-white/45 text-sm mb-6">Поддерживаются форматы: Excel (.xlsx), PDF, изображения</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".xlsx,.pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setScheduleFile(file.name);
                    }}
                  />
                  <span className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity glow-purple inline-block">
                    Выбрать файл
                  </span>
                </label>
                {scheduleFile && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm animate-fade-in">
                    <Icon name="CheckCircle" size={16} />
                    Выбран файл: <strong>{scheduleFile}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-white tracking-wide mb-4">ЗАГРУЖЕННЫЕ ФАЙЛЫ</h3>
              <div className="space-y-3">
                {[
                  { name: "schedule_5-6_classes_april.xlsx", date: "01.04.2026", size: "24 КБ" },
                  { name: "schedule_7-9_classes_april.xlsx", date: "01.04.2026", size: "31 КБ" },
                  { name: "schedule_10-11_classes_april.xlsx", date: "31.03.2026", size: "18 КБ" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/4 hover:bg-white/8 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon name="FileSpreadsheet" size={16} className="text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm truncate">{f.name}</p>
                      <p className="text-white/35 text-xs">{f.date} · {f.size}</p>
                    </div>
                    <button className="text-white/30 hover:text-red-400 transition-colors">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="animate-slide-up">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-white tracking-wide">
                  ПОЛЬЗОВАТЕЛИ ({users.length})
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-sm font-medium hover:bg-purple-500/30 transition-all">
                  <Icon name="UserPlus" size={14} />
                  Добавить
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {users.map((u) => (
                  <div key={u.id} className="p-4 flex items-center gap-4 hover:bg-white/3 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/40 to-pink-600/40 flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={16} className="text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${u.active ? "text-white" : "text-white/40"}`}>
                        {u.name}
                      </p>
                      <p className="text-white/35 text-xs">{u.email}</p>
                    </div>
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u.id, e.target.value as User["role"])}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border bg-transparent cursor-pointer focus:outline-none ${roleColors[u.role]}`}
                    >
                      <option value="admin" className="bg-background text-white">Администратор</option>
                      <option value="teacher" className="bg-background text-white">Учитель</option>
                      <option value="student" className="bg-background text-white">Ученик</option>
                      <option value="parent" className="bg-background text-white">Родитель</option>
                    </select>
                    <button
                      onClick={() => toggleUserActive(u.id)}
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        u.active
                          ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400"
                          : "bg-red-500/20 text-red-400 hover:bg-green-500/20 hover:text-green-400"
                      }`}
                      title={u.active ? "Заблокировать" : "Разблокировать"}
                    >
                      <Icon name={u.active ? "UserCheck" : "UserX"} size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
