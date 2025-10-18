import { validateEnv } from './src/config/validation.schema';

console.log('Testing environment validation with missing variables...');

// Temporarily remove some environment variables
const originalDbHost = process.env.DB_HOST;
const originalNodeEnv = process.env.NODE_ENV;

delete process.env.DB_HOST;
delete process.env.NODE_ENV;

try {
  validateEnv();
  console.log('❌ Test failed: Validation should have caught missing variables!');
  process.exit(1);
} catch (error) {
  console.log('✅ Test passed: Validation correctly caught missing variables');
  console.log('Error message:', (error as Error).message);
}

// Restore environment variables
process.env.DB_HOST = originalDbHost;
process.env.NODE_ENV = originalNodeEnv;

console.log('\n🎉 Missing environment variables test completed successfully!');