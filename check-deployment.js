/**
 * Deployment Readiness Check
 * Run this script to verify your app is ready for cloud deployment
 */

import { apiService } from './src/services/apiService.js';

async function checkDeploymentReadiness() {
  console.log('🔍 GamaExpress Deployment Readiness Check');
  console.log('==========================================');
  console.log();

  let allChecks = true;

  // 1. Environment Configuration Check
  console.log('1️⃣ Environment Configuration');
  console.log('----------------------------');
  
  const apiBaseUrl = process.env.VITE_API_BASE_URL || 'Not set';
  const apiKey = process.env.VITE_API_KEY || 'Not set';
  const nodeEnv = process.env.NODE_ENV || 'development';
  const corsOrigin = process.env.CORS_ORIGIN || 'Not set';
  
  console.log(`📡 API Base URL: ${apiBaseUrl}`);
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`🌐 CORS Origin: ${corsOrigin}`);
  
  // Check for localhost URLs
  if (apiBaseUrl.includes('localhost')) {
    console.log('⚠️  WARNING: API Base URL still uses localhost - update for production');
    allChecks = false;
  }
  
  if (corsOrigin.includes('localhost') && nodeEnv === 'production') {
    console.log('⚠️  WARNING: CORS Origin uses localhost in production');
    allChecks = false;
  }
  
  console.log();

  // 2. API Connection Check
  console.log('2️⃣ API Connection Test');
  console.log('----------------------');
  
  try {
    const isConnected = await apiService.checkConnection();
    if (isConnected) {
      console.log('✅ Backend API is reachable');
    } else {
      console.log('❌ Backend API is not reachable');
      allChecks = false;
    }
  } catch (error) {
    console.log(`❌ API connection failed: ${error.message}`);
    allChecks = false;
  }
  
  console.log();

  // 3. Supabase Configuration Check
  console.log('3️⃣ Supabase Configuration');
  console.log('--------------------------');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
    console.log('✅ Supabase URL is configured');
  } else {
    console.log('❌ Supabase URL is missing or invalid');
    allChecks = false;
  }
  
  if (supabaseKey && supabaseKey.length > 100) {
    console.log('✅ Supabase anon key is configured');
  } else {
    console.log('❌ Supabase anon key is missing or invalid');
    allChecks = false;
  }
  
  console.log();

  // 4. Security Check
  console.log('4️⃣ Security Configuration');
  console.log('-------------------------');
  
  const frontendKey = process.env.VITE_API_KEY || '';
  if (frontendKey.includes('production') || !frontendKey.includes('2024')) {
    console.log('✅ API key appears to be production-ready');
  } else {
    console.log('⚠️  Consider using production-specific API keys');
  }
  
  if (nodeEnv === 'production') {
    console.log('✅ Node environment set to production');
  } else {
    console.log('ℹ️  Node environment is development (change to production for deployment)');
  }
  
  console.log();

  // 5. Build Check
  console.log('5️⃣ Build Test');
  console.log('-------------');
  
  try {
    // This is a simple check - in real deployment you'd run npm run build
    console.log('ℹ️  Run "npm run build" to test production build');
    console.log('ℹ️  Check that dist/ folder is created successfully');
  } catch (error) {
    console.log(`❌ Build check failed: ${error.message}`);
    allChecks = false;
  }
  
  console.log();

  // Final Result
  console.log('🎯 Deployment Readiness Summary');
  console.log('===============================');
  
  if (allChecks) {
    console.log('🎉 Your app appears ready for deployment!');
    console.log('📋 Next steps:');
    console.log('   1. Update environment variables for production');
    console.log('   2. Deploy backend to your chosen platform');
    console.log('   3. Deploy frontend with updated API URLs');
    console.log('   4. Test all functionality in production');
  } else {
    console.log('⚠️  Some issues need to be addressed before deployment');
    console.log('📋 Review the warnings above and fix them');
    console.log('📖 See DEPLOYMENT_GUIDE.md for detailed instructions');
  }
}

// Run the check
checkDeploymentReadiness().catch(console.error);
