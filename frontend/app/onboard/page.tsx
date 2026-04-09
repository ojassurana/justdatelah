"use client";

import { Suspense, useState, useRef, useCallback, DragEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./form.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function OnboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <OnboardForm />
    </Suspense>
  );
}

const ETHNICITIES = [
  "Chinese", "Malay", "Indian", "Eurasian", "Filipino",
  "Indonesian", "Caucasian/White", "Japanese", "Korean",
  "Other", "Prefer not to say",
];

const ATTRACTED_ETHNICITIES = [
  "Chinese", "Malay", "Indian", "Eurasian", "Filipino",
  "Indonesian", "Caucasian/White", "Japanese", "Korean",
  "Other", "No preference",
];

const GENDERS = ["Female", "Male", "Nonbinary"];

const LOOKING_FOR = [
  "Life partner", "Serious relationship", "Casual dates",
  "New friends", "Not sure yet",
];

const DATE_WHO = ["Men", "Women", "Nonbinary", "Everyone"];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Master", "PhD", "Other"];

const MAX_BIRTHDAY = "2008-04-08";

type FieldStatus = "neutral" | "valid" | "error";

interface FieldState {
  status: FieldStatus;
  message: string;
}

function fieldClass(state: FieldState) {
  if (state.status === "error") return "field has-error";
  if (state.status === "valid") return "field valid";
  return "field";
}

function OnboardForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  // Form values
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState<string[]>([]);
  const [height, setHeight] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [year, setYear] = useState("");
  const [matchIntro, setMatchIntro] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [dateWho, setDateWho] = useState<string[]>([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [attractedEthnicity, setAttractedEthnicity] = useState<string[]>([]);
  const [attractiveHeight, setAttractiveHeight] = useState("");
  const [attractiveFace, setAttractiveFace] = useState("");
  const [attractiveVibe, setAttractiveVibe] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  // Field validation states
  const [fields, setFields] = useState<Record<string, FieldState>>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = useCallback((id: string, status: FieldStatus, message = "") => {
    setFields(prev => ({ ...prev, [id]: { status, message } }));
  }, []);

  const getField = (id: string): FieldState => fields[id] || { status: "neutral", message: "" };

  // --- Inline validators ---
  function validateName(v: string) {
    const trimmed = v.trim();
    if (trimmed.length === 0) setField("name", "neutral");
    else if (trimmed.length < 2) setField("name", "error", "Name must be at least 2 characters.");
    else if (trimmed.length > 50) setField("name", "error", "Name must be under 50 characters.");
    else setField("name", "valid");
  }

  function validateBirthday(v: string) {
    if (!v) setField("birthday", "neutral");
    else if (v > MAX_BIRTHDAY) setField("birthday", "error", "You must be at least 18 years old.");
    else setField("birthday", "valid");
  }

  function validateCheckboxGroup(id: string, items: string[]) {
    if (items.length > 0) setField(id, "valid");
    else setField(id, "error", "Please select at least one option.");
  }

  function validateHeight(v: string) {
    if (v === "") { setField("height", "neutral"); return; }
    const n = parseInt(v);
    if (isNaN(n)) setField("height", "error", "Please enter a valid number.");
    else if (n < 70) setField("height", "error", "Height must be at least 70 cm.");
    else if (n > 300) setField("height", "error", "Height must be under 300 cm.");
    else setField("height", "valid");
  }

  function validateAges(minV: string, maxV: string) {
    const minN = parseInt(minV);
    const maxN = parseInt(maxV);

    if (minV === "") setField("min_age", "neutral");
    else if (isNaN(minN) || minN < 18) setField("min_age", "error", "Must be at least 18.");
    else if (minN > 99) setField("min_age", "error", "Must be 99 or under.");
    else setField("min_age", "valid");

    if (maxV === "") setField("max_age", "neutral");
    else if (isNaN(maxN) || maxN < 18) setField("max_age", "error", "Must be at least 18.");
    else if (maxN > 99) setField("max_age", "error", "Must be 99 or under.");
    else if (!isNaN(minN) && minN >= 18 && minN <= 99 && maxN < minN)
      setField("max_age", "error", "Must be greater than or equal to min age.");
    else setField("max_age", "valid");
  }

  function validatePhotos(files: File[]) {
    if (files.length === 0) { setField("photos", "neutral"); return; }
    if (files.length > 3) { setField("photos", "error", "Maximum 3 photos allowed."); return; }
    for (const f of files) {
      if (f.size > 10 * 1024 * 1024) {
        setField("photos", "error", `Each photo must be under 10 MB (${f.name} is too large).`);
        return;
      }
    }
    setField("photos", "valid");
  }

  // --- Checkbox toggle helper ---
  function toggleCheckbox(list: string[], item: string): string[] {
    return list.includes(item) ? list.filter(x => x !== item) : [...list, item];
  }

  // --- Photo handlers ---
  function addPhotos(files: FileList | File[]) {
    const newPhotos = [...photos];
    for (const f of Array.from(files)) {
      if (newPhotos.length >= 3) break;
      if (f.type.startsWith("image/")) newPhotos.push(f);
    }
    setPhotos(newPhotos);
    validatePhotos(newPhotos);
  }

  function removePhoto(idx: number) {
    const newPhotos = photos.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
    validatePhotos(newPhotos);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addPhotos(e.dataTransfer.files);
  }

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let hasError = false;

    function check(id: string, condition: boolean, msg: string) {
      if (condition) { setField(id, "error", msg); hasError = true; }
    }

    check("name", name.trim().length < 2, "Name must be at least 2 characters.");
    check("birthday", !birthday, "Birthday is required.");
    if (birthday && birthday > MAX_BIRTHDAY) { setField("birthday", "error", "You must be at least 18 years old."); hasError = true; }
    check("gender", !gender, "Please select your gender.");
    check("ethnicity", ethnicity.length === 0, "Please select at least one ethnicity.");

    const h = parseInt(height);
    check("height", isNaN(h) || h < 70 || h > 300, "Height must be between 70 and 300 cm.");
    check("hobbies", !hobbies.trim(), "Hobbies are required.");
    check("year", !year, "Please select your year.");
    check("match_intro", !matchIntro.trim(), "Match intro is required.");
    check("looking_for", lookingFor.length === 0, "Please select at least one option.");
    check("date_who", dateWho.length === 0, "Please select at least one option.");

    const minN = parseInt(minAge);
    const maxN = parseInt(maxAge);
    check("min_age", isNaN(minN) || minN < 18 || minN > 99, "Must be between 18 and 99.");
    check("max_age", isNaN(maxN) || maxN < 18 || maxN > 99, "Must be between 18 and 99.");
    if (!isNaN(minN) && !isNaN(maxN) && maxN < minN) { setField("max_age", "error", "Must be >= min age."); hasError = true; }

    check("attracted_ethnicity", attractedEthnicity.length === 0, "Please select at least one option.");
    check("photos", photos.length === 0, "Please upload at least 1 photo.");
    if (photos.length > 3) { setField("photos", "error", "Maximum 3 photos."); hasError = true; }

    if (hasError) {
      setTimeout(() => {
        document.querySelector(".has-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setSubmitting(true);
    setServerErrors([]);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("name", name.trim());
    formData.append("birthday", birthday);
    formData.append("gender", gender);
    ethnicity.forEach(e => formData.append("ethnicity", e));
    formData.append("height", height);
    formData.append("hobbies", hobbies.trim());
    formData.append("year", year);
    formData.append("match_intro", matchIntro.trim());
    lookingFor.forEach(l => formData.append("looking_for", l));
    dateWho.forEach(d => formData.append("date_who", d));
    formData.append("min_age", minAge);
    formData.append("max_age", maxAge);
    attractedEthnicity.forEach(e => formData.append("attracted_ethnicity", e));
    formData.append("attractive_height", attractiveHeight.trim());
    formData.append("attractive_face", attractiveFace.trim());
    formData.append("attractive_vibe", attractiveVibe.trim());
    photos.forEach(p => formData.append("photos", p));

    try {
      const res = await fetch(`${API_URL}/api/submit`, {
        method: "POST",
        body: formData,
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      if (!res.ok) {
        setServerErrors(data.errors || ["Something went wrong."]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerErrors(["Network error. Please try again."]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  // --- Success page ---
  if (submitted) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h1>You&apos;re in!</h1>
          <p>Thanks for signing up for JustDateLah. We&apos;ll find you a great match soon!</p>
          <Link href={`/onboard${token ? `?token=${token}` : ""}`} onClick={() => setSubmitted(false)}>Update my profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>JustDateLah</h1>
        <p>Find your match in Singapore</p>
      </div>

      {serverErrors.length > 0 && (
        <div className="error-banner">
          <strong>Please fix the following:</strong>
          <ul>{serverErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* Section 1: Basics */}
        <div className="card">
          <h2>Tell us your basics</h2>

          <div className={fieldClass(getField("name"))} id="field-name">
            <label className="field-label required" htmlFor="name">What&apos;s your name?</label>
            <input type="text" id="name" placeholder="Type your answer here..." value={name}
              onChange={e => { setName(e.target.value); validateName(e.target.value); }} />
            {getField("name").message && <p className="field-error">{getField("name").message}</p>}
          </div>

          <div className={fieldClass(getField("birthday"))} id="field-birthday">
            <label className="field-label required" htmlFor="birthday">When is your birthday?</label>
            <p className="helper">Only your age will be shown to others</p>
            <input type="date" id="birthday" max={MAX_BIRTHDAY} value={birthday}
              onChange={e => { setBirthday(e.target.value); validateBirthday(e.target.value); }} />
            {getField("birthday").message && <p className="field-error">{getField("birthday").message}</p>}
          </div>

          <div className={fieldClass(getField("gender"))} id="field-gender">
            <label className="field-label required">What&apos;s your gender?</label>
            <div className="radio-group">
              {GENDERS.map(g => (
                <label key={g} className={gender === g ? "selected" : ""}>
                  <input type="radio" name="gender" value={g} checked={gender === g}
                    onChange={() => { setGender(g); setField("gender", "valid"); }} />
                  <span>{g}</span>
                </label>
              ))}
            </div>
            {getField("gender").message && <p className="field-error">{getField("gender").message}</p>}
          </div>

          <div className={fieldClass(getField("ethnicity"))} id="field-ethnicity">
            <label className="field-label required">What&apos;s your ethnicity? (Select all that apply)</label>
            <div className="checkbox-group">
              {ETHNICITIES.map(e => (
                <label key={e} className={ethnicity.includes(e) ? "selected" : ""}>
                  <input type="checkbox" checked={ethnicity.includes(e)}
                    onChange={() => {
                      const next = toggleCheckbox(ethnicity, e);
                      setEthnicity(next);
                      validateCheckboxGroup("ethnicity", next);
                    }} />
                  <span>{e}</span>
                </label>
              ))}
            </div>
            {getField("ethnicity").message && <p className="field-error">{getField("ethnicity").message}</p>}
          </div>

          <div className={fieldClass(getField("height"))} id="field-height">
            <label className="field-label required" htmlFor="height">How tall are you? (cm)</label>
            <input type="number" id="height" placeholder="e.g. 170" value={height}
              onChange={e => { setHeight(e.target.value); validateHeight(e.target.value); }} />
            {getField("height").message && <p className="field-error">{getField("height").message}</p>}
          </div>

          <div className={fieldClass(getField("hobbies"))} id="field-hobbies">
            <label className="field-label required" htmlFor="hobbies">Share your hobbies and interests</label>
            <textarea id="hobbies" placeholder="e.g. reading, music, hiking, cooking..." value={hobbies}
              onChange={e => { setHobbies(e.target.value); setField("hobbies", e.target.value.trim() ? "valid" : "neutral"); }} />
            {getField("hobbies").message && <p className="field-error">{getField("hobbies").message}</p>}
          </div>

          <div className={fieldClass(getField("year"))} id="field-year">
            <label className="field-label required" htmlFor="year">What year are you in?</label>
            <select id="year" value={year}
              onChange={e => { setYear(e.target.value); setField("year", e.target.value ? "valid" : "neutral"); }}>
              <option value="" disabled>Select your year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {getField("year").message && <p className="field-error">{getField("year").message}</p>}
          </div>

          <div className={fieldClass(getField("match_intro"))} id="field-match_intro">
            <label className="field-label required" htmlFor="match_intro">What&apos;s the first thing you&apos;d want your match to know about you?</label>
            <p className="helper">They&apos;ll see it when they&apos;re matched with you.</p>
            <textarea id="match_intro" placeholder="Could be a fun fact, a vibe check, anything really" value={matchIntro}
              onChange={e => { setMatchIntro(e.target.value); setField("match_intro", e.target.value.trim() ? "valid" : "neutral"); }} />
            {getField("match_intro").message && <p className="field-error">{getField("match_intro").message}</p>}
          </div>
        </div>

        {/* Section 2: Your Type */}
        <div className="card">
          <h2>Tell us your type</h2>

          <div className={fieldClass(getField("looking_for"))} id="field-looking_for">
            <label className="field-label required">What are you looking for right now? (Select all that apply)</label>
            <div className="checkbox-group">
              {LOOKING_FOR.map(item => (
                <label key={item} className={lookingFor.includes(item) ? "selected" : ""}>
                  <input type="checkbox" checked={lookingFor.includes(item)}
                    onChange={() => {
                      const next = toggleCheckbox(lookingFor, item);
                      setLookingFor(next);
                      validateCheckboxGroup("looking_for", next);
                    }} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {getField("looking_for").message && <p className="field-error">{getField("looking_for").message}</p>}
          </div>

          <div className={fieldClass(getField("date_who"))} id="field-date_who">
            <label className="field-label required">Who do you wanna date? (Select all who you&apos;re open to meeting)</label>
            <div className="checkbox-group">
              {DATE_WHO.map(item => (
                <label key={item} className={dateWho.includes(item) ? "selected" : ""}>
                  <input type="checkbox" checked={dateWho.includes(item)}
                    onChange={() => {
                      const next = toggleCheckbox(dateWho, item);
                      setDateWho(next);
                      validateCheckboxGroup("date_who", next);
                    }} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {getField("date_who").message && <p className="field-error">{getField("date_who").message}</p>}
          </div>

          <div className="age-row">
            <div className={fieldClass(getField("min_age"))} id="field-min_age">
              <label className="field-label required" htmlFor="min_age">Minimum age you&apos;d like to date</label>
              <input type="number" id="min_age" placeholder="e.g. 18" value={minAge}
                onChange={e => { setMinAge(e.target.value); validateAges(e.target.value, maxAge); }} />
              {getField("min_age").message && <p className="field-error">{getField("min_age").message}</p>}
            </div>
            <div className={fieldClass(getField("max_age"))} id="field-max_age">
              <label className="field-label required" htmlFor="max_age">Maximum age you&apos;d like to date</label>
              <input type="number" id="max_age" placeholder="e.g. 30" value={maxAge}
                onChange={e => { setMaxAge(e.target.value); validateAges(minAge, e.target.value); }} />
              {getField("max_age").message && <p className="field-error">{getField("max_age").message}</p>}
            </div>
          </div>

          <div className={fieldClass(getField("attracted_ethnicity"))} id="field-attracted_ethnicity">
            <label className="field-label required">What ethnicities are you attracted to? (Select all that apply)</label>
            <div className="checkbox-group">
              {ATTRACTED_ETHNICITIES.map(e => (
                <label key={e} className={attractedEthnicity.includes(e) ? "selected" : ""}>
                  <input type="checkbox" checked={attractedEthnicity.includes(e)}
                    onChange={() => {
                      const next = toggleCheckbox(attractedEthnicity, e);
                      setAttractedEthnicity(next);
                      validateCheckboxGroup("attracted_ethnicity", next);
                    }} />
                  <span>{e}</span>
                </label>
              ))}
            </div>
            {getField("attracted_ethnicity").message && <p className="field-error">{getField("attracted_ethnicity").message}</p>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="attractive_height">What do you find physically attractive? &mdash; Height &amp; Build</label>
            <textarea id="attractive_height" placeholder="e.g. 5'10, athletic, broad shoulders..." value={attractiveHeight}
              onChange={e => setAttractiveHeight(e.target.value)} />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="attractive_face">What do you find physically attractive? &mdash; Facial Features</label>
            <textarea id="attractive_face" placeholder="e.g. expressive eyes, warm smiles, clean-shaven..." value={attractiveFace}
              onChange={e => setAttractiveFace(e.target.value)} />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="attractive_vibe">What do you find physically attractive? &mdash; Energy &amp; Vibes</label>
            <textarea id="attractive_vibe" placeholder="e.g. Artsy/Indie, Nerd/Smart, Calm & Grounding..." value={attractiveVibe}
              onChange={e => setAttractiveVibe(e.target.value)} />
          </div>
        </div>

        {/* Section 3: Photos */}
        <div className="card">
          <h2>Show us your vibe</h2>

          <div className={fieldClass(getField("photos"))} id="field-photos">
            <label className="field-label required">Upload your photos</label>
            <p className="helper">Add up to 3 pics that show your face and vibe. Clear face photos from different moments help find better matches for you. (Max 10 MB each)</p>
            <input type="file" ref={fileInputRef} accept="image/*" multiple style={{ display: "none" }}
              onChange={e => e.target.files && addPhotos(e.target.files)} />

            <div className="photo-grid">
              {photos.map((file, idx) => (
                <div key={idx} className="photo-slot photo-slot-filled">
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                  <button type="button" className="photo-slot-remove" aria-label="Remove photo"
                    onClick={() => removePhoto(idx)}>&times;</button>
                </div>
              ))}
              {photos.length < 3 && (
                <div className="photo-slot photo-slot-add" tabIndex={0} role="button" aria-label="Add photos"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(114,130,141)" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="photo-slot-label">Add photo</span>
                </div>
              )}
            </div>

            {photos.length === 0 && (
              <div className={`photo-dropzone${dragOver ? " drag-over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgb(114,130,141)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="dropzone-text">Drag &amp; drop your photos here</span>
                <span className="dropzone-subtext">or click the + above to browse</span>
              </div>
            )}

            {getField("photos").message && <p className="field-error">{getField("photos").message}</p>}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="footer">JustDateLah &bull; Singapore</div>
    </div>
  );
}
