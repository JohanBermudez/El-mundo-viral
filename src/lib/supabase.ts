import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Crear cliente de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Variables de entorno de Supabase no definidas correctamente');
}

// Configuración de cookies para persistencia de sesión
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

export const supabase = createClient<Database>(
  supabaseUrl || 'https://hswictajbxtljrrourcu.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzd2ljdGFqYnh0bGpycm91cmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODM2MTIsImV4cCI6MjA1NjU1OTYxMn0.nC_65sRidR3zMuhUML16HFGNikoWiObjRbPNIXNi4Vw',
  supabaseOptions
);

// Función para obtener categorías
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('nombre');
    
  if (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
  
  return data || [];
}

// Función para obtener artículo destacado
export async function getFeaturedArticle() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('destacado', true)
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error al obtener artículo destacado:', error);
    return null;
  }
  
  // Formatear datos para el componente FeaturedNews
  if (data) {
    return {
      title: data.titulo,
      excerpt: data.extracto || '',
      image: data.imagen_url || 'https://via.placeholder.com/800x400',
      category: data.categoria || 'General',
      categorySlug: data.categoria_slug || 'general',
      date: new Date(data.fecha_publicacion).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      url: `/articulo/${data.slug}`
    };
  }
  
  return null;
}

// Función para obtener últimos artículos
export async function getLatestArticles(limit = 6, page = 1) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('fecha_publicacion', { ascending: false })
    .range(from, to);
    
  if (error) {
    console.error('Error al obtener artículos recientes:', error);
    return [];
  }
  
  // Formatear datos para el componente NewsCard
  return (data || []).map(article => ({
    title: article.titulo,
    excerpt: article.extracto || '',
    image: article.imagen_url || 'https://via.placeholder.com/400x300',
    category: article.categoria || 'General',
    categorySlug: article.categoria_slug || 'general',
    date: new Date(article.fecha_publicacion).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    url: `/articulo/${article.slug}`
  }));
}

// Función para obtener artículos por categoría
export async function getArticlesByCategory(category: string, limit = 6, page = 1) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('categoria_slug', category)
    .order('fecha_publicacion', { ascending: false })
    .range(from, to);
    
  if (error) {
    console.error(`Error al obtener artículos de la categoría ${category}:`, error);
    return [];
  }
  
  // Formatear datos para el componente NewsCard
  return (data || []).map(article => ({
    title: article.titulo,
    excerpt: article.extracto || '',
    image: article.imagen_url || 'https://via.placeholder.com/400x300',
    category: article.categoria || 'General',
    categorySlug: article.categoria_slug || 'general',
    date: new Date(article.fecha_publicacion).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    url: `/articulo/${article.slug}`
  }));
}

// Función para obtener artículo por slug
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error al obtener artículo con slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

// Autenticación
export async function signIn(email: string, password: string) {
  console.log('Intentando iniciar sesión con:', { email });
  
  const response = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  console.log('Respuesta completa de inicio de sesión:', JSON.stringify(response));
  
  if (response.error) {
    console.error('Error de autenticación:', response.error);
  } else if (response.data.session) {
    console.log('Sesión creada correctamente:', response.data.session.user.email);
  }
  
  return response;
}

export async function signOut() {
  return await supabase.auth.signOut();
}

// Esta función es segura para usar tanto en el cliente como en el servidor
export async function getSession() {
  const response = await supabase.auth.getSession();
  console.log('Sesión actual:', JSON.stringify(response));
  
  return response;
}

export async function createUser(email: string, password: string) {
  console.log('Intentando crear usuario:', { email });
  
  const response = await supabase.auth.signUp({
    email,
    password
  });
  
  console.log('Respuesta de creación de usuario:', JSON.stringify(response));
  
  return response;
}

// Funciones específicas para el cliente (solo usar en archivos .js o en bloques <script>)
export const clientAuth = {
  // Guardar token en localStorage (solo para cliente)
  saveSession: (session: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase.auth.token', session.access_token);
      localStorage.setItem('supabase.auth.refresh', session.refresh_token || '');
      localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
    }
  },
  
  // Recuperar token de localStorage (solo para cliente)
  getStoredToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('supabase.auth.token');
    }
    return null;
  },
  
  // Eliminar token de localStorage (solo para cliente)
  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refresh');
      localStorage.removeItem('supabase.auth.user');
    }
  },
  
  // Restaurar sesión desde localStorage (solo para cliente)
  restoreSession: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('supabase.auth.token');
      const refresh = localStorage.getItem('supabase.auth.refresh');
      
      if (token) {
        console.log('Restaurando sesión desde localStorage');
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh || ''
          });
          
          if (error) {
            console.error('Error al restaurar sesión:', error);
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('supabase.auth.refresh');
            localStorage.removeItem('supabase.auth.user');
            return false;
          }
          
          console.log('Sesión restaurada correctamente:', data.session);
          return !!data.session;
        } catch (error) {
          console.error('Error al restaurar sesión:', error);
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('supabase.auth.refresh');
          localStorage.removeItem('supabase.auth.user');
        }
      }
    }
    return false;
  },
  
  // Verificar si hay una sesión activa (solo para cliente)
  isAuthenticated: async () => {
    if (typeof window !== 'undefined') {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    }
    return false;
  }
};
