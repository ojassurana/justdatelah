import json
import logging
import os
import re
import uuid
from datetime import date, datetime

from fastapi import FastAPI, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from supabase import create_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# --- Supabase ---
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# --- Telegram ---
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://justdatelah.com")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://justdatelah-eight.vercel.app",
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ETHNICITIES = [
    "Chinese", "Malay", "Indian", "Eurasian", "Filipino",
    "Indonesian", "Caucasian/White", "Japanese", "Korean",
    "Other", "Prefer not to say",
]

ATTRACTED_ETHNICITIES = [
    "Chinese", "Malay", "Indian", "Eurasian", "Filipino",
    "Indonesian", "Caucasian/White", "Japanese", "Korean",
    "Other", "No preference",
]

GENDERS = ["Female", "Male", "Nonbinary"]

LOOKING_FOR = [
    "Life partner", "Serious relationship", "Casual dates",
    "New friends", "Not sure yet",
]

DATE_WHO = ["Men", "Women", "Nonbinary", "Everyone"]

YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Master", "PhD", "Other"]

MAX_BIRTHDAY = "2008-04-08"


# ============================================================
# API endpoints
# ============================================================

@app.get("/api/form-options")
def get_form_options():
    return {
        "ethnicities": ETHNICITIES,
        "attracted_ethnicities": ATTRACTED_ETHNICITIES,
        "genders": GENDERS,
        "looking_for": LOOKING_FOR,
        "date_who": DATE_WHO,
        "years": YEARS,
        "max_birthday": MAX_BIRTHDAY,
    }


