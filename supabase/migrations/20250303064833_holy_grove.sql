/*
  # Create Article Categories junction table

  1. New Tables
    - `article_categories`
      - `id` (uuid, primary key)
      - `article_id` (uuid, foreign key to articles)
      - `category_id` (uuid, foreign key to categories)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `article_categories` table
    - Add policy for everyone to read article categories
    - Add policy for authenticated users to insert/update article categories
*/

CREATE TABLE IF NOT EXISTS article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, category_id)
);

CREATE INDEX article_categories_article_id_idx ON article_categories(article_id);
CREATE INDEX article_categories_category_id_idx ON article_categories(category_id);

ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article categories are viewable by everyone"
  ON article_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert article categories"
  ON article_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    article_id IN (
      SELECT a.id FROM articles a
      JOIN pages p ON a.page_id = p.id
      WHERE auth.uid() = p.id
    )
  );

CREATE POLICY "Authenticated users can update article categories"
  ON article_categories
  FOR UPDATE
  TO authenticated
  USING (
    article_id IN (
      SELECT a.id FROM articles a
      JOIN pages p ON a.page_id = p.id
      WHERE auth.uid() = p.id
    )
  );
