export interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  skills: string[];
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  target_audience: string;
  category: string;
  status: "open" | "in_progress" | "implemented" | "archived";
  self_implement: boolean;
  looking_for: string;
  mvp_budget: string;
  not_self_reason: string;
  vote_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Profile;
  tags?: Tag[];
  images?: IdeaImage[];
  user_voted?: boolean;
}

export interface IdeaImage {
  id: string;
  idea_id: string;
  storage_path: string;
  position: number;
  created_at: string;
}

export interface Comment {
  id: string;
  idea_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
}

export interface Vote {
  id: string;
  idea_id: string;
  user_id: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface IdeaTag {
  idea_id: string;
  tag_id: string;
}

export interface Collaborator {
  id: string;
  idea_id: string;
  user_id: string;
  role: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  // Joined
  user?: Profile;
  idea?: Idea;
}

export interface Message {
  id: string;
  collaborator_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  // Joined
  sender?: Profile;
}

export const CATEGORIES = [
  "SaaS",
  "E-Commerce",
  "FinTech",
  "HealthTech",
  "EdTech",
  "GreenTech",
  "Social Impact",
  "AI / ML",
  "Hardware",
  "Marketplace",
  "Mobile App",
  "Developer Tools",
  "Other",
] as const;

export const STATUS_LABELS: Record<Idea["status"], string> = {
  open: "Offen",
  in_progress: "In Umsetzung",
  implemented: "Umgesetzt",
  archived: "Archiviert",
};

export const STATUS_COLORS: Record<Idea["status"], string> = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  implemented: "bg-purple-100 text-purple-800",
  archived: "bg-gray-100 text-gray-800",
};

export interface Story {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  story_type: "success" | "fuckup";
  idea_summary: string;
  what_went_well: string;
  what_went_wrong: string;
  lessons_learned: string;
  advice: string;
  vote_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Profile;
  user_voted?: boolean;
}

export interface StoryVote {
  id: string;
  story_id: string;
  user_id: string;
  created_at: string;
}

export interface StoryComment {
  id: string;
  story_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
}

export const STORY_TYPES = {
  success: { label: "Erfolgsgeschichte", color: "bg-green-100 text-green-800" },
  fuckup: { label: "FuckUp", color: "bg-red-100 text-red-800" },
} as const;

export interface Lesson {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  category: string;
  situation: string;
  learning: string;
  advice: string;
  vote_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Profile;
  user_voted?: boolean;
}

export interface LessonVote {
  id: string;
  lesson_id: string;
  user_id: string;
  created_at: string;
}

export interface LessonComment {
  id: string;
  lesson_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
}

export const LESSON_CATEGORIES = [
  "Marketing",
  "Team & Kultur",
  "Finanzen",
  "Produkt",
  "Fundraising",
  "Technik",
  "Vertrieb",
  "Sonstiges",
] as const;
