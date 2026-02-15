"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, X } from "lucide-react";

interface CollaboratorActionsProps {
  collaboratorId: string;
  currentStatus: string;
}

export default function CollaboratorActions({ collaboratorId, currentStatus }: CollaboratorActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleAction(status: "accepted" | "rejected") {
    if (loading) return;
    setLoading(true);

    const { error } = await supabase
      .from("collaborators")
      .update({ status })
      .eq("id", collaboratorId);

    if (!error) {
      router.refresh();
    }
    setLoading(false);
  }

  if (currentStatus !== "pending") {
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
          currentStatus === "accepted"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {currentStatus === "accepted" ? "Akzeptiert" : "Abgelehnt"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction("accepted")}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        <Check className="h-3.5 w-3.5" />
        Akzeptieren
      </button>
      <button
        onClick={() => handleAction("rejected")}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        <X className="h-3.5 w-3.5" />
        Ablehnen
      </button>
    </div>
  );
}
