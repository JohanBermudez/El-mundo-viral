/*
  # Add test article

  1. New Data
    - Add a test article to the 'articles' table
    - Add article category relationship
  
  2. Purpose
    - Provides initial test content for the website
    - Demonstrates dynamic content loading from database
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
  
  -- Create test article
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
    'Fechas de pago: Conoce cuándo recibirás tu próximo subsidio',
    'El gobierno ha anunciado el calendario oficial de pagos para los subsidios sociales del próximo trimestre',
    '{
      "body": "<p>El Ministerio de Desarrollo Social ha publicado el calendario oficial de pagos para los subsidios sociales correspondientes al próximo trimestre. Esta información es crucial para miles de familias que dependen de estas ayudas económicas para cubrir sus necesidades básicas.</p><h2>Calendario de pagos por programa</h2><p>Los beneficiarios podrán recibir sus pagos según el siguiente cronograma:</p><ul><li><strong>Subsidio Familiar:</strong> Primera semana del mes</li><li><strong>Apoyo a Adultos Mayores:</strong> Segunda semana del mes</li><li><strong>Beca Educativa:</strong> Tercera semana del mes</li><li><strong>Asistencia Alimentaria:</strong> Última semana del mes</li></ul><p>Las autoridades recomiendan verificar la fecha exacta según el último dígito del documento de identidad en el portal oficial del ministerio.</p><h2>Nuevos métodos de pago</h2><p>A partir de este trimestre, los beneficiarios podrán elegir entre recibir sus subsidios mediante:</p><ul><li>Depósito directo en cuenta bancaria</li><li>Retiro en cajeros automáticos con código QR</li><li>Cobro en efectivo en puntos autorizados</li></ul><p>Esta diversificación busca facilitar el acceso a los fondos y reducir las aglomeraciones en los puntos de pago tradicionales.</p><h2>Requisitos para mantener el beneficio</h2><p>Es importante recordar que para seguir recibiendo el subsidio, los beneficiarios deben:</p><ul><li>Mantener actualizada su información de contacto</li><li>Cumplir con las corresponsabilidades específicas de cada programa</li><li>Participar en las evaluaciones periódicas cuando sean convocados</li></ul><p>El incumplimiento de estos requisitos podría resultar en la suspensión temporal o definitiva del beneficio.</p>"
    }'::jsonb,
    'https://www.sportlife.com.mx/wp-content/uploads/2022/02/Fechas-de-pago-sport-life.jpg',
    'fechas-pago-subsidios',
    'publicado',
    NOW()
  )
  RETURNING id INTO article_id;
  
  -- Get the 'Subsidios' category ID
  SELECT id INTO category_id FROM categories WHERE slug = 'subsidios' LIMIT 1;
  
  -- If category exists, create the relationship
  IF category_id IS NOT NULL THEN
    INSERT INTO article_categories (article_id, category_id)
    VALUES (article_id, category_id);
  END IF;
END $$;
