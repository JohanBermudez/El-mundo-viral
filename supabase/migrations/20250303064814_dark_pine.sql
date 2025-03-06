/*
  # Create Pages table

  1. New Tables
    - `pages`
      - `id` (uuid, primary key)
      - `nombre` (text, not null)
      - `estado` (boolean, default true)
      - `config_publicacion` (jsonb)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `pages` table
    - Add policy for authenticated users to read all pages
    - Add policy for authenticated users to insert/update their own pages
*/

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  estado boolean DEFAULT true,
  config_publicacion jsonb DEFAULT '{"auto_publish": false}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are viewable by everyone"
  ON pages
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own pages"
  ON pages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own pages"
  ON pages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
