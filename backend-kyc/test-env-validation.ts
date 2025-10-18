import 'dotenv/config';
import { validateEnv } from './src/config/validation.schema';

console.log('Testing environment validation...');

try {
  validateEnv();
  console.log('✅ Environment validation passed!');
  console.log('All required environment variables are present:');
  console.log('- DB_HOST:', process.env.DB_HOST);
  console.log('- DB_PORT:', process.env.DB_PORT);
  console.log('- DB_USERNAME:', process.env.DB_USERNAME);
  console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? '[HIDDEN]' : 'NOT SET');
  console.log('- DB_DATABASE:', process.env.DB_DATABASE);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
} catch (error) {
  console.error('❌ Environment validation failed:', (error as Error).message);
  process.exit(1);
}

console.log('\n🎉 Environment configuration test completed successfully!');