import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Use application context (non-HTTP) to avoid platform dependencies
  const appContext = await NestFactory.createApplicationContext(AppModule);
  console.log('KYC/KYB database setup application context started');
  // Keep the context alive for dev process; press Ctrl+C to exit
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap application:', err);
  process.exit(1);
});