import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInitials, timeAgo } from "@/lib/utils";
import IdeaCard from "@/components/IdeaCard";
import ProfileEditor from "@/components/ProfileEditor";
import {
  Calendar,
  Globe,
  Lightbulb,
  ArrowUp,
  Mail,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: ideas } = await supabase
    .from("ideas")
    .select("*, author:profiles(*)")
    .eq("author_id", id)
    .order("created_at", { ascending: false });

  const totalVotes =
    ideas?.reduce((sum, idea) => sum + idea.vote_count, 0) || 0;

  const isOwnProfile = currentUser?.id === id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Profile Header */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold shrink-0">
            {getInitials(profile.full_name)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {profile.full_name || "Anonym"}
                </h1>
                {profile.bio && (
                  <p className="mt-2 text-muted-foreground">{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Dabei seit {timeAgo(profile.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                {ideas?.length || 0} Ideen
              </div>
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4" />
                {totalVotes} Votes
              </div>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile */}
        {isOwnProfile && <ProfileEditor profile={profile} />}
      </div>

      {/* Ideas */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Ideen von {profile.full_name || "diesem Nutzer"} ({ideas?.length || 0}
          )
        </h2>
        {ideas && ideas.length > 0 ? (
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Noch keine Ideen gepitcht.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
