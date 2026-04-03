import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getPhotos, isAdmin, uploadPhoto, deletePhoto } from "@/lib/api";

const classes = ["5А", "5Б", "6А", "6Б", "7А", "7Б", "8А", "8Б", "9А", "9Б", "10А", "11А"];
const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

const scheduleData: Record<string, Record<string, { subject: string; room: string }[]>> = {
  "5А": {
    Понедельник: [
      { subject: "Математика", room: "201" },
      { subject: "Русский язык", room: "105" },
      { subject: "Физкультура", room: "Зал" },
      { subject: "История", room: "310" },
      { subject: "Биология", room: "215" },
    ],
    Вторник: [
      { subject: "Литература", room: "105" },
      { subject: "Алгебра", room: "201" },
      { subject: "Химия", room: "220" },
      { subject: "Информатика", room: "Каб.ИТ" },
      { subject: "Английский", room: "112" },
    ],
    Среда: [
      { subject: "Математика", room: "201" },
      { subject: "География", room: "308" },
      { subject: "Физкультура", room: "Зал" },
      { subject: "Рисование", room: "Студия" },
      { subject: "Музыка", room: "Муз.класс" },
    ],
    Четверг: [
      { subject: "Физика", room: "205" },
      { subject: "Русский язык", room: "105" },
      { subject: "История", room: "310" },
      { subject: "Алгебра", room: "201" },
      { subject: "Биология", room: "215" },
    ],
    Пятница: [
      { subject: "Литература", room: "105" },
      { subject: "Физика", room: "205" },
      { subject: "Английский", room: "112" },
      { subject: "Информатика", room: "Каб.ИТ" },
    ],
  },
};

const subjectColors: Record<string, string> = {
  Математика: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Алгебра: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Физика: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Химия: "bg-green-500/20 text-green-300 border-green-500/30",
  Биология: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  История: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Литература: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Русский язык": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Английский: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Информатика: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Физкультура: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  География: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Рисование: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Музыка: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const todayIndex = new Date().getDay() - 1;
const defaultDay = todayIndex >= 0 && todayIndex < 5 ? days[todayIndex] : days[0];

type ViewMode = "list" | "photo";

interface SchedulePhoto {
  id: number;
  class_name: string | null;
  filename: string;
  url: string;
  uploaded_at: string;
}

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState("5А");
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [photos, setPhotos] = useState<SchedulePhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const adminMode = isAdmin();

  useEffect(() => {
    getPhotos().then((res) => {
      if (res.ok && res.photos) setPhotos(res.photos);
    });
  }, []);

  const currentSchedule = scheduleData[selectedClass]?.[selectedDay] ?? [];
  const getColor = (subject: string) =>
    subjectColors[subject] || "bg-white/10 text-white/70 border-white/20";

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const res = await uploadPhoto(file);
    if (res.ok && res.url) {
      const updated = await getPhotos();
      if (updated.ok) setPhotos(updated.photos);
    } else {
      setUploadError(res.error || "Ошибка загрузки");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDeletePhoto = async (id: number) => {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background bg-grid pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center glow-purple">
                <Icon name="CalendarDays" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold text-white tracking-wide">
                  РАСПИСАНИЕ УРОКОВ
                </h1>
                <p className="text-white/50 text-sm">Школа №4 · 2025–2026 учебный год</p>
              </div>
            </div>
            {/* View mode toggle */}
            <div className="flex items-center gap-1 glass rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon name="List" size={15} />
                По урокам
              </button>
              <button
                onClick={() => setViewMode("photo")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "photo"
                    ? "bg-pink-600 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon name="Image" size={15} />
                Фото
              </button>
            </div>
          </div>
        </div>

        {/* Photo mode */}
        {viewMode === "photo" && (
          <div className="animate-slide-up space-y-4">

            {/* Upload block — только для админа */}
            {adminMode && (
              <div className="glass rounded-2xl p-6 border border-purple-500/20">
                <h3 className="font-display text-xl font-bold text-white tracking-wide mb-1">
                  ЗАГРУЗИТЬ РАСПИСАНИЕ
                </h3>
                <p className="text-white/45 text-sm mb-5">Фото сохранится и будет видно всем ученикам</p>
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all group ${
                    uploading
                      ? "border-purple-500/30 bg-purple-500/5"
                      : "border-white/15 hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer"
                  }`}>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Icon name={uploading ? "Loader" : "ImagePlus"} size={22} className={`text-purple-400 ${uploading ? "animate-spin" : ""}`} />
                    </div>
                    <p className="text-white/60 font-semibold text-sm">
                      {uploading ? "Загружаю..." : "Нажмите, чтобы добавить фото"}
                    </p>
                    <p className="text-white/30 text-xs mt-1">JPG, PNG, WEBP</p>
                  </div>
                </label>
                {uploadError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {uploadError}
                  </p>
                )}
              </div>
            )}

            {/* Photos list */}
            {photos.length > 0 ? (
              <div className="space-y-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="glass rounded-2xl overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full object-contain max-h-[80vh]"
                    />
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm">{photo.filename}</p>
                        <p className="text-white/30 text-xs">
                          {new Date(photo.uploaded_at).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                      {adminMode && (
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm hover:bg-red-500/30 transition-all"
                        >
                          <Icon name="Trash2" size={14} />
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center">
                <Icon name="ImageOff" size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Фото расписания ещё не загружено</p>
                {!adminMode && (
                  <p className="text-white/25 text-xs mt-1">Обратитесь к администратору</p>
                )}
              </div>
            )}

            {!adminMode && (
              <div className="glass rounded-2xl p-4 flex items-center gap-3">
                <Icon name="Info" size={16} className="text-cyan-400 flex-shrink-0" />
                <p className="text-white/50 text-sm">
                  Фото загружает администратор через{" "}
                  <span className="text-purple-400">Админ-панель → Расписание</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* List mode */}
        {viewMode === "list" && (
          <>
            {/* Class selector */}
            <div className="glass rounded-2xl p-4 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Users" size={14} className="text-white/50" />
                <span className="text-white/50 text-sm font-medium">Класс</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedClass === cls
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white glow-purple scale-105"
                        : "glass border border-white/10 text-white/60 hover:text-white hover:border-white/25"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Day selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              {days.map((day, i) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedDay === day
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white glow-pink"
                      : "glass border border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  <span className="block text-xs font-normal opacity-60 mb-0.5">
                    {["Пн", "Вт", "Ср", "Чт", "Пт"][i]}
                  </span>
                  {day}
                </button>
              ))}
            </div>

            {/* Schedule list */}
            <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {currentSchedule.length > 0 ? (
                currentSchedule.map((lesson, i) => (
                  <div
                    key={i}
                    className="glass rounded-2xl p-5 flex items-center gap-5 glass-hover"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-white/40">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getColor(lesson.subject)}`}
                      >
                        {lesson.subject}
                      </span>
                      <div className="flex items-center gap-1 text-white/40 text-sm mt-2">
                        <Icon name="MapPin" size={12} />
                        Кабинет {lesson.room}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-white/30 text-xs">
                      {["08:00", "08:50", "09:40", "10:40", "11:30", "12:20"][i] ?? ""}–
                      {["08:45", "09:35", "10:25", "11:25", "12:15", "13:05"][i] ?? ""}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass rounded-2xl p-12 text-center">
                  <Icon name="CalendarOff" size={40} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    Расписание для класса <strong>{selectedClass}</strong> на{" "}
                    <strong>{selectedDay}</strong> ещё не загружено
                  </p>
                  <p className="text-white/25 text-xs mt-1">Обратитесь к администратору</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}