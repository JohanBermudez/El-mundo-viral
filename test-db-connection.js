// Script para probar la conexión a Supabase
import { getCategories, getFeaturedArticle, getLatestArticles } from './src/lib/supabase.js';

async function testDatabaseConnection() {
  console.log('Iniciando pruebas de conexión a Supabase...');
  
  try {
    // Prueba 1: Obtener categorías
    console.log('\n--- Prueba 1: Obtener categorías ---');
    const categories = await getCategories();
    console.log('Categorías obtenidas:', categories.length);
    console.log('Primeras 3 categorías:', categories.slice(0, 3));
    
    // Prueba 2: Obtener artículo destacado
    console.log('\n--- Prueba 2: Obtener artículo destacado ---');
    const featuredArticle = await getFeaturedArticle();
    console.log('Artículo destacado:', featuredArticle ? 'Obtenido correctamente' : 'No encontrado');
    if (featuredArticle) {
      console.log('Título:', featuredArticle.title);
      console.log('Categoría:', featuredArticle.category);
    }
    
    // Prueba 3: Obtener últimos artículos
    console.log('\n--- Prueba 3: Obtener últimos artículos ---');
    const latestArticles = await getLatestArticles(3);
    console.log('Artículos recientes obtenidos:', latestArticles.length);
    if (latestArticles.length > 0) {
      console.log('Primer artículo:', {
        título: latestArticles[0].title,
        categoría: latestArticles[0].category,
        url: latestArticles[0].url
      });
    }
    
    console.log('\n✅ Todas las pruebas completadas. La conexión a Supabase parece estar funcionando correctamente.');
  } catch (error) {
    console.error('\n❌ Error durante las pruebas de conexión:', error);
    console.error('Verifica las credenciales de Supabase en el archivo .env');
  }
}

testDatabaseConnection();
