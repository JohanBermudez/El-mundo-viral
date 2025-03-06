// Script para probar la conexión a Supabase (versión CommonJS)
require('dotenv').config();

// Necesitamos instalar las dependencias primero
async function runTests() {
  try {
    // Importamos dinámicamente para evitar problemas con ESM
    const { createClient } = require('@supabase/supabase-js');
    
    // Crear cliente de Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Error: Variables de entorno de Supabase no encontradas.');
      console.log('Valores actuales:');
      console.log('VITE_SUPABASE_URL:', supabaseUrl);
      console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Presente (valor oculto)' : 'No encontrado');
      return;
    }
    
    console.log('Iniciando pruebas de conexión a Supabase...');
    console.log('URL de Supabase:', supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Prueba 1: Obtener categorías
    console.log('\n--- Prueba 1: Obtener categorías ---');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('nombre');
      
    if (categoriesError) {
      console.error('❌ Error al obtener categorías:', categoriesError);
    } else {
      console.log('✅ Categorías obtenidas:', categories.length);
      console.log('Primeras 3 categorías:', categories.slice(0, 3));
    }
    
    // Prueba 2: Obtener artículos
    console.log('\n--- Prueba 2: Obtener artículos ---');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .limit(3);
      
    if (articlesError) {
      console.error('❌ Error al obtener artículos:', articlesError);
    } else {
      console.log('✅ Artículos obtenidos:', articles.length);
      if (articles.length > 0) {
        console.log('Primer artículo:', {
          id: articles[0].id,
          título: articles[0].titulo,
          slug: articles[0].slug
        });
      }
    }
    
    console.log('\nResumen de pruebas:');
    if (!categoriesError && !articlesError) {
      console.log('✅ Todas las pruebas completadas. La conexión a Supabase está funcionando correctamente.');
    } else {
      console.log('❌ Algunas pruebas fallaron. Verifica la configuración de Supabase.');
    }
    
  } catch (error) {
    console.error('\n❌ Error durante las pruebas de conexión:', error);
    console.error('Verifica las credenciales de Supabase en el archivo .env');
  }
}

// Instalar dependencias y ejecutar pruebas
const { execSync } = require('child_process');
console.log('Instalando dependencias necesarias...');
try {
  execSync('npm install @supabase/supabase-js dotenv --no-save', { stdio: 'inherit' });
  runTests();
} catch (error) {
  console.error('Error al instalar dependencias:', error);
}
