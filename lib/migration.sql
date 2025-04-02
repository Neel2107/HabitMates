-- Function to safely delete a habit and all its associated data
CREATE OR REPLACE FUNCTION delete_habit_with_dependencies(habit_id UUID)
RETURNS void AS $$
BEGIN
    -- First delete all streaks associated with the habit
    DELETE FROM streaks WHERE habit_id = $1;
    
    -- Delete all habit invites associated with the habit
    DELETE FROM habit_invites WHERE habit_id = $1;
    
    -- Then delete the habit itself
    DELETE FROM habits WHERE id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative solution: Add ON DELETE CASCADE to the foreign key constraints
-- This would automatically delete associated records when a habit is deleted
-- 
-- ALTER TABLE streaks DROP CONSTRAINT streaks_habit_id_fkey;
-- ALTER TABLE streaks ADD CONSTRAINT streaks_habit_id_fkey
--   FOREIGN KEY (habit_id)
--   REFERENCES habits(id)
--   ON DELETE CASCADE;
-- 
-- ALTER TABLE habit_invites DROP CONSTRAINT habit_invites_habit_id_fkey;
-- ALTER TABLE habit_invites ADD CONSTRAINT habit_invites_habit_id_fkey
--   FOREIGN KEY (habit_id)
--   REFERENCES habits(id)
--   ON DELETE CASCADE; 