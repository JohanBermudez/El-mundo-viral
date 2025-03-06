/*
  # Create Articles table

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `page_id` (uuid, foreign key to pages)
      - `source_id` (uuid, foreign key to sources)
      - `titulo` (text, not null)
      - `subtitulo` (text)
      - `contenido` (jsonb, not null)
      - `imagen_principal` (text)
      - `slug` (text, not null, unique)
      - `seo` (jsonb)
      - `estado_publicacion` (text, default 'pendiente')
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `articles` table
    - Add policy for everyone to read published articles
    - Add policy for authenticated users to read all articles
    - Add policy for authenticated users to insert/update their own articles
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  subtitulo text,
  contenido jsonb NOT NULL,
  imagen_principal text,
  slug text NOT NULL UNIQUE,
  seo jsonb DEFAULT '{}'::jsonb,
  estado_publicacion text DEFAULT 'pendiente',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX articles_slug_idx ON articles(slug);
CREATE INDEX articles_estado_publicacion_idx ON articles(estado_publicacion);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
  ON articles
  FOR SELECT
  USING (estado_publicacion = 'publicado');

CREATE POLICY "All articles are viewable by authenticated users"
  ON articles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    page_id IN (
      SELECT id FROM pages WHERE auth.uid() = pages.id
    )
  );

CREATE POLICY "Users can update their own articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (
    page_id IN (
      SELECT id FROM pages WHERE auth.uid() = pages.id
    )
  );
