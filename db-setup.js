import { supabase } from './src/supaBase/supabaseBackend.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Database Setup and Management Tool
 * Simple alternative to CSV uploader for managing vehicle data
 */

console.log('🚗 GamaExpress Database Setup Tool');
console.log('=====================================');

async function checkDatabaseSetup() {
  console.log('🔍 Checking database setup...');
  
  try {
    // Check if models table exists
    const { data, error } = await supabase.from('models').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ Models table does not exist');
        console.log('📝 To create the table, you can:');
        console.log('   1. Go to your Supabase dashboard');
        console.log('   2. Create a table called "models" with these columns:');
        console.log('      - id (int8, primary key, auto-increment)');
        console.log('      - manufacturer (text)');
        console.log('      - model (text)');
        console.log('      - search_code (text)');
        console.log('      - start_year (text)');
        console.log('      - end_year (text)');
        console.log('      - variant (text)');
        console.log('      - code (text)');
        console.log('      - image_path (text)');
        console.log('      - created_at (timestamp, default: now())');
        console.log('   3. Or run: npm run db:create-table');
        return false;
      } else {
        console.log('❌ Database error:', error.message);
        return false;
      }
    } else {
      console.log('✅ Models table exists');
      
      // Get count of records
      const { count } = await supabase
        .from('models')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Total records: ${count || 0}`);
      
      if (count > 0) {
        // Show sample data
        const { data: sampleData } = await supabase
          .from('models')
          .select('manufacturer, model, start_year, end_year')
          .limit(5);
        
        console.log('📋 Sample data:');
        sampleData.forEach(item => {
          console.log(`   ${item.manufacturer} ${item.model} (${item.start_year}-${item.end_year})`);
        });
      }
      
      return true;
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return false;
  }
}

async function createTable() {
  console.log('🔧 Creating models table...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS models (
      id BIGSERIAL PRIMARY KEY,
      manufacturer TEXT,
      model TEXT,
      search_code TEXT,
      start_year TEXT,
      end_year TEXT,
      variant TEXT,
      code TEXT,
      image_path TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_models_manufacturer ON models(manufacturer);
    CREATE INDEX IF NOT EXISTS idx_models_model ON models(model);
    CREATE INDEX IF NOT EXISTS idx_models_year ON models(start_year, end_year);
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.log('❌ Error creating table:', error.message);
      console.log('💡 Please create the table manually in Supabase dashboard');
    } else {
      console.log('✅ Table created successfully');
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
    console.log('💡 Please create the table manually in Supabase dashboard');
  }
}

async function listAvailableCSVs() {
  console.log('📁 Available CSV files:');
  
  try {
    const csvDir = './CVS';
    const files = await fs.readdir(csvDir);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      console.log('   No CSV files found in CVS directory');
    } else {
      csvFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
      console.log(`\n💡 To import data, you can use Supabase dashboard's import feature`);
      console.log(`   or implement a custom import script as needed.`);
    }
  } catch (err) {
    console.log('   Could not read CVS directory');
  }
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'check':
  case undefined:
    await checkDatabaseSetup();
    await listAvailableCSVs();
    break;
    
  case 'create-table':
    await createTable();
    break;
    
  case 'list-csv':
    await listAvailableCSVs();
    break;
    
  default:
    console.log('Usage:');
    console.log('  node db-setup.js [command]');
    console.log('');
    console.log('Commands:');
    console.log('  check       Check database setup (default)');
    console.log('  create-table Create models table');
    console.log('  list-csv    List available CSV files');
}

console.log('\n🏁 Setup check completed');
