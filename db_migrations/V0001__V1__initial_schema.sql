
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('site_name', 'Расписание уроков школа №4'),
  ('site_subtitle', '2025–2026 учебный год'),
  ('telegram_link', 'https://t.me/Schedule_Lessons4_LSK'),
  ('telegram_admin', '@Germann12_21'),
  ('school_address', 'г. Москва, ул. Школьная, д. 1'),
  ('school_phone', '+7 (495) 123-45-67'),
  ('school_email', 'school@example.edu.ru'),
  ('ticker_text', '📣 Завтра, 4 апреля — родительское собрание в 18:00 · 🏆 Олимпиада по математике — 10 апреля · 🎨 Выставка рисунков в актовом зале'),
  ('admin_password_hash', 'admin123'),
  ('show_schedule_photo', 'true'),
  ('show_announcements', 'true'),
  ('show_contacts', 'true')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Администрация',
  category TEXT NOT NULL DEFAULT 'admin',
  pinned BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO announcements (title, content, author, category, pinned, status) VALUES
  ('Родительское собрание — 4 апреля', 'Уважаемые родители! Приглашаем на общешкольное родительское собрание 4 апреля в 18:00. Повестка: итоги третьей четверти, летние мероприятия, подготовка к ОГЭ и ЕГЭ.', 'Администрация', 'admin', TRUE, 'approved'),
  ('Олимпиада по математике', '10 апреля в 09:00 пройдёт школьный этап олимпиады по математике. Участвуют ученики 7–11 классов. Регистрация до 8 апреля у классного руководителя.', 'Администрация', 'academic', TRUE, 'approved'),
  ('Весенний спортивный фестиваль', '12–13 апреля состоится ежегодный весенний спортивный фестиваль. В программе: футбол, волейбол, легкая атлетика. Запись у учителя физкультуры.', 'Администрация', 'sport', FALSE, 'approved'),
  ('Конкурс чтецов — запись участников', 'Объявляется набор участников на школьный конкурс чтецов «Живое слово». Регистрация до 15 апреля.', 'Смирнова Т.В.', 'events', FALSE, 'pending'),
  ('Субботник — перенос даты', 'В связи с прогнозируемыми осадками субботник переносится с 19 на 26 апреля.', 'Федорова О.И.', 'events', FALSE, 'pending');

CREATE TABLE schedule_photos (
  id SERIAL PRIMARY KEY,
  class_name TEXT,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
