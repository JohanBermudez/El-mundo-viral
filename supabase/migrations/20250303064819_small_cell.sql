/*
  # Create Sources table

  1. New Tables
    - `sources`
      - `id` (uuid, primary key)
      - `page_id` (uuid, foreign key to pages)
      - `nombre` (text, not null)
      - `url_origen` (text)
      - `config_publicacion` (jsonb)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `sources` table
    - Add policy for authenticated users to read all sources
    - Add policy for authenticated users to insert/update their own sources
*/

CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  url_origen text,
  config_publicacion jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sources are viewable by everyone"
  ON sources
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own sources"
  ON sources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    page_id IN (
      SELECT id FROM pages WHERE auth.uid() = pages.id
    )
  );

CREATE POLICY "Users can update their own sources"
  ON sources
  FOR UPDATE
  TO authenticated
  USING (
    page_id IN (
      SELECT id FROM pages WHERE auth.uid() = pages.id
    )
  );
