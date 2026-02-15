"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CollaborateButtonProps {
  ideaId: string;
  userId?: string;
  hasApplied: boolean;
}

export default function CollaborateButton({
  ideaId,
  userId,
  hasApplied,
}: CollaborateButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("developer");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const router = useRouter();
  const supabase = createClient();

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    const { error } = await supabase.from("collaborators").insert({
      idea_id: ideaId,
      user_id: userId,
      role,
      message: message.trim(),
    });

    if (!error) {
      setApplied(true);
      setShowModal(false);
      setMessage("");
      router.refresh();
    }
    setLoading(false);
  }

  if (!userId) {
    return (
      <a
        href={`/login?redirect=/ideas/${ideaId}`}
        className="flex items-center gap-2 rounded-lg border-2 border-primary bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
      >
        <Users className="h-5 w-5" />
        Mitmachen - Anmelden
      </a>
    );
  }

  if (applied) {
    return (
      <div className="flex items-center gap-2 rounded-lg border-2 border-green-500 bg-green-50 px-6 py-3 text-sm font-medium text-green-700">
        <Users className="h-5 w-5" />
        Bewerbung gesendet!
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 rounded-lg border-2 border-primary bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
      >
        <Users className="h-5 w-5" />
        Ich will das umsetzen!
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Als Umsetzer bewerben</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Deine Rolle
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="marketing">Marketing</option>
                  <option value="business">Business / Strategy</option>
                  <option value="investor">Investor</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nachricht an den Ideengeber
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Warum willst du bei dieser Idee mitmachen? Was bringst du mit?"
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Wird gesendet..." : "Bewerben"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
