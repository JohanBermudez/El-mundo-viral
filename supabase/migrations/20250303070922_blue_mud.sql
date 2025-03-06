/*
  # Create test article about viral video record

  1. New Data
    - Creates a test article about a viral video record
    - Associates the article with the "Virales" category
    - Sets the article status to "publicado" (published)
  
  2. Implementation Details
    - Uses the existing page or creates one if none exists
    - Uses the existing "Virales" category
    - Sets a unique article slug
    - Uses a different image URL to avoid duplication
*/

-- Get the first page ID (or create one if none exists)
DO $$
DECLARE
  page_id uuid;
  article_id uuid;
  category_id uuid;
BEGIN
  -- Get or create a page
  SELECT id INTO page_id FROM pages LIMIT 1;
  
  IF page_id IS NULL THEN
    INSERT INTO pages (nombre, estado, config_publicacion)
    VALUES ('El Mundo Viral', true, '{"auto_publish": true}'::jsonb)
    RETURNING id INTO page_id;
  END IF;
  
  -- Create test article with a different slug
  INSERT INTO articles (
    page_id,
    titulo,
    subtitulo,
    contenido,
    imagen_principal,
    slug,
    estado_publicacion,
    created_at
  )
  VALUES (
    page_id,
    'El video viral que está rompiendo récords en redes sociales',
    'Un joven talentoso sorprende al mundo con su increíble habilidad para resolver cubos Rubik mientras hace malabares',
    '{
      "body": "<p>Un joven de 19 años se ha convertido en la sensación del momento tras publicar un video en el que resuelve tres cubos Rubik mientras hace malabares con ellos, estableciendo un nuevo récord mundial.</p><p>El video, que ya acumula más de 50 millones de reproducciones en TikTok y ha sido compartido por celebridades de todo el mundo, muestra a Miguel Sánchez completando esta hazaña en menos de dos minutos.</p><h2>Un talento extraordinario</h2><p>\"Siempre me gustaron los retos. Comencé a resolver el cubo Rubik a los 8 años y a practicar malabares a los 12. Un día se me ocurrió combinar ambas habilidades\", explica Sánchez en una entrevista exclusiva.</p><p>Lo que comenzó como un pasatiempo se ha convertido en un fenómeno viral que le ha abierto puertas inesperadas. Varias marcas ya se han puesto en contacto con él para ofrecerle contratos publicitarios, y ha sido invitado a programas de televisión internacionales.</p><h2>Inspiración para otros</h2><p>El impacto del video va más allá del entretenimiento. Profesores de matemáticas y ciencias están utilizando el clip para motivar a sus estudiantes y demostrar cómo las habilidades cognitivas pueden desarrollarse de formas creativas.</p><p>\"Ver a alguien de mi edad lograr algo así me hizo darme cuenta de que yo también puedo superar mis límites\", comenta Ana Gómez, una estudiante de secundaria que ha comenzado a practicar con el cubo Rubik inspirada por el video.</p><h2>El fenómeno continúa</h2><p>Sánchez no planea detenerse aquí. Ya está preparando un nuevo reto que, según adelanta, \"llevará esta combinación de habilidades a un nivel completamente nuevo\".</p><p>Mientras tanto, miles de personas en todo el mundo están intentando replicar su hazaña, generando una ola de videos respuesta que mantienen viva la conversación en redes sociales.</p>"
    }'::jsonb,
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
    'video-viral-record',
    'publicado',
    NOW()
  )
  RETURNING id INTO article_id;
  
  -- Get the 'Virales' category ID
  SELECT id INTO category_id FROM categories WHERE slug = 'virales' LIMIT 1;
  
  -- If category exists, create the relationship
  IF category_id IS NOT NULL THEN
    INSERT INTO article_categories (article_id, category_id)
    VALUES (article_id, category_id);
  END IF;
END $$;
