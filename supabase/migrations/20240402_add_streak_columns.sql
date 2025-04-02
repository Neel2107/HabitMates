-- First drop existing columns and constraints if they exist
ALTER TABLE habits DROP COLUMN IF EXISTS current_streak;
ALTER TABLE habits DROP COLUMN IF EXISTS longest_streak;
ALTER TABLE habits DROP CONSTRAINT IF EXISTS check_streak_counts;
DROP TRIGGER IF EXISTS habits_streak_update ON habits;
DROP FUNCTION IF EXISTS update_streak_counts();

-- Add or modify streak-related columns
ALTER TABLE habits 
  ADD COLUMN IF NOT EXISTS last_completed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS current_streak_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_start_date timestamp with time zone;

-- Add indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_habits_last_completed_at ON habits(last_completed_at);
CREATE INDEX IF NOT EXISTS idx_habits_current_streak ON habits(current_streak_count);

-- Add constraint to ensure streak counts are non-negative
ALTER TABLE habits ADD CONSTRAINT check_streak_counts 
  CHECK (current_streak_count >= 0 AND longest_streak_count >= 0);

-- Function to update streak counts
CREATE OR REPLACE FUNCTION update_streak_counts()
RETURNS trigger AS $$
BEGIN
  -- Update last_completed_at
  NEW.last_completed_at = now();
  
  -- If this is the first completion or continuing a streak
  IF (OLD.last_completed_at IS NULL) OR 
     (date_trunc('day', OLD.last_completed_at) = date_trunc('day', now() - interval '1 day')) THEN
    -- Increment streak
    NEW.current_streak_count = COALESCE(OLD.current_streak_count, 0) + 1;
    -- Set streak start if not set
    IF NEW.streak_start_date IS NULL THEN
      NEW.streak_start_date = now();
    END IF;
  -- If completing today's habit again, don't increment
  ELSIF (date_trunc('day', OLD.last_completed_at) = date_trunc('day', now())) THEN
    NEW.current_streak_count = OLD.current_streak_count;
  ELSE
    -- Streak broken, reset
    NEW.current_streak_count = 1;
    NEW.streak_start_date = now();
  END IF;

  -- Update longest streak if current is higher
  IF NEW.current_streak_count > COALESCE(OLD.longest_streak_count, 0) THEN
    NEW.longest_streak_count = NEW.current_streak_count;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streak updates
CREATE TRIGGER habits_streak_update
  AFTER INSERT OR UPDATE ON streaks
  FOR EACH ROW
  WHEN (NEW.user_completed = true)
  EXECUTE FUNCTION update_streak_counts();