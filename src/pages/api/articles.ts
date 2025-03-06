import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '6');
  const category = url.searchParams.get('category') || null;
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  try {
    let query = supabase
      .from('articles')
      .select(`
        id,
        titulo,
        subtitulo,
        extracto,
        imagen_principal,
        slug,
        created_at,
        article_categories (
          categories (
            nombre,
            slug
          )
        )
      `)
      .eq('estado_publicacion', 'publicado')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    // Filtrar por categoría si se proporciona
    if (category && category !== 'todos') {
      query = query.eq('article_categories.categories.slug', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching articles:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log('API response data:', data);
    
    // Formatear datos para el componente NewsCard
    const articles = (data || []).map(article => ({
      title: article.titulo,
      excerpt: article.extracto || article.subtitulo || '',
      image: article.imagen_principal || 'https://via.placeholder.com/400x300',
      category: article.article_categories?.[0]?.categories?.nombre || 'General',
      categorySlug: article.article_categories?.[0]?.categories?.slug || 'general',
      date: new Date(article.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      url: `/articulo/${article.slug}`
    }));
    
    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Unexpected error in API:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
