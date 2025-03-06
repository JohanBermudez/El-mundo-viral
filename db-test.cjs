// Prueba final de conexión a Supabase con CommonJS
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Obtener variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Configuración de Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Presente (primeros 10 caracteres: ' + supabaseAnonKey.substring(0, 10) + '...)' : 'No encontrado');

async function testConnection() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Faltan variables de entorno para Supabase');
    return;
  }

  try {
    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Probar una consulta simple
    console.log('\nProbando conexión a la base de datos...');
    const { data, error } = await supabase.from('categories').select('*').limit(5);
    
    if (error) {
      console.error('❌ Error en la consulta:', error);
    } else {
      console.log('✅ Conexión exitosa!');
      console.log('Categorías encontradas:', data.length);
      console.log('Datos recibidos:', data);
      
      // Probar otra tabla
      console.log('\nProbando consulta a la tabla articles...');
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, titulo, slug')
        .limit(3);
        
      if (articlesError) {
        console.error('❌ Error al consultar artículos:', articlesError);
      } else {
        console.log('✅ Consulta de artículos exitosa!');
        console.log('Artículos encontrados:', articles.length);
        console.log('Datos recibidos:', articles);
      }
    }
  } catch (err) {
    console.error('❌ Error al conectar con Supabase:', err);
  }
}

testConnection();
