// Prueba simple de conexión a Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Configuración de Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Presente (valor oculto)' : 'No encontrado');

async function testConnection() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Faltan variables de entorno para Supabase');
    return;
  }

  try {
    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Probar una consulta simple
    console.log('\nProbando conexión...');
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    
    if (error) {
      console.error('Error en la consulta:', error);
    } else {
      console.log('Conexión exitosa!');
      console.log('Datos recibidos:', data);
    }
  } catch (err) {
    console.error('Error al conectar con Supabase:', err);
  }
}

testConnection();
