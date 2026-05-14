-- Add is_anonymous column to donations table
ALTER TABLE donations ADD COLUMN is_anonymous boolean default false;

-- Update the comment to reflect the new column
COMMENT ON COLUMN donations.is_anonymous IS 'Whether the donation is anonymous';
