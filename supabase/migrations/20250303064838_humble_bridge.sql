/*
  # Seed initial data

  1. Insert initial categories
  2. Insert a default page
*/

-- Insert initial categories
INSERT INTO categories (nombre, slug, descripcion)
VALUES 
  ('Todos', 'todos', 'Todas las categorías'),
  ('Virales', 'virales', 'Contenido viral y tendencias en redes sociales'),
  ('Tendencias', 'tendencias', 'Tendencias actuales y temas populares'),
  ('Subsidios', 'subsidios', 'Información sobre subsidios y ayudas gubernamentales'),
  ('Entretenimiento', 'entretenimiento', 'Noticias de entretenimiento, cine, música y cultura')
ON CONFLICT (slug) DO NOTHING;

-- Insert a default page if none exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pages LIMIT 1) THEN
    INSERT INTO pages (nombre, estado, config_publicacion)
    VALUES ('El Mundo Viral', true, '{"auto_publish": false}'::jsonb);
  END IF;
END $$;
