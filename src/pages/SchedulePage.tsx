import { useState } from "react";
import Icon from "@/components/ui/icon";

const classes = ["5А", "5Б", "6А", "6Б", "7А", "7Б", "8А", "8Б", "9А", "9Б", "10А", "11А"];

const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

const scheduleData: Record<string, Record<string, { subject: string; teacher: string; room: string }[]>> = {
  "5А": {
    Понедельник: [
      { subject: "Математика", teacher: "Иванова А.П.", room: "201" },
      { subject: "Русский язык", teacher: "Смирнова Т.В.", room: "105" },
      { subject: "Физкультура", teacher: "Козлов Д.И.", room: "Зал" },
      { subject: "История", teacher: "Петрова Н.С.", room: "310" },
      { subject: "Биология", teacher: "Морозова Е.А.", room: "215" },
    ],
    Вторник: [
      { subject: "Литература", teacher: "Смирнова Т.В.", room: "105" },
      { subject: "Алгебра", teacher: "Иванова А.П.", room: "201" },
      { subject: "Химия", teacher: "Лебедева О.Н.", room: "220" },
      { subject: "Информатика", teacher: "Сидоров В.Г.", room: "Каб.ИТ" },
      { subject: "Английский", teacher: "Волкова М.П.", room: "112" },
    ],
    Среда: [
      { subject: "Математика", teacher: "Иванова А.П.", room: "201" },
      { subject: "География", teacher: "Орлова Л.Ф.", room: "308" },
      { subject: "Физкультура", teacher: "Козлов Д.И.", room: "Зал" },
      { subject: "Рисование", teacher: "Белова И.С.", room: "Студия" },
      { subject: "Музыка", teacher: "Зайцев К.О.", room: "Муз.класс" },
    ],
    Четверг: [
      { subject: "Физика", teacher: "Новиков А.В.", room: "205" },
      { subject: "Русский язык", teacher: "Смирнова Т.В.", room: "105" },
      { subject: "История", teacher: "Петрова Н.С.", room: "310" },
      { subject: "Алгебра", teacher: "Иванова А.П.", room: "201" },
      { subject: "Биология", teacher: "Морозова Е.А.", room: "215" },
    ],
    Пятница: [
      { subject: "Литература", teacher: "Смирнова Т.В.", room: "105" },
      { subject: "Физика", teacher: "Новиков А.В.", room: "205" },
      { subject: "Английский", teacher: "Волкова М.П.", room: "112" },
      { subject: "Информатика", teacher: "Сидоров В.Г.", room: "Каб.ИТ" },
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

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState("5А");
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const currentSchedule = scheduleData[selectedClass]?.[selectedDay] ?? [];

  const getColor = (subject: string) =>
    subjectColors[subject] || "bg-white/10 text-white/70 border-white/20";

  return (
    <div className="min-h-screen bg-background bg-grid pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center glow-purple">
              <Icon name="CalendarDays" size={20} className="text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-white tracking-wide">
              РАСПИСАНИЕ
            </h1>
          </div>
          <p className="text-white/50 ml-13">2025–2026 учебный год · I полугодие</p>
        </div>

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
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getColor(lesson.subject)}`}
                    >
                      {lesson.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/45 text-sm">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {lesson.teacher}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      Кабинет {lesson.room}
                    </span>
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
      </div>
    </div>
  );
}
