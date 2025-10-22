import 'dotenv/config';
import { AppDataSource } from './src/config/data-source';

async function resetDatabase() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    
    console.log('Dropping all tables...');
    await AppDataSource.query('DROP SCHEMA public CASCADE');
    await AppDataSource.query('CREATE SCHEMA public');
    await AppDataSource.query('GRANT ALL ON SCHEMA public TO postgres');
    await AppDataSource.query('GRANT ALL ON SCHEMA public TO public');
    
    console.log('Database reset completed successfully!');
    
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

resetDatabase();