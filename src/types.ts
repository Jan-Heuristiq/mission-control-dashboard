
export type Founder = {
  id: number;
  name: string;
  target: number;
  access_key: string;
};

export type RevenueEntry = {
  id: number;
  founder_id: number;
  amount: number;
  date: string;
  description?: string | null;
};

export type Post = {
  id: number;
  author_id: number;
  text: string;
  type: 'win' | 'blocker';
  timestamp: string;
};

export type Config = {
  key: string;
  value: string;
}

export type DashboardData = {
  totalTarget: number;
  totalMonths: number;
  sprintStartMonth: number;
  sprintStartYear: number;
  founders: Founder[];
  revenueEntries: RevenueEntry[];
  posts: Post[];
  currentMonth: number;
};

// Auto-generated Supabase types would go here, but we define them manually for simplicity
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      config: {
        Row: Config
        Insert: Omit<Config, 'id'>
        Update: Partial<Config>
      }
      founders: {
        Row: Founder
        Insert: Omit<Founder, 'id'>
        Update: Partial<Founder>
      }
      revenue: {
        Row: RevenueEntry
        Insert: Omit<RevenueEntry, 'id'>
        Update: Partial<RevenueEntry>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'timestamp'> & { timestamp?: string }
        Update: Partial<Post>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}