@app.post("/api/submit")
async def submit_form(request: Request):
    form = await request.form()
    errors = []

    # --- Extract fields ---
    token = form.get("token", "").strip()
    telegram_id = ""

    # Resolve token to telegram_id
    if token and supabase:
        result = supabase.table("profiles").select("telegram_id").eq("token", token).execute()
        if result.data:
            telegram_id = result.data[0].get("telegram_id") or ""
    name = form.get("name", "").strip()
    birthday = form.get("birthday", "").strip()
    gender = form.get("gender", "")
    ethnicity = form.getlist("ethnicity")
    height_raw = form.get("height", "")
    hobbies = form.get("hobbies", "").strip()
    year = form.get("year", "")
    match_intro = form.get("match_intro", "").strip()
    looking_for = form.getlist("looking_for")
    date_who = form.getlist("date_who")
    min_age_raw = form.get("min_age", "")
    max_age_raw = form.get("max_age", "")
    attracted_ethnicity = form.getlist("attracted_ethnicity")
    attractive_height = form.get("attractive_height", "").strip()
    attractive_face = form.get("attractive_face", "").strip()
    attractive_vibe = form.get("attractive_vibe", "").strip()
    photos: list[UploadFile] = form.getlist("photos")

    # --- Validate ---
    if len(name) < 2 or len(name) > 50:
        errors.append("Name must be between 2 and 50 characters.")

    if not birthday:
        errors.append("Birthday is required.")
    else:
        try:
            bday = datetime.strptime(birthday, "%Y-%m-%d").date()
            if bday > date(2008, 4, 8):
                errors.append("You must be at least 18 years old.")
            if bday > date.today():
                errors.append("Birthday cannot be in the future.")
        except ValueError:
            errors.append("Invalid date format.")

    if gender not in GENDERS:
        errors.append("Please select a valid gender.")

    if not ethnicity:
        errors.append("Please select at least one ethnicity.")
    elif any(e not in ETHNICITIES for e in ethnicity):
        errors.append("Invalid ethnicity selection.")

    height = None
    try:
        height = int(height_raw)
        if height < 70 or height > 300:
            errors.append("Height must be between 70 and 300 cm.")
    except (ValueError, TypeError):
        errors.append("Height is required and must be a number.")

    if not hobbies:
        errors.append("Hobbies are required.")

    if year not in YEARS:
        errors.append("Please select a valid year.")

    if not match_intro:
        errors.append("Match intro is required.")

    if not looking_for:
        errors.append("Please select what you are looking for.")
    elif any(item not in LOOKING_FOR for item in looking_for):
        errors.append("Invalid 'looking for' selection.")

    if not date_who:
        errors.append("Please select who you want to date.")
    elif any(item not in DATE_WHO for item in date_who):
        errors.append("Invalid 'who to date' selection.")

    min_age = None
    max_age = None
    try:
        min_age = int(min_age_raw)
        if min_age < 18 or min_age > 99:
            errors.append("Minimum age must be between 18 and 99.")
    except (ValueError, TypeError):
        errors.append("Minimum age is required and must be a number.")

    try:
        max_age = int(max_age_raw)
        if max_age < 18 or max_age > 99:
            errors.append("Maximum age must be between 18 and 99.")
    except (ValueError, TypeError):
        errors.append("Maximum age is required and must be a number.")

    if min_age is not None and max_age is not None and min_age > max_age:
        errors.append("Minimum age cannot be greater than maximum age.")

    if not attracted_ethnicity:
        errors.append("Please select at least one attracted ethnicity.")
    elif any(e not in ATTRACTED_ETHNICITIES for e in attracted_ethnicity):
        errors.append("Invalid attracted ethnicity selection.")

    # Validate photos
    photo_names = []
    valid_photos = [p for p in photos if hasattr(p, "filename") and p.filename]
    if len(valid_photos) < 1:
        errors.append("Please upload at least 1 photo.")
    elif len(valid_photos) > 3:
        errors.append("Maximum 3 photos allowed.")
    else:
        for p in valid_photos:
            content = await p.read()
            if len(content) > 10 * 1024 * 1024:
                errors.append(f"Photo '{p.filename}' exceeds 10 MB limit.")
            photo_names.append(p.filename)

    if errors:
        return JSONResponse(status_code=422, content={"errors": errors})

    # --- Upload photos to Supabase Storage ---
    photo_urls = []
    if supabase:
        for p in valid_photos:
            await p.seek(0)
            content = await p.read()
            ext = os.path.splitext(p.filename or "photo.jpg")[1] or ".jpg"
            safe_name = f"{uuid.uuid4().hex}{ext}"
            path = f"{telegram_id or 'anon'}/{safe_name}"
            supabase.storage.from_("photos").upload(
                path, content, {"content-type": p.content_type or "image/jpeg", "upsert": "true"}
            )
            public_url = supabase.storage.from_("photos").get_public_url(path)
            photo_urls.append(public_url)

    # --- Store in Supabase ---
    profile_data = {
        "telegram_id": telegram_id or None,
        "name": name,
        "birthday": birthday,
        "gender": gender,
        "ethnicity": ethnicity,
        "height_cm": height,
        "hobbies": hobbies,
        "year": year,
        "match_intro": match_intro,
        "looking_for": looking_for,
        "date_who": date_who,
        "min_age": min_age,
        "max_age": max_age,
        "attracted_ethnicity": attracted_ethnicity,
        "attractive_height_build": attractive_height or None,
        "attractive_facial_features": attractive_face or None,
        "attractive_energy_vibes": attractive_vibe or None,
        "photos": photo_urls or photo_names,
        "updated_at": datetime.utcnow().isoformat(),
    }

    if supabase and telegram_id:
        # Upsert: update if telegram_id exists, insert if not
        supabase.table("profiles").upsert(
            profile_data, on_conflict="telegram_id"
        ).execute()
        logger.info(f"Profile saved for telegram_id={telegram_id}")
    elif supabase:
        supabase.table("profiles").insert(profile_data).execute()
        logger.info("Profile saved (no telegram_id)")
    else:
        logger.warning("Supabase not configured — profile not saved")
        print(json.dumps(profile_data, indent=2, ensure_ascii=False))

    # --- Send Telegram confirmation ---
    if telegram_id and TELEGRAM_BOT_TOKEN:
        # Fetch the token for this profile
        profile_token = token
        if not profile_token and supabase:
            res = supabase.table("profiles").select("token").eq("telegram_id", telegram_id).execute()
            if res.data:
                profile_token = res.data[0].get("token", "")
        if profile_token:
            profile_url = f"{FRONTEND_URL}/profile?token={profile_token}"
            try:
                await send_telegram_message(int(telegram_id),
                    f"you're all set, {name}! 🎉\n\nyour profile is live. matches drop every wednesday at 9 PM — stay tuned!",
                    buttons=[{"text": "View my profile", "url": profile_url}],
                )
            except Exception as e:
                logger.warning(f"Failed to send Telegram confirmation: {e}")

    return {"success": True, "message": "Thanks for signing up for JustDateLah!"}


