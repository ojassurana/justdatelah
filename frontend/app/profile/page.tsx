"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bday.getDate())) age--;
  return age;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white/40 font-body">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) { setError("No profile ID provided."); setLoading(false); return; }
    fetch(`${API_URL}/api/profile/${token}`, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then(res => { if (!res.ok) throw new Error("Not found"); return res.json(); })
      .then(data => setProfile(data))
      .catch(() => setError("Profile not found."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActivePhoto(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [profile]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-white/40 font-body text-lg">Loading...</div>;
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <h2 className="font-heading text-3xl italic text-white">Oops</h2>
        <p className="font-body text-white/40">{error || "Something went wrong."}</p>
      </div>
    );
  }

  const age = calculateAge(profile.birthday);
  const photos = profile.photos;

  return (
    <div className="mx-auto min-h-screen max-w-[480px] overflow-x-hidden bg-black">
      {/* Photo carousel */}
      {photos.length > 0 && (
        <div className="relative">
          <div ref={scrollRef} className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {photos.map((url, i) => (
              <div key={i} className="w-full flex-shrink-0 snap-start">
                <Image src={url} alt={`${profile.name} photo ${i + 1}`} width={480} height={640}
                  priority={i === 0} sizes="100vw"
                  className="h-auto w-full object-cover" style={{ aspectRatio: "3/4" }} />
              </div>
            ))}
          </div>
          {/* Dots */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-200 ${i === activePhoto ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
              ))}
            </div>
          )}
          {/* Gradient fade into content */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}

      {/* Name + basics */}
      <div className="relative z-10 -mt-16 px-5 text-center">
        <h1 className="font-heading text-5xl italic text-white">{profile.name}</h1>
        <p className="mt-1 font-body text-base font-light text-white/50">
          {age} &bull; {profile.gender} &bull; {profile.height_cm}cm
        </p>
      </div>

      {/* Match intro quote */}
      <div className="mx-5 mt-6">
        <div className="liquid-glass rounded-2xl px-6 py-6 text-center">
          <span className="block font-heading text-3xl leading-none text-white/20">&ldquo;</span>
          <p className="mt-1 font-heading text-xl italic leading-relaxed text-white/80">
            {profile.match_intro}
          </p>
        </div>
      </div>

      {/* Content cards */}
      <div className="mt-6 flex flex-col gap-4 px-5 pb-8">

        {/* About */}
        <div className="liquid-glass rounded-2xl p-5">
          <h2 className="mb-3 font-body text-xs font-medium uppercase tracking-widest text-white/35">About</h2>
          <div className="space-y-0">
            <Row label="Year" value={profile.year} />
            <Row label="Ethnicity" value={profile.ethnicity.join(", ")} />
            <Row label="Height" value={`${profile.height_cm} cm`} />
          </div>
        </div>

        {/* Hobbies */}
        <div className="liquid-glass rounded-2xl p-5">
          <h2 className="mb-3 font-body text-xs font-medium uppercase tracking-widest text-white/35">Hobbies &amp; Interests</h2>
          <p className="font-body text-[0.95rem] font-light leading-relaxed text-white/80">{profile.hobbies}</p>
        </div>

        {/* Looking for */}
        <div className="liquid-glass rounded-2xl p-5">
          <h2 className="mb-3 font-body text-xs font-medium uppercase tracking-widest text-white/35">Looking for</h2>
          <div className="flex flex-wrap gap-2">
            {profile.looking_for.map(item => (
              <span key={item} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-body text-sm text-white/80">{item}</span>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="liquid-glass rounded-2xl p-5">
          <h2 className="mb-3 font-body text-xs font-medium uppercase tracking-widest text-white/35">Dating Preferences</h2>
          <div className="space-y-0">
            <Row label="Interested in" value={profile.date_who.join(", ")} />
            <Row label="Age range" value={`${profile.min_age} – ${profile.max_age}`} />
            <Row label="Attracted to" value={profile.attracted_ethnicity.join(", ")} />
          </div>
        </div>

        {/* Physical preferences */}
        {(profile.attractive_height_build || profile.attractive_facial_features || profile.attractive_energy_vibes) && (
          <div className="liquid-glass rounded-2xl p-5">
            <h2 className="mb-3 font-body text-xs font-medium uppercase tracking-widest text-white/35">What I find attractive</h2>
            <div className="space-y-0">
              {profile.attractive_height_build && <Row label="Height & Build" value={profile.attractive_height_build} />}
              {profile.attractive_facial_features && <Row label="Face" value={profile.attractive_facial_features} />}
              {profile.attractive_energy_vibes && <Row label="Energy & Vibes" value={profile.attractive_energy_vibes} />}
            </div>
          </div>
        )}

        <p className="pt-4 text-center font-body text-xs text-white/20">JustDateLah &bull; Singapore</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-2.5 last:border-b-0">
      <span className="font-body text-sm font-light text-white/40">{label}</span>
      <span className="max-w-[60%] text-right font-body text-sm text-white/80">{value}</span>
    </div>
  );
}
