# JustDateLah — Tally Form Specification

**Form URL:** https://tally.so/r/5BGBeN
**Form ID:** 5BGBeN
**Layout:** Single-page scrolling form (no page breaks)
**Progress bar:** Disabled
**Status:** Published

---

## Section 1: Tell us your basics

### Q1. What's your name?
- **Type:** Short text (INPUT_TEXT)
- **Required:** Yes
- **Placeholder:** "Type your answer here..."
- **Validation:**
  - Minimum characters: 2
  - Maximum characters: 50

---

### Q2. When is your birthday?
- **Type:** Date picker (INPUT_DATE)
- **Required:** Yes
- **Helper text:** "Only your age will be shown to others"
- **Validation:**
  - Date must be on or before 2008-04-08 (enforces 18+ minimum age)
  - No future dates allowed

---

### Q3. What's your gender?
- **Type:** Single-select radio buttons (MULTIPLE_CHOICE)
- **Required:** Yes
- **Options:**
  1. Female
  2. Male
  3. Nonbinary

---

### Q4. What's your ethnicity? *(Select all that apply)*
- **Type:** Multi-select checkboxes (CHECKBOXES)
- **Required:** Yes
- **Options (Singapore-relevant):**
  1. Chinese
  2. Malay
  3. Indian
  4. Eurasian
  5. Filipino
  6. Indonesian
  7. Caucasian/White
  8. Japanese
  9. Korean
  10. Other
  11. Prefer not to say

---

### Q5. How tall are you? (cm)
- **Type:** Number input (INPUT_NUMBER)
- **Required:** Yes
- **Placeholder:** "e.g. 170"
- **Validation:**
  - Minimum: 70
  - Maximum: 300
  - Suffix displayed: " cm"

---

### Q6. Share your hobbies and interests
- **Type:** Long text / textarea (TEXTAREA)
- **Required:** Yes
- **Placeholder:** "e.g. reading, music, hiking, cooking..."

---

### Q7. What year are you in?
- **Type:** Dropdown (DROPDOWN)
- **Required:** Yes
- **Options:**
  1. Freshman
  2. Sophomore
  3. Junior
  4. Senior
  5. Master
  6. PhD
  7. Other

---

### Q8. What's the first thing you'd want your match to know about you?
- **Type:** Long text / textarea (TEXTAREA)
- **Required:** Yes
- **Helper text:** "They'll see it when they're matched with you."
- **Placeholder:** "Could be a fun fact, a vibe check, anything really"

---

## Section 2: Tell us your type

### Q9. What are you looking for right now? *(Select all that apply)*
- **Type:** Multi-select checkboxes (CHECKBOXES)
- **Required:** Yes
- **Options:**
  1. Life partner
  2. Serious relationship
  3. Casual dates
  4. New friends
  5. Not sure yet

---

### Q10. Who do you wanna date? *(Select all who you're open to meeting)*
- **Type:** Multi-select checkboxes (CHECKBOXES)
- **Required:** Yes
- **Options:**
  1. Men
  2. Women
  3. Nonbinary
  4. Everyone

---

### Q11. Minimum age you'd like to date
- **Type:** Number input (INPUT_NUMBER)
- **Required:** Yes
- **Placeholder:** "e.g. 18"
- **Validation:**
  - Minimum: 18
  - Maximum: 99

---

### Q12. Maximum age you'd like to date
- **Type:** Number input (INPUT_NUMBER)
- **Required:** Yes
- **Placeholder:** "e.g. 30"
- **Validation:**
  - Minimum: 18
  - Maximum: 99

---

### Q13. What ethnicities are you attracted to? *(Select all that apply)*
- **Type:** Multi-select checkboxes (CHECKBOXES)
- **Required:** Yes
- **Options (Singapore-relevant):**
  1. Chinese
  2. Malay
  3. Indian
  4. Eurasian
  5. Filipino
  6. Indonesian
  7. Caucasian/White
  8. Japanese
  9. Korean
  10. Other
  11. No preference

---

### Q14. What do you find physically attractive? — Height & Build
- **Type:** Long text / textarea (TEXTAREA)
- **Required:** No (optional)
- **Placeholder:** "e.g. 5'10, athletic, broad shoulders..."

---

### Q15. What do you find physically attractive? — Facial Features
- **Type:** Long text / textarea (TEXTAREA)
- **Required:** No (optional)
- **Placeholder:** "e.g. expressive eyes, warm smiles, clean-shaven..."

---

### Q16. What do you find physically attractive? — Energy & Vibes
- **Type:** Long text / textarea (TEXTAREA)
- **Required:** No (optional)
- **Placeholder:** "e.g. Artsy/Indie, Nerd/Smart, Calm & Grounding..."

---

## Section 3: Show us your vibe

### Q17. Upload your photos
- **Type:** File upload (FILE_UPLOAD)
- **Required:** Yes
- **Helper text:** "Add up to 3 pics that show your face and vibe. Clear face photos from different moments help find better matches for you."
- **Validation:**
  - Multiple files: enabled
  - Minimum files: 1
  - Maximum files: 3
  - Max file size: 10 MB (Tally default)

---

## Design & Layout Notes

- **Theme:** Default Tally white/clean theme
- **Font:** Tally default sans-serif
- **Section dividers:** Horizontal rules (DIVIDER blocks) separate the 3 sections
- **Section headings:** H2 headings for each section ("Tell us your basics", "Tell us your type", "Show us your vibe")
- **Submit button:** Default "Submit" at the bottom
- **Branding:** "Made with Tally" badge (bottom-right, Tally free tier)

## Validation Summary

| Question | Type | Required | Constraints |
|----------|------|----------|-------------|
| Name | Text | Yes | 2-50 characters |
| Birthday | Date | Yes | On or before 2008-04-08 (18+) |
| Gender | Radio | Yes | Single select from 3 options |
| Your ethnicity | Checkboxes | Yes | Multi-select, 11 SG-relevant options |
| Height | Number | Yes | 70-300 cm |
| Hobbies | Textarea | Yes | None |
| Year | Dropdown | Yes | Single select from 7 options |
| Match intro | Textarea | Yes | None |
| Looking for | Checkboxes | Yes | Multi-select, 5 options |
| Who to date | Checkboxes | Yes | Multi-select, 4 options |
| Min age | Number | Yes | 18-99 |
| Max age | Number | Yes | 18-99 |
| Attracted ethnicities | Checkboxes | Yes | Multi-select, 11 SG-relevant options |
| Attractive — Height & Build | Textarea | No | None |
| Attractive — Facial Features | Textarea | No | None |
| Attractive — Energy & Vibes | Textarea | No | None |
| Photos | File upload | Yes | 1-3 files, max 10MB each |
