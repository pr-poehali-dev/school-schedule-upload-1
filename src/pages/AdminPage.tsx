import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  login, setToken, removeToken, getToken, getSettings, saveSettings,
  getAnnouncements, updateAnnouncementStatus, deleteAnnouncement, createAnnouncement,
  getPhotos, uploadPhoto, deletePhoto,
} from "@/lib/api";

interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  pinned: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface SchedulePhoto {
  id: number;
  class_name: string | null;
  filename: string;
  url: string;
  uploaded_at: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  teacher: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  student: "bg-green-500/20 text-green-300 border-green-500/30",
  parent: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

type AdminTab = "overview" | "announcements" | "schedule" | "settings";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const t = getToken();
    return !!t && t.startsWith("admin-token-");
  });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: "", content: "", author: "Администрация", category: "admin", pinned: false });
  const [showNewAnn, setShowNewAnn] = useState(false);
  const [annSaving, setAnnSaving] = useState(false);

  // Schedule photos
  const [photos, setPhotos] = useState<SchedulePhoto[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Settings
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "Расписание уроков школа №4",
    site_subtitle: "2025–2026 учебный год",
    telegram_link: "https://t.me/Schedule_Lessons4_LSK",
    telegram_admin: "@Germann12_21",
    school_address: "г. Москва, ул. Школьная, д. 1",
    school_phone: "+7 (495) 123-45-67",
    school_email: "school@example.edu.ru",
    ticker_text: "",
    admin_password: "",
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Load data when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    loadAnnouncements();
    loadPhotos();
    loadSettings();
  }, [isLoggedIn]);

  const loadAnnouncements = async () => {
    setAnnLoading(true);
    const res = await getAnnouncements(true);
    if (res.ok) setAnnouncements(res.announcements || []);
    setAnnLoading(false);
  };

  const loadPhotos = async () => {
    const res = await getPhotos();
    if (res.ok) setPhotos(res.photos || []);
  };

  const loadSettings = async () => {
    const res = await getSettings();
    if (res.ok && res.settings) {
      setSettings((prev) => ({ ...prev, ...res.settings, admin_password: "" }));
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    const res = await login(password);
    if (res.ok && res.token) {
      setToken(res.token);
      setIsLoggedIn(true);
    } else {
      setLoginError(res.error || "Неверный пароль. Попробуйте ещё раз.");
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setPassword("");
  };

  const handleAnnouncementAction = async (id: number, action: "approved" | "rejected") => {
    await updateAnnouncementStatus(id, action);
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
  };

  const handleDeleteAnnouncement = async (id: number) => {
    await deleteAnnouncement(id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnn.title.trim() || !newAnn.content.trim()) return;
    setAnnSaving(true);
    const res = await createAnnouncement(newAnn);
    if (res.ok) {
      await loadAnnouncements();
      setNewAnn({ title: "", content: "", author: "Администрация", category: "admin", pinned: false });
      setShowNewAnn(false);
    }
    setAnnSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setPhotoError(null);
    const res = await uploadPhoto(file);
    if (res.ok) {
      await loadPhotos();
    } else {
      setPhotoError(res.error || "Ошибка загрузки");
    }
    setPhotoUploading(false);
    e.target.value = "";
  };

  const handleDeletePhoto = async (id: number) => {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    const payload: Record<string, string | boolean> = { ...settings };
    if (!payload.admin_password) delete payload.admin_password;
    await saveSettings(payload);
    setSettingsSaved(true);
    setSettingsSaving(false);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const pendingCount = announcements.filter((a) => a.status === "pending").length;

  // ── LOGIN SCREEN ──────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background bg-grid pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="glass rounded-3xl p-8 border border-pink-500/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center mx-auto mb-4 glow-pink">
                <Icon name="Shield" size={28} className="text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white tracking-wide mb-1">АДМИН-ПАНЕЛЬ</h1>
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
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
                {loginError && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-fade-in">
                    <Icon name="AlertCircle" size={12} />
                    {loginError}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:opacity-90 transition-all hover:scale-105 glow-pink disabled:opacity-50 disabled:scale-100"
              >
                {loginLoading ? "Проверяю..." : "Войти в панель"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: "overview", label: "Обзор", icon: "LayoutDashboard" },
    { id: "announcements", label: "Объявления", icon: "Bell", badge: pendingCount },
    { id: "schedule", label: "Расписание", icon: "CalendarDays" },
    { id: "settings", label: "Настройки", icon: "Settings" },
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
              <h1 className="font-display text-3xl font-bold text-white tracking-wide">АДМИН-ПАНЕЛЬ</h1>
              <p className="text-white/40 text-xs">Добро пожаловать, Администратор</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
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

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="animate-slide-up space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Ожидают проверки", value: pendingCount, icon: "Clock", color: "text-yellow-400", bg: "bg-yellow-500/15" },
                { label: "Всего объявлений", value: announcements.length, icon: "Bell", color: "text-purple-400", bg: "bg-purple-500/15" },
                { label: "Фото расписания", value: photos.length, icon: "Image", color: "text-cyan-400", bg: "bg-cyan-500/15" },
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

            {pendingCount > 0 && (
              <div className="glass rounded-2xl p-5 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Clock" size={16} className="text-yellow-400" />
                  <h3 className="font-semibold text-yellow-400">
                    {pendingCount} {pendingCount === 1 ? "объявление ожидает" : "объявления ожидают"} проверки
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("announcements")}
                  className="text-sm text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                >
                  Перейти к модерации <Icon name="ArrowRight" size={14} />
                </button>
              </div>
            )}

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-white tracking-wide mb-4">ПОСЛЕДНИЕ ОБЪЯВЛЕНИЯ</h3>
              {annLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {announcements.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 text-sm py-2 border-b border-white/5 last:border-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        a.status === "approved" ? "bg-green-400" :
                        a.status === "rejected" ? "bg-red-400" : "bg-yellow-400"
                      }`} />
                      <span className="text-white/70 flex-1 truncate">{a.title}</span>
                      <span className="text-white/30 text-xs flex-shrink-0">
                        {new Date(a.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ANNOUNCEMENTS ── */}
        {activeTab === "announcements" && (
          <div className="animate-slide-up space-y-4">

            {/* New announcement form */}
            <div className="glass rounded-2xl p-5 border border-purple-500/20">
              <button
                onClick={() => setShowNewAnn(!showNewAnn)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="flex items-center gap-2 font-semibold text-white">
                  <Icon name="PlusCircle" size={18} className="text-purple-400" />
                  Создать новое объявление
                </span>
                <Icon name={showNewAnn ? "ChevronUp" : "ChevronDown"} size={16} className="text-white/40" />
              </button>

              {showNewAnn && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <input
                    value={newAnn.title}
                    onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                    placeholder="Заголовок объявления"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-colors"
                  />
                  <textarea
                    value={newAnn.content}
                    onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                    placeholder="Текст объявления..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
                  />
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={newAnn.category}
                      onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value })}
                      className="bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                    >
                      <option value="admin" className="bg-background">Администрация</option>
                      <option value="academic" className="bg-background">Учёба</option>
                      <option value="events" className="bg-background">Событие</option>
                      <option value="sport" className="bg-background">Спорт</option>
                    </select>
                    <input
                      value={newAnn.author}
                      onChange={(e) => setNewAnn({ ...newAnn, author: e.target.value })}
                      placeholder="Автор"
                      className="flex-1 min-w-32 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/60"
                    />
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/15 cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={newAnn.pinned}
                        onChange={(e) => setNewAnn({ ...newAnn, pinned: e.target.checked })}
                        className="accent-purple-500"
                      />
                      <span className="text-white/70 text-sm">📌 Закрепить</span>
                    </label>
                  </div>
                  <button
                    onClick={handleCreateAnnouncement}
                    disabled={annSaving || !newAnn.title.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 glow-purple"
                  >
                    {annSaving ? "Публикую..." : "Опубликовать"}
                  </button>
                </div>
              )}
            </div>

            {/* Announcements list */}
            {annLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="glass rounded-2xl h-24 animate-pulse" />)}
              </div>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
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
                        {a.pinned && <span className="text-yellow-400 text-xs">📌</span>}
                      </div>
                      <p className="text-white/40 text-xs">
                        {a.author} · {new Date(a.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(a.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-all"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                  <p className="text-white/60 text-sm mb-4 leading-relaxed">{a.content}</p>
                  {a.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAnnouncementAction(a.id, "approved")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium hover:bg-green-500/30 transition-all"
                      >
                        <Icon name="CheckCircle" size={14} /> Опубликовать
                      </button>
                      <button
                        onClick={() => handleAnnouncementAction(a.id, "rejected")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/30 transition-all"
                      >
                        <Icon name="XCircle" size={14} /> Отклонить
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

            {!annLoading && announcements.length === 0 && (
              <div className="glass rounded-2xl p-12 text-center">
                <Icon name="BellOff" size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40">Объявлений пока нет</p>
              </div>
            )}
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {activeTab === "schedule" && (
          <div className="animate-slide-up space-y-6">
            <div className="glass rounded-2xl p-6 border border-dashed border-white/20">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Upload" size={28} className="text-purple-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-white tracking-wide mb-2">ЗАГРУЗИТЬ ФОТО РАСПИСАНИЯ</h3>
                <p className="text-white/45 text-sm mb-6">JPG, PNG, WEBP — фото сохранится в облаке</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={photoUploading}
                  />
                  <span className={`px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-sm transition-opacity glow-purple inline-flex items-center gap-2 ${photoUploading ? "opacity-60" : "hover:opacity-90 cursor-pointer"}`}>
                    <Icon name={photoUploading ? "Loader" : "ImagePlus"} size={16} className={photoUploading ? "animate-spin" : ""} />
                    {photoUploading ? "Загружаю..." : "Выбрать фото"}
                  </span>
                </label>
                {photoError && (
                  <p className="text-red-400 text-sm mt-3 flex items-center justify-center gap-1">
                    <Icon name="AlertCircle" size={14} /> {photoError}
                  </p>
                )}
              </div>
            </div>

            {photos.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="font-display text-xl font-bold text-white tracking-wide mb-4">
                  ЗАГРУЖЕННЫЕ ФОТО ({photos.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="rounded-xl overflow-hidden border border-white/10 bg-white/3">
                      <img src={photo.url} alt={photo.filename} className="w-full h-40 object-cover" />
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-xs truncate max-w-32">{photo.filename}</p>
                          <p className="text-white/30 text-xs">{new Date(photo.uploaded_at).toLocaleDateString("ru-RU")}</p>
                        </div>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-all"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "settings" && (
          <div className="animate-slide-up space-y-6">

            {settingsSaved && (
              <div className="glass rounded-xl px-5 py-3 flex items-center gap-3 border border-green-500/40 animate-fade-in">
                <Icon name="CheckCircle" size={18} className="text-green-400" />
                <span className="text-green-400 font-semibold text-sm">Настройки сохранены!</span>
              </div>
            )}

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Icon name="Globe" size={16} className="text-purple-400" />
                <h3 className="font-display text-xl font-bold text-white tracking-wide">ОБЩИЕ</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "site_name", label: "Название сайта" },
                  { key: "site_subtitle", label: "Подзаголовок" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-white/50 text-xs mb-1.5 block">{label}</label>
                    <input
                      value={settings[key] ?? ""}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 transition-colors"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-white/50 text-xs mb-1.5 block">Бегущая строка новостей</label>
                  <input
                    value={settings.ticker_text ?? ""}
                    onChange={(e) => setSettings({ ...settings, ticker_text: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Icon name="Phone" size={16} className="text-cyan-400" />
                <h3 className="font-display text-xl font-bold text-white tracking-wide">КОНТАКТЫ</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "school_address", label: "Адрес школы" },
                  { key: "school_phone", label: "Телефон" },
                  { key: "school_email", label: "Email" },
                  { key: "telegram_admin", label: "Telegram администратора" },
                  { key: "telegram_link", label: "Ссылка Telegram-канала" },
                ].map(({ key, label }) => (
                  <div key={key} className={key === "telegram_link" ? "sm:col-span-2" : ""}>
                    <label className="text-white/50 text-xs mb-1.5 block">{label}</label>
                    <input
                      value={settings[key] ?? ""}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Icon name="Lock" size={16} className="text-red-400" />
                <h3 className="font-display text-xl font-bold text-white tracking-wide">СМЕНА ПАРОЛЯ</h3>
              </div>
              <div className="max-w-sm">
                <label className="text-white/50 text-xs mb-1.5 block">Новый пароль</label>
                <input
                  type="password"
                  value={settings.admin_password ?? ""}
                  onChange={(e) => setSettings({ ...settings, admin_password: e.target.value })}
                  placeholder="Оставьте пустым, чтобы не менять"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/60 transition-colors"
                />
                <p className="text-white/30 text-xs mt-1.5">Минимум 4 символа</p>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={settingsSaving}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base hover:opacity-90 transition-all hover:scale-[1.01] glow-purple disabled:opacity-60 disabled:scale-100"
            >
              {settingsSaving ? "Сохраняю..." : "Сохранить настройки"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