@app.get("/api/profile/{token}")
def get_profile(token: str):
    """Get a profile by its secret token."""
    if not supabase:
        return JSONResponse(status_code=503, content={"error": "Database not configured"})
    result = supabase.table("profiles").select("*").eq("token", token).execute()
    if not result.data:
        return JSONResponse(status_code=404, content={"error": "Profile not found"})
    # Don't expose telegram_id in the response
    profile = result.data[0]
    profile.pop("telegram_id", None)
    profile.pop("token", None)
    return profile


# ============================================================
# Telegram webhook
# ============================================================

import httpx

async def send_telegram_message(chat_id: int, text: str, parse_mode: str = "HTML", buttons: list[dict] | None = None):
    """Send a message via Telegram Bot API. buttons is a list of [{"text": "...", "url": "..."}]."""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload: dict = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode,
    }
    if buttons:
        payload["reply_markup"] = {
            "inline_keyboard": [[btn] for btn in buttons]
        }
    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload)


@app.post("/api/telegram/webhook")
async def telegram_webhook(request: Request):
    """Handle incoming Telegram updates."""
    if not TELEGRAM_BOT_TOKEN:
        return {"ok": False, "error": "Bot token not configured"}

    data = await request.json()
    message = data.get("message")
    if not message:
        return {"ok": True}

    chat_id = message["chat"]["id"]
    user_id = str(message["from"]["id"])
    text = message.get("text", "").strip()
    first_name = message["from"].get("first_name", "there")

    if text == "/start":
        await send_telegram_message(chat_id, (
            f"hey {first_name}! welcome to <b>JustDateLah</b> 💌\n\n"
            "we match you with someone great and set up the date — "
            "no swiping, no awkward DMs.\n\n"
            "type /profile to get started!"
        ))

    elif text == "/profile":
        # Check if profile exists
        profile_row = None
        if supabase:
            result = supabase.table("profiles").select("id,name,token,match_intro").eq("telegram_id", user_id).execute()
            if result.data:
                profile_row = result.data[0]

        if profile_row:
            token = profile_row.get("token") or ""
            if not token:
                # Generate token for legacy profiles
                token = uuid.uuid4().hex
                supabase.table("profiles").update({"token": token}).eq("telegram_id", user_id).execute()

            is_complete = bool(profile_row.get("match_intro"))
            if is_complete:
                profile_url = f"{FRONTEND_URL}/profile?token={token}"
                onboard_url = f"{FRONTEND_URL}/onboard?token={token}"
                await send_telegram_message(chat_id,
                    f"here's your profile, {first_name} 👤",
                    buttons=[
                        {"text": "View my profile", "url": profile_url},
                        {"text": "Edit my profile", "url": onboard_url},
                    ],
                )
            else:
                onboard_url = f"{FRONTEND_URL}/onboard?token={token}"
                await send_telegram_message(chat_id,
                    "looks like you started but haven't finished your profile yet!\n\ntap below to complete it 👇",
                    buttons=[{"text": "Complete my profile", "url": onboard_url}],
                )
        else:
            # Generate a token for the new user upfront
            token = uuid.uuid4().hex
            # Create a placeholder row so the token is reserved
            supabase.table("profiles").insert({
                "telegram_id": user_id,
                "token": token,
                "name": first_name,
                "birthday": "2000-01-01",
                "gender": "Male",
                "ethnicity": [],
                "height_cm": 170,
                "hobbies": "",
                "year": "Freshman",
                "match_intro": "",
                "looking_for": [],
                "date_who": [],
                "min_age": 18,
                "max_age": 30,
                "attracted_ethnicity": [],
                "photos": [],
            }).execute()
            onboard_url = f"{FRONTEND_URL}/onboard?token={token}"
            await send_telegram_message(chat_id,
                "you haven't set up your profile yet!\n\ntap below to get started 👇",
                buttons=[{"text": "Create my profile", "url": onboard_url}],
            )

    else:
        await send_telegram_message(chat_id, (
            "hmm i don't know that one — try /profile to view or create your profile!"
        ))

    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
