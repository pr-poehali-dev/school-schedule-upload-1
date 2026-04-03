"""
API для школьного портала: настройки, объявления, авторизация, фото расписания.
Все запросы идут на один endpoint, action передаётся в теле или query-параметре.
"""
import json
import os
import base64
import time
import psycopg2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(status, body):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(body, ensure_ascii=False, default=str),
    }


def check_admin(event):
    headers = event.get("headers") or {}
    token = headers.get("X-Admin-Token", "")
    return token.startswith("admin-token-")


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    body_raw = event.get("body") or "{}"
    try:
        body = json.loads(body_raw)
    except Exception:
        body = {}

    action = params.get("action") or body.get("action", "")

    # ── AUTH LOGIN ────────────────────────────────────────
    if action == "login":
        password = body.get("password", "")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT value FROM settings WHERE key = 'admin_password_hash'")
        row = cur.fetchone()
        conn.close()
        stored = row[0] if row else "admin123"
        if password == stored:
            token = f"admin-token-{stored[:4]}{len(stored)}"
            return resp(200, {"ok": True, "token": token})
        return resp(401, {"ok": False, "error": "Неверный пароль"})

    # ── SETTINGS GET ──────────────────────────────────────
    if action == "get_settings" or (action == "" and method == "GET"):
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM settings")
        rows = cur.fetchall()
        conn.close()
        settings = {r[0]: r[1] for r in rows}
        settings.pop("admin_password_hash", None)
        return resp(200, {"ok": True, "settings": settings})

    # ── SETTINGS SAVE ─────────────────────────────────────
    if action == "save_settings":
        if not check_admin(event):
            return resp(403, {"ok": False, "error": "Нет доступа"})
        allowed = [
            "site_name", "site_subtitle", "telegram_link", "telegram_admin",
            "school_address", "school_phone", "school_email", "ticker_text",
            "show_schedule_photo", "show_announcements", "show_contacts",
        ]
        conn = get_conn()
        cur = conn.cursor()
        data = body.get("settings", body)
        for k, v in data.items():
            if k in allowed:
                cur.execute(
                    "INSERT INTO settings (key, value, updated_at) VALUES (%s, %s, NOW()) "
                    "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                    (k, str(v))
                )
        new_pass = data.get("admin_password", "")
        if new_pass and len(new_pass) >= 4:
            cur.execute(
                "INSERT INTO settings (key, value, updated_at) VALUES ('admin_password_hash', %s, NOW()) "
                "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                (new_pass,)
            )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── ANNOUNCEMENTS GET ─────────────────────────────────
    if action == "get_announcements":
        is_admin = check_admin(event) or params.get("admin") == "1"
        conn = get_conn()
        cur = conn.cursor()
        if is_admin:
            cur.execute(
                "SELECT id, title, content, author, category, pinned, status, created_at "
                "FROM announcements ORDER BY pinned DESC, created_at DESC"
            )
        else:
            cur.execute(
                "SELECT id, title, content, author, category, pinned, status, created_at "
                "FROM announcements WHERE status = 'approved' ORDER BY pinned DESC, created_at DESC"
            )
        rows = cur.fetchall()
        conn.close()
        keys = ["id", "title", "content", "author", "category", "pinned", "status", "created_at"]
        return resp(200, {"ok": True, "announcements": [dict(zip(keys, r)) for r in rows]})

    # ── ANNOUNCEMENT CREATE ───────────────────────────────
    if action == "create_announcement":
        is_admin = check_admin(event)
        status = "approved" if is_admin else "pending"
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO announcements (title, content, author, category, pinned, status) "
            "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (
                body.get("title", ""),
                body.get("content", ""),
                body.get("author", "Аноним"),
                body.get("category", "admin"),
                body.get("pinned", False),
                status,
            )
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(200, {"ok": True, "id": new_id, "status": status})

    # ── ANNOUNCEMENT UPDATE STATUS ────────────────────────
    if action == "update_announcement":
        if not check_admin(event):
            return resp(403, {"ok": False, "error": "Нет доступа"})
        ann_id = body.get("id")
        new_status = body.get("status")
        if new_status not in ("approved", "rejected", "pending"):
            return resp(400, {"ok": False, "error": "Неверный статус"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "UPDATE announcements SET status = %s, updated_at = NOW() WHERE id = %s",
            (new_status, ann_id)
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── ANNOUNCEMENT DELETE ───────────────────────────────
    if action == "delete_announcement":
        if not check_admin(event):
            return resp(403, {"ok": False, "error": "Нет доступа"})
        ann_id = body.get("id")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM announcements WHERE id = %s", (ann_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── SCHEDULE PHOTO UPLOAD ─────────────────────────────
    if action == "upload_photo":
        if not check_admin(event):
            return resp(403, {"ok": False, "error": "Нет доступа"})
        import boto3
        image_b64 = body.get("image_base64", "")
        filename = body.get("filename", "schedule.jpg")
        class_name = body.get("class_name", None)
        if not image_b64:
            return resp(400, {"ok": False, "error": "Нет изображения"})
        image_data = base64.b64decode(image_b64)
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
        content_type = {
            "jpg": "image/jpeg", "jpeg": "image/jpeg",
            "png": "image/png", "webp": "image/webp"
        }.get(ext, "image/jpeg")
        key = f"schedule/{int(time.time())}_{filename}"
        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        s3.put_object(Bucket="files", Key=key, Body=image_data, ContentType=content_type)
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO schedule_photos (class_name, filename, url) VALUES (%s, %s, %s) RETURNING id",
            (class_name, filename, url)
        )
        photo_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(200, {"ok": True, "url": url, "id": photo_id})

    # ── SCHEDULE PHOTOS GET ───────────────────────────────
    if action == "get_photos":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, class_name, filename, url, uploaded_at "
            "FROM schedule_photos ORDER BY uploaded_at DESC"
        )
        rows = cur.fetchall()
        conn.close()
        keys = ["id", "class_name", "filename", "url", "uploaded_at"]
        return resp(200, {"ok": True, "photos": [dict(zip(keys, r)) for r in rows]})

    # ── SCHEDULE PHOTO DELETE ─────────────────────────────
    if action == "delete_photo":
        if not check_admin(event):
            return resp(403, {"ok": False, "error": "Нет доступа"})
        photo_id = body.get("id")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM schedule_photos WHERE id = %s", (photo_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    return resp(400, {"ok": False, "error": f"Неизвестное действие: '{action}'"})
