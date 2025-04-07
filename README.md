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
 
 ### iOS
 
 ```bash
 eas build --platform ios
 ```
 
 ### Android
 
 ```bash
 eas build --platform android
 ```
 
 ## Technical Challenges & Solutions
 
 1. **Supabase RLS Policies**
    - Issue: UUID comparison in RLS policies
    - Solution: Cast owner_id to UUID using `owner_id::uuid`
 
 2. **Theme Persistence**
    - Using MMKV storage for better performance
    - Theme state managed through Zustand store
 
 ## Future Enhancements
 
 1. **Partner System**
    - Implement partner invitations
    - Add partner streak tracking
    - Add partner chat/communication
 
 2. **Achievements System**
    - Track milestones
    - Award badges/rewards
    - Implement streak rescue system
 
 3. **Social Features**
    - Public habit discovery
    - Community challenges
    - Social sharing

 4. **Accountability Deposit System**
    - Allow users to deposit money when creating habits
    - Implement partner accountability with financial incentives
    - Automate payout based on habit completion
    - Integrate secure payment processing
 
 5. **Advanced Analytics**
    - Detailed habit performance metrics
    - Personalized insights and recommendations
    - Visual progress tracking with charts and graphs

 6. **Offline Support**
    - Local data persistence
    - Background syncing when connection is restored
    - Optimistic UI updates

 ## Current Development Status

 HabitMates is currently undergoing a UI/UX redesign to improve user experience and visual appeal.
 Key focus areas include:

 - Creating a consistent design system
 - Implementing a modern, clean interface
 - Enhancing visual hierarchy and readability
 - Adding micro-interactions and feedback animations
 - Improving user flows and interactions
 
 ## Contributing

 We welcome contributions to HabitMates! Here's how you can help:

 1. Fork the repository
 2. Create your feature branch (`git checkout -b feature/amazing-feature`)
 3. Commit your changes (`git commit -m 'Add some amazing feature'`)
 4. Push to the branch (`git push origin feature/amazing-feature`)
 5. Open a Pull Request

 Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

 ## Code of Conduct

 Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the community standards we uphold.

 ## License

 This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
