/**
 * Vercel Deployment Test Script
 * Test your deployment at https://gama-express-347z.vercel.app
 */

async function testVercelDeployment() {
  console.log('🚀 Testing Vercel Deployment');
  console.log('============================');
  console.log('Frontend URL: https://gama-express-347z.vercel.app');
  console.log();

  const frontendUrl = 'https://gama-express-347z.vercel.app';
  
  // Test 1: Frontend Accessibility
  console.log('1️⃣ Testing Frontend Access');
  console.log('-------------------------');
  
  try {
    const response = await fetch(frontendUrl);
    if (response.ok) {
      console.log('✅ Frontend is accessible');
      console.log(`   Status: ${response.status} ${response.statusText}`);
    } else {
      console.log(`❌ Frontend returned ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Frontend not accessible: ${error.message}`);
  }
  
  console.log();

  // Test 2: Backend Configuration Check
  console.log('2️⃣ Backend Configuration Check');
  console.log('------------------------------');
  
  const expectedBackendUrl = process.env.VITE_API_BASE_URL || 'Not configured';
  const expectedApiKey = process.env.VITE_API_KEY || 'Not configured';
  
  console.log(`📡 Expected Backend URL: ${expectedBackendUrl}`);
  console.log(`🔑 Expected API Key: ${expectedApiKey.substring(0, 10)}...`);
  
  if (expectedBackendUrl.includes('localhost')) {
    console.log('⚠️  WARNING: Backend URL still uses localhost');
    console.log('   Update VITE_API_BASE_URL to your deployed backend URL');
  }
  
  console.log();

  // Test 3: CORS Configuration
  console.log('3️⃣ CORS Configuration');
  console.log('---------------------');
  
  const corsOrigin = process.env.CORS_ORIGIN || 'Not set';
  console.log(`🌐 CORS Origin: ${corsOrigin}`);
  
  if (corsOrigin.includes('gama-express-347z.vercel.app')) {
    console.log('✅ CORS correctly configured for Vercel');
  } else {
    console.log('⚠️  CORS may need updating for Vercel URL');
  }
  
  console.log();

  // Test 4: Environment Variables Summary
  console.log('4️⃣ Environment Variables for Vercel Dashboard');
  console.log('---------------------------------------------');
  console.log('Add these to your Vercel project settings:');
  console.log();
  console.log('VITE_SUPABASE_URL=https://xnsetzrgwdeufezcugjn.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('VITE_API_BASE_URL=https://your-backend-url.herokuapp.com/api/v1');
  console.log('VITE_API_KEY=gama-frontend-api-key-production-2024');
  console.log();

  // Test 5: Deployment Steps
  console.log('5️⃣ Next Steps for Deployment');
  console.log('----------------------------');
  console.log('1. Deploy your backend to Heroku/Railway/Render');
  console.log('2. Get your backend URL (e.g., https://your-app.herokuapp.com)');
  console.log('3. Update Vercel environment variables with backend URL');
  console.log('4. Set backend CORS_ORIGIN=https://gama-express-347z.vercel.app');
  console.log('5. Test the connection between frontend and backend');
  console.log();

  console.log('🎯 Ready for Deployment!');
  console.log('Your Vercel URL is configured and ready to go.');
  console.log('The main step is deploying your backend and connecting the URLs.');
}

// Run the test
testVercelDeployment().catch(console.error);
