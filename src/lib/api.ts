const API_URL = "https://functions.poehali.dev/828ec061-75db-4b10-b606-b04ae3f75c98";

const TOKEN_KEY = "school_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdmin(): boolean {
  const t = getToken();
  return !!t && t.startsWith("admin-token-");
}

async function call(body: Record<string, unknown>, token?: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const t = token ?? getToken();
  if (t) headers["X-Admin-Token"] = t;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(params?: Record<string, string>) {
  const url = params
    ? `${API_URL}?${new URLSearchParams(params)}`
    : API_URL;
  const res = await fetch(url);
  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export async function login(password: string) {
  return call({ action: "login", password });
}

// ── Settings ──────────────────────────────────────────
export async function getSettings() {
  return get();
}

export async function saveSettings(settings: Record<string, string | boolean>) {
  return call({ action: "save_settings", settings });
}

// ── Announcements ─────────────────────────────────────
export async function getAnnouncements(adminMode = false) {
  return call({ action: "get_announcements" }, adminMode ? getToken() : null);
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  author: string;
  category: string;
  pinned: boolean;
}) {
  return call({ action: "create_announcement", ...data });
}

export async function updateAnnouncementStatus(id: number, status: "approved" | "rejected") {
  return call({ action: "update_announcement", id, status });
}

export async function deleteAnnouncement(id: number) {
  return call({ action: "delete_announcement", id });
}

// ── Schedule Photos ───────────────────────────────────
export async function getPhotos() {
  return call({ action: "get_photos" });
}

export async function uploadPhoto(file: File, className?: string) {
  return new Promise<{ ok: boolean; url?: string; id?: number; error?: string }>((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      const result = await call({
        action: "upload_photo",
        image_base64: base64,
        filename: file.name,
        class_name: className ?? null,
      });
      resolve(result);
    };
    reader.readAsDataURL(file);
  });
}

export async function deletePhoto(id: number) {
  return call({ action: "delete_photo", id });
}
