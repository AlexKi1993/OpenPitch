"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Pencil, X, Save } from "lucide-react";
import type { Profile } from "@/types/database";

export default function ProfileEditor({ profile }: { profile: Profile }) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [skillsText, setSkillsText] = useState(
    (profile.skills || []).join(", ")
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    if (fullName.length > 100 || bio.length > 1000 || website.length > 200 || skillsText.length > 500) {
      return;
    }
    setLoading(true);
    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);

    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio,
        website: website || null,
        skills,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setEditing(false);
    setLoading(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="mt-4 flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
      >
        <Pencil className="h-4 w-4" />
        Profil bearbeiten
      </button>
    );
  }

  return (
    <div className="mt-6 border-t border-border pt-6 space-y-4">
      <h3 className="font-semibold">Profil bearbeiten</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={100}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Website</label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
          maxLength={200}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Skills (kommagetrennt)
        </label>
        <input
          type="text"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          placeholder="React, Python, Marketing, Design..."
          maxLength={500}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setEditing(false)}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
          Abbrechen
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "Wird gespeichert..." : "Speichern"}
        </button>
      </div>
    </div>
  );
}
