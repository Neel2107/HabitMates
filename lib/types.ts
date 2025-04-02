export interface User {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  banned: boolean;
  streakRescuesRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  frequency: 'daily' | 'weekly';
  owner_id: string;
  partner_id: string | null;
  current_streak: number;
  longest_streak: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  todayCompleted?: boolean;
  target_days?: number;
  status?: 'active' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string | null;
  streaks?: Streak[];
  last_completed_at: string | null;
  current_streak_count: number;
  longest_streak_count: number;
  streak_start_date: string | null;
}

export interface Streak {
  id: string;
  habit_id: string;
  date: string;
  user_completed: boolean;
  partner_completed: boolean | null;
  user_proof_url?: string | null;
  partner_proof_url?: string | null;
}

export interface HabitInvite {
  id: string;
  habitId: string;
  senderId: string;
  receiverEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'streak' | 'reaction' | 'invite';
  message: string;
  isRead: boolean;
  createdAt: string;
}

