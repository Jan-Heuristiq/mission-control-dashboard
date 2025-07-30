

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
  source: 'Heuristiq' | 'Echodeck';
  is_new_customer: boolean;
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

export type SecondaryMission = {
  id: number;
  name: string;
  description: string;
  target_arr: number;
  target_customers: number;
};

export type FounderSecondaryMission = {
  id: number;
  founder_id: number;
  mission_id: number;
  share_percentage: number;
};

export type DashboardData = {
  totalTarget: number;
  totalMonths: number;
  sprintStartMonth: number;
  sprintStartYear: number;
  founders: Founder[];
  revenueEntries: RevenueEntry[];
  posts: Post[];
  currentMonth: number;
  secondaryMissions: SecondaryMission[];
  founderSecondaryMissions: FounderSecondaryMission[];
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
      secondary_missions: {
        Row: SecondaryMission
        Insert: Omit<SecondaryMission, 'id'>
        Update: Partial<SecondaryMission>
      },
      founder_secondary_missions: {
        Row: FounderSecondaryMission
        Insert: Omit<FounderSecondaryMission, 'id'>
        Update: Partial<FounderSecondaryMission>
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