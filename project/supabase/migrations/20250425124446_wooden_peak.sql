/*
  # Initial vocabulary schema setup

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `term` (text)
      - `definition` (text)
      - `phonetic` (text)
      - `tags` (text[])
      - `created_at` (timestamptz)
      - `last_reviewed` (timestamptz)
      - `review_count` (integer)
      - `mastery` (integer)

  2. Security
    - Enable RLS on `words` table
    - Add policies for authenticated users to:
      - Read their own words
      - Create new words
      - Update their own words
      - Delete their own words
*/

CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  term text NOT NULL,
  definition text NOT NULL,
  phonetic text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  last_reviewed timestamptz,
  review_count integer DEFAULT 0,
  mastery integer DEFAULT 0,
  CONSTRAINT mastery_range CHECK (mastery >= 0 AND mastery <= 100)
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own words
CREATE POLICY "Users can read own words"
  ON words
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own words
CREATE POLICY "Users can create words"
  ON words
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own words
CREATE POLICY "Users can update own words"
  ON words
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own words
CREATE POLICY "Users can delete own words"
  ON words
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS words_user_id_idx ON words(user_id);
CREATE INDEX IF NOT EXISTS words_created_at_idx ON words(created_at);
CREATE INDEX IF NOT EXISTS words_term_idx ON words(term);