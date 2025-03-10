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
}

export interface Streak {
  id: string;
  habitId: string;
  date: string;
  userCompleted: boolean;
  partnerCompleted: boolean;
  userProofUrl: string | null;
  partnerProofUrl: string | null;
  createdAt: string;
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

