/*
  # Create Categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `nombre` (text, not null)
      - `slug` (text, not null, unique)
      - `descripcion` (text)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `categories` table
    - Add policy for everyone to read categories
    - Add policy for authenticated users to insert/update categories
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  descripcion text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);
