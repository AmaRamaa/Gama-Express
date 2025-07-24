import { supabase } from './src/supaBase/supabaseBackend.js';

console.log('🔍 Testing Supabase connection...');

async function testConnection() {
  try {
    // Test connection with a simple query
    const { data, error } = await supabase.from('Models').select('*').limit(3);
    
    if (error) {
      console.log('❌ Database error:', error.message);
      console.log('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Sample data:');
      console.log(JSON.stringify(data, null, 2));
      console.log(`📈 Found ${data.length} records`);
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
  
  console.log('🏁 Test completed');
}

testConnection();
