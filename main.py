import json
import os
from datetime import date, datetime
from typing import Optional

from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator, model_validator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.environ.get("FRONTEND_URL", ""),
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


@app.get("/api/form-options")
def get_form_options():
    """Return all form option lists so the frontend can render dropdowns/checkboxes."""
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

    # --- Build submission ---
    submission = {
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
        "photos": photo_names,
    }

    print("\n" + "=" * 60)
    print("NEW SUBMISSION RECEIVED")
    print("=" * 60)
    print(json.dumps(submission, indent=2, ensure_ascii=False))
    print("=" * 60 + "\n")

    return {"success": True, "message": "Thanks for signing up for JustDateLah!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
