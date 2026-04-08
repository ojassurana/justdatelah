import json
from datetime import date, datetime
from typing import Optional

from fastapi import FastAPI, Form, UploadFile, File, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel, field_validator, model_validator

app = FastAPI()

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

FORM_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JustDateLah</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 2rem 1rem;
  }

  .container {
    max-width: 640px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  .header p {
    color: rgba(255,255,255,0.85);
    font-size: 1.1rem;
  }

  .card {
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  }

  .card h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #764ba2;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f0e6f6;
  }

  .field {
    margin-bottom: 1.5rem;
  }

  .field:last-child {
    margin-bottom: 0;
  }

  label.field-label {
    display: block;
    font-weight: 600;
    font-size: 0.95rem;
    color: #333;
    margin-bottom: 0.4rem;
  }

  .required::after {
    content: " *";
    color: #e53e3e;
  }

  .helper {
    font-size: 0.82rem;
    color: #888;
    margin-bottom: 0.4rem;
  }

  input[type="text"],
  input[type="number"],
  input[type="date"],
  textarea,
  select {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 1.5px solid #ddd;
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #fafafa;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #764ba2;
    box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.15);
    background: #fff;
  }

  textarea { resize: vertical; min-height: 80px; }

  .radio-group, .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .radio-group label, .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.9rem;
    border: 1.5px solid #e2e2e2;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.15s;
    background: #fafafa;
    user-select: none;
  }

  .radio-group label:hover, .checkbox-group label:hover {
    border-color: #764ba2;
    background: #f9f5fc;
  }

  .radio-group input:checked + span,
  .checkbox-group input:checked + span {
    color: #764ba2;
    font-weight: 600;
  }

  .radio-group label:has(input:checked),
  .checkbox-group label:has(input:checked) {
    border-color: #764ba2;
    background: #f3ecf8;
  }

  .radio-group input, .checkbox-group input {
    accent-color: #764ba2;
  }

  .age-row {
    display: flex;
    gap: 1rem;
  }

  .age-row .field { flex: 1; }

  .submit-btn {
    display: block;
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    letter-spacing: 0.3px;
  }

  .submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
  }

  .submit-btn:active { transform: translateY(0); }

  .error-banner {
    background: #fed7d7;
    border: 1px solid #feb2b2;
    color: #c53030;
    padding: 1rem 1.2rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .error-banner ul { margin: 0.3rem 0 0 1.2rem; }

  .success-banner {
    background: #c6f6d5;
    border: 1px solid #9ae6b4;
    color: #276749;
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
    font-size: 1.05rem;
  }

  .file-input-wrap {
    position: relative;
  }

  input[type="file"] {
    width: 100%;
    padding: 0.7rem;
    border: 1.5px dashed #ccc;
    border-radius: 10px;
    background: #fafafa;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
  }

  input[type="file"]:focus {
    border-color: #764ba2;
    outline: none;
  }

  .footer {
    text-align: center;
    margin-top: 1.5rem;
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
  }

  .field-error {
    color: #e53e3e;
    font-size: 0.82rem;
    margin-top: 0.3rem;
    display: none;
  }

  .field-error.visible { display: block; }

  .field.has-error input,
  .field.has-error textarea,
  .field.has-error select {
    border-color: #e53e3e;
  }

  .field.has-error input:focus,
  .field.has-error textarea:focus,
  .field.has-error select:focus {
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15);
  }

  .field.valid input,
  .field.valid textarea,
  .field.valid select {
    border-color: #38a169;
  }

  .field.valid input:focus,
  .field.valid textarea:focus,
  .field.valid select:focus {
    box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.15);
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>JustDateLah</h1>
    <p>Find your match in Singapore</p>
  </div>

  {{ERROR_BANNER}}

  <form method="post" action="/form" enctype="multipart/form-data" novalidate id="mainForm">

  <!-- Section 1 -->
  <div class="card">
    <h2>Tell us your basics</h2>

    <div class="field" id="field-name">
      <label class="field-label required" for="name">What's your name?</label>
      <input type="text" id="name" name="name" placeholder="Type your answer here..." required minlength="2" maxlength="50" value="{{name}}">
      <p class="field-error" id="err-name"></p>
    </div>

    <div class="field" id="field-birthday">
      <label class="field-label required" for="birthday">When is your birthday?</label>
      <p class="helper">Only your age will be shown to others</p>
      <input type="date" id="birthday" name="birthday" required max="2008-04-08" value="{{birthday}}">
      <p class="field-error" id="err-birthday"></p>
    </div>

    <div class="field" id="field-gender">
      <label class="field-label required">What's your gender?</label>
      <div class="radio-group">
        <label><input type="radio" name="gender" value="Female" {{gender_Female}}><span>Female</span></label>
        <label><input type="radio" name="gender" value="Male" {{gender_Male}}><span>Male</span></label>
        <label><input type="radio" name="gender" value="Nonbinary" {{gender_Nonbinary}}><span>Nonbinary</span></label>
      </div>
      <p class="field-error" id="err-gender"></p>
    </div>

    <div class="field" id="field-ethnicity">
      <label class="field-label required">What's your ethnicity? (Select all that apply)</label>
      <div class="checkbox-group">
        {{ethnicity_checkboxes}}
      </div>
      <p class="field-error" id="err-ethnicity"></p>
    </div>

    <div class="field" id="field-height">
      <label class="field-label required" for="height">How tall are you? (cm)</label>
      <input type="number" id="height" name="height" placeholder="e.g. 170" required min="70" max="300" value="{{height}}">
      <p class="field-error" id="err-height"></p>
    </div>

    <div class="field" id="field-hobbies">
      <label class="field-label required" for="hobbies">Share your hobbies and interests</label>
      <textarea id="hobbies" name="hobbies" placeholder="e.g. reading, music, hiking, cooking..." required>{{hobbies}}</textarea>
      <p class="field-error" id="err-hobbies"></p>
    </div>

    <div class="field" id="field-year">
      <label class="field-label required" for="year">What year are you in?</label>
      <select id="year" name="year" required>
        <option value="" disabled {{year_default}}>Select your year</option>
        {{year_options}}
      </select>
      <p class="field-error" id="err-year"></p>
    </div>

    <div class="field" id="field-match_intro">
      <label class="field-label required" for="match_intro">What's the first thing you'd want your match to know about you?</label>
      <p class="helper">They'll see it when they're matched with you.</p>
      <textarea id="match_intro" name="match_intro" placeholder="Could be a fun fact, a vibe check, anything really" required>{{match_intro}}</textarea>
      <p class="field-error" id="err-match_intro"></p>
    </div>
  </div>

  <!-- Section 2 -->
  <div class="card">
    <h2>Tell us your type</h2>

    <div class="field" id="field-looking_for">
      <label class="field-label required">What are you looking for right now? (Select all that apply)</label>
      <div class="checkbox-group">
        {{looking_for_checkboxes}}
      </div>
      <p class="field-error" id="err-looking_for"></p>
    </div>

    <div class="field" id="field-date_who">
      <label class="field-label required">Who do you wanna date? (Select all who you're open to meeting)</label>
      <div class="checkbox-group">
        {{date_who_checkboxes}}
      </div>
      <p class="field-error" id="err-date_who"></p>
    </div>

    <div class="age-row">
      <div class="field" id="field-min_age">
        <label class="field-label required" for="min_age">Minimum age you'd like to date</label>
        <input type="number" id="min_age" name="min_age" placeholder="e.g. 18" required min="18" max="99" value="{{min_age}}">
        <p class="field-error" id="err-min_age"></p>
      </div>
      <div class="field" id="field-max_age">
        <label class="field-label required" for="max_age">Maximum age you'd like to date</label>
        <input type="number" id="max_age" name="max_age" placeholder="e.g. 30" required min="18" max="99" value="{{max_age}}">
        <p class="field-error" id="err-max_age"></p>
      </div>
    </div>

    <div class="field" id="field-attracted_ethnicity">
      <label class="field-label required">What ethnicities are you attracted to? (Select all that apply)</label>
      <div class="checkbox-group">
        {{attracted_ethnicity_checkboxes}}
      </div>
      <p class="field-error" id="err-attracted_ethnicity"></p>
    </div>

    <div class="field">
      <label class="field-label" for="attractive_height">What do you find physically attractive? &mdash; Height & Build</label>
      <textarea id="attractive_height" name="attractive_height" placeholder="e.g. 5'10, athletic, broad shoulders...">{{attractive_height}}</textarea>
    </div>

    <div class="field">
      <label class="field-label" for="attractive_face">What do you find physically attractive? &mdash; Facial Features</label>
      <textarea id="attractive_face" name="attractive_face" placeholder="e.g. expressive eyes, warm smiles, clean-shaven...">{{attractive_face}}</textarea>
    </div>

    <div class="field">
      <label class="field-label" for="attractive_vibe">What do you find physically attractive? &mdash; Energy & Vibes</label>
      <textarea id="attractive_vibe" name="attractive_vibe" placeholder="e.g. Artsy/Indie, Nerd/Smart, Calm & Grounding...">{{attractive_vibe}}</textarea>
    </div>
  </div>

  <!-- Section 3 -->
  <div class="card">
    <h2>Show us your vibe</h2>

    <div class="field" id="field-photos">
      <label class="field-label required" for="photos">Upload your photos</label>
      <p class="helper">Add up to 3 pics that show your face and vibe. Clear face photos from different moments help find better matches for you. (Max 10 MB each)</p>
      <input type="file" id="photos" name="photos" accept="image/*" multiple required>
      <p class="field-error" id="err-photos"></p>
    </div>
  </div>

  <button type="submit" class="submit-btn">Submit</button>

  </form>

  <div class="footer">JustDateLah &mdash; Singapore</div>
</div>

<script>
(function() {
  function showError(fieldId, msg) {
    const field = document.getElementById('field-' + fieldId);
    const err = document.getElementById('err-' + fieldId);
    if (!field || !err) return;
    field.classList.add('has-error');
    field.classList.remove('valid');
    err.textContent = msg;
    err.classList.add('visible');
  }

  function clearError(fieldId) {
    const field = document.getElementById('field-' + fieldId);
    const err = document.getElementById('err-' + fieldId);
    if (!field || !err) return;
    field.classList.remove('has-error');
    field.classList.add('valid');
    err.textContent = '';
    err.classList.remove('visible');
  }

  function clearNeutral(fieldId) {
    const field = document.getElementById('field-' + fieldId);
    const err = document.getElementById('err-' + fieldId);
    if (!field || !err) return;
    field.classList.remove('has-error', 'valid');
    err.textContent = '';
    err.classList.remove('visible');
  }

  // --- Name ---
  document.getElementById('name').addEventListener('input', function() {
    const v = this.value.trim();
    if (v.length === 0) clearNeutral('name');
    else if (v.length < 2) showError('name', 'Name must be at least 2 characters.');
    else if (v.length > 50) showError('name', 'Name must be under 50 characters.');
    else clearError('name');
  });

  // --- Birthday ---
  document.getElementById('birthday').addEventListener('change', function() {
    const v = this.value;
    if (!v) clearNeutral('birthday');
    else if (v > '2008-04-08') showError('birthday', 'You must be at least 18 years old.');
    else clearError('birthday');
  });

  // --- Gender ---
  document.querySelectorAll('input[name="gender"]').forEach(function(r) {
    r.addEventListener('change', function() { clearError('gender'); });
  });

  // --- Ethnicity ---
  document.querySelectorAll('input[name="ethnicity"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      const checked = document.querySelectorAll('input[name="ethnicity"]:checked');
      if (checked.length > 0) clearError('ethnicity');
      else showError('ethnicity', 'Please select at least one ethnicity.');
    });
  });

  // --- Height ---
  document.getElementById('height').addEventListener('input', function() {
    const v = this.value;
    if (v === '') { clearNeutral('height'); return; }
    const n = parseInt(v);
    if (isNaN(n)) showError('height', 'Please enter a valid number.');
    else if (n < 70) showError('height', 'Height must be at least 70 cm.');
    else if (n > 300) showError('height', 'Height must be under 300 cm.');
    else clearError('height');
  });

  // --- Hobbies ---
  document.getElementById('hobbies').addEventListener('input', function() {
    if (this.value.trim()) clearError('hobbies');
    else clearNeutral('hobbies');
  });

  // --- Year ---
  document.getElementById('year').addEventListener('change', function() {
    if (this.value) clearError('year');
    else clearNeutral('year');
  });

  // --- Match intro ---
  document.getElementById('match_intro').addEventListener('input', function() {
    if (this.value.trim()) clearError('match_intro');
    else clearNeutral('match_intro');
  });

  // --- Looking for ---
  document.querySelectorAll('input[name="looking_for"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      const checked = document.querySelectorAll('input[name="looking_for"]:checked');
      if (checked.length > 0) clearError('looking_for');
      else showError('looking_for', 'Please select at least one option.');
    });
  });

  // --- Date who ---
  document.querySelectorAll('input[name="date_who"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      const checked = document.querySelectorAll('input[name="date_who"]:checked');
      if (checked.length > 0) clearError('date_who');
      else showError('date_who', 'Please select at least one option.');
    });
  });

  // --- Min/Max age (cross-validated) ---
  function validateAges() {
    const minV = document.getElementById('min_age').value;
    const maxV = document.getElementById('max_age').value;
    const minN = parseInt(minV);
    const maxN = parseInt(maxV);

    if (minV === '') clearNeutral('min_age');
    else if (isNaN(minN) || minN < 18) showError('min_age', 'Must be at least 18.');
    else if (minN > 99) showError('min_age', 'Must be 99 or under.');
    else clearError('min_age');

    if (maxV === '') clearNeutral('max_age');
    else if (isNaN(maxN) || maxN < 18) showError('max_age', 'Must be at least 18.');
    else if (maxN > 99) showError('max_age', 'Must be 99 or under.');
    else if (!isNaN(minN) && minN >= 18 && minN <= 99 && maxN < minN) showError('max_age', 'Must be greater than or equal to min age.');
    else clearError('max_age');
  }
  document.getElementById('min_age').addEventListener('input', validateAges);
  document.getElementById('max_age').addEventListener('input', validateAges);

  // --- Attracted ethnicity ---
  document.querySelectorAll('input[name="attracted_ethnicity"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      const checked = document.querySelectorAll('input[name="attracted_ethnicity"]:checked');
      if (checked.length > 0) clearError('attracted_ethnicity');
      else showError('attracted_ethnicity', 'Please select at least one option.');
    });
  });

  // --- Photos ---
  document.getElementById('photos').addEventListener('change', function() {
    const files = this.files;
    if (files.length === 0) { clearNeutral('photos'); return; }
    if (files.length > 3) { showError('photos', 'Maximum 3 photos allowed.'); return; }
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 10 * 1024 * 1024) {
        showError('photos', 'Each photo must be under 10 MB (' + files[i].name + ' is too large).');
        return;
      }
    }
    clearError('photos');
  });

  // --- Submit: final check for untouched fields ---
  document.getElementById('mainForm').addEventListener('submit', function(e) {
    let hasError = false;

    function check(fieldId, condition, msg) {
      if (condition) { showError(fieldId, msg); hasError = true; }
    }

    const name = document.getElementById('name').value.trim();
    check('name', name.length < 2, 'Name must be at least 2 characters.');

    check('birthday', !document.getElementById('birthday').value, 'Birthday is required.');
    check('birthday', document.getElementById('birthday').value > '2008-04-08', 'You must be at least 18 years old.');

    check('gender', !document.querySelector('input[name="gender"]:checked'), 'Please select your gender.');
    check('ethnicity', document.querySelectorAll('input[name="ethnicity"]:checked').length === 0, 'Please select at least one ethnicity.');

    const h = parseInt(document.getElementById('height').value);
    check('height', isNaN(h) || h < 70 || h > 300, 'Height must be between 70 and 300 cm.');

    check('hobbies', !document.getElementById('hobbies').value.trim(), 'Hobbies are required.');
    check('year', !document.getElementById('year').value, 'Please select your year.');
    check('match_intro', !document.getElementById('match_intro').value.trim(), 'Match intro is required.');

    check('looking_for', document.querySelectorAll('input[name="looking_for"]:checked').length === 0, 'Please select at least one option.');
    check('date_who', document.querySelectorAll('input[name="date_who"]:checked').length === 0, 'Please select at least one option.');

    const minAge = parseInt(document.getElementById('min_age').value);
    const maxAge = parseInt(document.getElementById('max_age').value);
    check('min_age', isNaN(minAge) || minAge < 18 || minAge > 99, 'Must be between 18 and 99.');
    check('max_age', isNaN(maxAge) || maxAge < 18 || maxAge > 99, 'Must be between 18 and 99.');
    if (!isNaN(minAge) && !isNaN(maxAge) && maxAge < minAge) { showError('max_age', 'Must be >= min age.'); hasError = true; }

    check('attracted_ethnicity', document.querySelectorAll('input[name="attracted_ethnicity"]:checked').length === 0, 'Please select at least one option.');

    const files = document.getElementById('photos').files;
    check('photos', files.length === 0, 'Please upload at least 1 photo.');
    if (files.length > 3) { showError('photos', 'Maximum 3 photos.'); hasError = true; }

    if (hasError) {
      e.preventDefault();
      const firstErr = document.querySelector('.has-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
</script>
</body>
</html>"""


def _esc(val: str) -> str:
    """Escape HTML entities."""
    return (
        str(val)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def render_form(errors: list[str] | None = None, data: dict | None = None) -> str:
    """Render the form HTML with optional pre-filled data and errors."""
    d = data or {}
    html = FORM_HTML

    # Error banner
    if errors:
        items = "".join(f"<li>{_esc(e)}</li>" for e in errors)
        banner = (
            f'<div class="error-banner"><strong>Please fix the following:</strong>'
            f"<ul>{items}</ul></div>"
        )
    else:
        banner = ""
    html = html.replace("{{ERROR_BANNER}}", banner)

    # Simple fields
    for field in [
        "name", "birthday", "height", "hobbies", "match_intro",
        "min_age", "max_age", "attractive_height", "attractive_face", "attractive_vibe",
    ]:
        html = html.replace("{{" + field + "}}", _esc(d.get(field, "")))

    # Gender radios
    for g in GENDERS:
        key = f"gender_{g}"
        checked = "checked" if d.get("gender") == g else ""
        html = html.replace("{{" + key + "}}", checked)

    # Year dropdown
    selected_year = d.get("year", "")
    year_default = "selected" if not selected_year else ""
    html = html.replace("{{year_default}}", year_default)
    year_opts = ""
    for y in YEARS:
        sel = "selected" if selected_year == y else ""
        year_opts += f'<option value="{y}" {sel}>{y}</option>\n'
    html = html.replace("{{year_options}}", year_opts)

    # Ethnicity checkboxes
    eth_selected = d.get("ethnicity", [])
    eth_html = ""
    for e in ETHNICITIES:
        chk = "checked" if e in eth_selected else ""
        eth_html += (
            f'<label><input type="checkbox" name="ethnicity" value="{e}" {chk}>'
            f"<span>{e}</span></label>\n"
        )
    html = html.replace("{{ethnicity_checkboxes}}", eth_html)

    # Looking for checkboxes
    lf_selected = d.get("looking_for", [])
    lf_html = ""
    for item in LOOKING_FOR:
        chk = "checked" if item in lf_selected else ""
        lf_html += (
            f'<label><input type="checkbox" name="looking_for" value="{item}" {chk}>'
            f"<span>{item}</span></label>\n"
        )
    html = html.replace("{{looking_for_checkboxes}}", lf_html)

    # Date who checkboxes
    dw_selected = d.get("date_who", [])
    dw_html = ""
    for item in DATE_WHO:
        chk = "checked" if item in dw_selected else ""
        dw_html += (
            f'<label><input type="checkbox" name="date_who" value="{item}" {chk}>'
            f"<span>{item}</span></label>\n"
        )
    html = html.replace("{{date_who_checkboxes}}", dw_html)

    # Attracted ethnicity checkboxes
    ae_selected = d.get("attracted_ethnicity", [])
    ae_html = ""
    for e in ATTRACTED_ETHNICITIES:
        chk = "checked" if e in ae_selected else ""
        ae_html += (
            f'<label><input type="checkbox" name="attracted_ethnicity" value="{e}" {chk}>'
            f"<span>{e}</span></label>\n"
        )
    html = html.replace("{{attracted_ethnicity_checkboxes}}", ae_html)

    return html


@app.get("/form", response_class=HTMLResponse)
def show_form():
    return render_form()


@app.post("/form", response_class=HTMLResponse)
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

    # Preserve form data for re-render on error
    form_data = {
        "name": name,
        "birthday": birthday,
        "gender": gender,
        "ethnicity": ethnicity,
        "height": height_raw,
        "hobbies": hobbies,
        "year": year,
        "match_intro": match_intro,
        "looking_for": looking_for,
        "date_who": date_who,
        "min_age": min_age_raw,
        "max_age": max_age_raw,
        "attracted_ethnicity": attracted_ethnicity,
        "attractive_height": attractive_height,
        "attractive_face": attractive_face,
        "attractive_vibe": attractive_vibe,
    }

    if errors:
        return render_form(errors=errors, data=form_data)

    # --- Build submission JSON and print ---
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

    # Show success page
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JustDateLah - Submitted!</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .card {
    background: #fff;
    border-radius: 16px;
    padding: 3rem;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  }
  .card h1 { color: #764ba2; margin-bottom: 1rem; }
  .card p { color: #555; line-height: 1.6; margin-bottom: 1.5rem; }
  a {
    display: inline-block;
    padding: 0.7rem 2rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-weight: 600;
  }
</style>
</head>
<body>
<div class="card">
  <h1>You're in!</h1>
  <p>Thanks for signing up for JustDateLah. We'll find you a great match soon!</p>
  <a href="/form">Submit another response</a>
</div>
</body>
</html>"""


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
