import { VehicleService } from './src/services/vehicleService.js';

console.log('🧪 Testing Vehicle Service...');

const vehicleService = new VehicleService();

try {
  console.log('🏭 Testing getManufacturers...');
  const manufacturers = await vehicleService.getManufacturers();
  console.log(`✅ Found ${manufacturers.length} manufacturers`);
  console.log('First 3 manufacturers:', manufacturers.slice(0, 3));

  console.log('🔍 Testing search...');
  const searchResults = await vehicleService.searchVehicles({ 
    query: 'golf', 
    limit: 5 
  });
  console.log(`✅ Found ${searchResults.pagination.totalItems} vehicles matching 'golf'`);
  console.log('First result:', searchResults.data[0]);

  console.log('📊 Testing getStats...');
  const stats = await vehicleService.getStats();
  console.log('✅ Stats:', JSON.stringify(stats, null, 2));

  console.log('🎉 All tests passed!');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
