"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./profile.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Profile {
  name: string;
  birthday: string;
  gender: string;
  ethnicity: string[];
  height_cm: number;
  hobbies: string;
  year: string;
  match_intro: string;
  looking_for: string[];
  date_who: string[];
  min_age: number;
  max_age: number;
  attracted_ethnicity: string[];
  attractive_height_build: string | null;
  attractive_facial_features: string | null;
  attractive_energy_vibes: string | null;
  photos: string[];
}

function calculateAge(birthday: string): number {
  const bday = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - bday.getFullYear();
  const monthDiff = today.getMonth() - bday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bday.getDate())) {
    age--;
  }
  return age;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="profile-loading">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const telegramId = searchParams.get("tg") || "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!telegramId) {
      setError("No profile ID provided.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/profile/${telegramId}`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      })
      .then(res => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(() => setError("Profile not found."))
      .finally(() => setLoading(false));
  }, [telegramId]);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="profile-error">
        <h2>Oops</h2>
        <p>{error || "Something went wrong."}</p>
      </div>
    );
  }

  const age = calculateAge(profile.birthday);

  return (
    <div className="profile-container">
      {/* Photos */}
      {profile.photos.length > 0 && (
        <div className={`profile-photos${profile.photos.length === 1 ? " single-photo" : ""}`}>
          {profile.photos.map((url, i) => (
            <img key={i} src={url} alt={`${profile.name} photo ${i + 1}`} />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="profile-header">
        <h1>{profile.name}</h1>
        <p className="age-gender">{age} &bull; {profile.gender} &bull; {profile.height_cm}cm</p>
      </div>

      {/* Match intro quote */}
      <div className="profile-match-intro">
        {profile.match_intro}
      </div>

      {/* About */}
      <div className="profile-card">
        <h2>About</h2>
        <div className="profile-stat">
          <span className="label">Year</span>
          <span className="value">{profile.year}</span>
        </div>
        <div className="profile-stat">
          <span className="label">Ethnicity</span>
          <span className="value">{profile.ethnicity.join(", ")}</span>
        </div>
        <div className="profile-stat">
          <span className="label">Height</span>
          <span className="value">{profile.height_cm} cm</span>
        </div>
      </div>

      {/* Hobbies */}
      <div className="profile-card">
        <h2>Hobbies &amp; Interests</h2>
        <p>{profile.hobbies}</p>
      </div>

      {/* Looking for */}
      <div className="profile-card">
        <h2>Looking for</h2>
        <div className="profile-tags">
          {profile.looking_for.map(item => (
            <span key={item} className="profile-tag accent">{item}</span>
          ))}
        </div>
      </div>

      {/* Dating preferences */}
      <div className="profile-card">
        <h2>Dating Preferences</h2>
        <div className="profile-stat">
          <span className="label">Interested in</span>
          <span className="value">{profile.date_who.join(", ")}</span>
        </div>
        <div className="profile-stat">
          <span className="label">Age range</span>
          <span className="value">{profile.min_age} – {profile.max_age}</span>
        </div>
        <div className="profile-stat">
          <span className="label">Attracted to</span>
          <span className="value">{profile.attracted_ethnicity.join(", ")}</span>
        </div>
      </div>

      {/* Physical preferences */}
      {(profile.attractive_height_build || profile.attractive_facial_features || profile.attractive_energy_vibes) && (
        <div className="profile-card">
          <h2>What I find attractive</h2>
          {profile.attractive_height_build && (
            <div className="profile-stat">
              <span className="label">Height &amp; Build</span>
              <span className="value">{profile.attractive_height_build}</span>
            </div>
          )}
          {profile.attractive_facial_features && (
            <div className="profile-stat">
              <span className="label">Face</span>
              <span className="value">{profile.attractive_facial_features}</span>
            </div>
          )}
          {profile.attractive_energy_vibes && (
            <div className="profile-stat">
              <span className="label">Energy &amp; Vibes</span>
              <span className="value">{profile.attractive_energy_vibes}</span>
            </div>
          )}
        </div>
      )}

      <div className="profile-footer">JustDateLah &bull; Singapore</div>
    </div>
  );
}
