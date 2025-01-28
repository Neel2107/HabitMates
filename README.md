  # HabitMates
  Build habits together, stay accountable, and grow stronger with your partner!
 
  ## Tech Stack
 
  - **Frontend Framework:** React Native with Expo
  - **Styling:** NativeWind (TailwindCSS for React Native)
  - **State Management:** Zustand
  - **Backend & Authentication:** Supabase
  - **Navigation:** Expo Router
  - **Storage:** MMKV for local storage
  - **Animations:** React Native Reanimated

 ## **Screen Recording**

 [[Embedded screen recording here, showcasing the working app.]](https://github.com/user-attachments/assets/f7fb8bac-3d93-4892-b289-89553419afd6)
 
  ## Project Structure
 
  ```
  HabitMates/
  ├── app/                    # Application screens and navigation
  │   ├── (auth)/            # Authenticated routes
  │   │   ├── (tabs)/        # Bottom tab navigation
  │   │   │   ├── habits/    # Habits management
  │   │   │   ├── home/      # Home dashboard
  │   │   │   ├── partners/  # Partners management
  │   │   │   └── profile/   # User profile
  │   ├── login.tsx          # Login screen
  │   └── _layout.tsx        # Root layout
  ├── components/            # Reusable components
  ├── lib/                  # Core functionality
  │   ├── stores/           # Zustand stores
  │   ├── types.ts          # TypeScript definitions
  │   └── supabase.ts       # Supabase client
  └── assets/              # Static assets
  ```
 
  ## Database Schema
 
  ### Tables
 
  1. **users**
     - id (UUID, PK)
     - username (text)
     - avatar_url (text)
     - is_active (boolean)
     - banned (boolean)
     - streak_rescues_remaining (integer)
     - created_at (timestamp)
     - updated_at (timestamp)
 
  2. **habits**
     - id (UUID, PK)
     - name (text)
     - description (text)
     - frequency ('daily' | 'weekly')
     - owner_id (UUID, FK)
     - partner_id (UUID, FK)
     - current_streak (integer)
     - longest_streak (integer)
     - is_public (boolean)
     - created_at (timestamp)
     - updated_at (timestamp)
 
  3. **streaks**
     - id (UUID, PK)
     - habit_id (UUID, FK)
     - date (date)
     - user_completed (boolean)
     - partner_completed (boolean)
     - created_at (timestamp)
 
  ## Key Features
 
  1. **Authentication**
     - Email/Password login
     - Session persistence
     - Protected routes
 
  2. **Habit Management**
     - Create habits
     - Track daily/weekly progress
     - Streak tracking
     - Public/Private habits
 
  3. **Theme System**
     - Light/Dark mode
     - System theme support
     - Persistent theme preferences
 
  ## Development Setup
 
  1. Install dependencies:
  ```bash
  npm install
  ```
 
  2. Set up environment variables:
  Create a `.env` file with:
  ```
  EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
 
  3. Start the development server:
  ```bash
  npm start
  ```
 
  ## Supabase Setup
 
  1. **Enable Row Level Security (RLS)**
  ```sql
  ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
  ```
 
  2. **Create RLS Policies**
  ```sql
  -- Habits table policies
  CREATE POLICY "Users can create their own habits"
  ON habits FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id::uuid);
 
  CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT TO authenticated
  USING (auth.uid() = owner_id::uuid OR is_public = true);
 
  CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id::uuid);
 
  CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE TO authenticated
  USING (auth.uid() = owner_id::uuid);
  ```
 
  ## Build and Deploy
 
  ### Development Build
  ```bash
  eas build --profile development --platform android
  ```
 
  ### Preview Build
  ```bash
  eas build --profile preview --platform android
  ```
 
  ### Production Build
  ```bash
  eas build --profile production --platform android
  ```
 
  ## Styling Guide
 
  The project uses a custom TailwindCSS configuration with the following theme extensions:
 
  - Brand Colors
    - Primary: Emerald (#059669)
    - Primary Dark: Light Emerald (#6ee7b7)
    - Secondary: Indigo (#6366f1)
    - Secondary Dark: Light Indigo (#818cf8)
 
  - App Background
    - Light: #f8fafc
    - Dark: #0f172a
 
  - Card Colors
    - Light: #ffffff
    - Dark: #1e293b
 
  ## Known Issues & Solutions
 
  1. **RLS Policy Type Mismatch**
     - Issue: UUID comparison in RLS policies
     - Solution: Cast owner_id to UUID using `owner_id::uuid`
 
  2. **Theme Persistence**
     - Using MMKV storage for better performance
     - Theme state managed through Zustand store
 
  ## Future Enhancements
 
  1. Partner System
     - Implement partner invitations
     - Add partner streak tracking
     - Add partner chat/communication
 
  2. Achievements System
     - Track milestones
     - Award badges/rewards
     - Implement streak rescue system
 
  3. Social Features
     - Public habit discovery
     - Community challenges
     - Social sharing
 
  ## Contributing
 
  1. Fork the repository
  2. Create your feature branch
  3. Commit your changes
  4. Push to the branch
  5. Create a new Pull Request
 
  ## License
 
  This project is private and proprietary.
