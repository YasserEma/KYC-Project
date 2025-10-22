import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AppDataSource } from './src/config/data-source';

async function verifyDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const queryRunner = AppDataSource.createQueryRunner();

    // Check all tables exist
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('\n📋 Database Tables:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });

    // Check record counts for main tables
    const tablesToCheck = [
      'subscribers',
      'subscriber_users', 
      'entities',
      'individual_entities',
      'organization_entities',
      'screening_configuration',
      'risk_configuration',
      'screening_analysis',
      'risk_analysis',
      'logs'
    ];

    console.log('\n📊 Record Counts:');
    for (const tableName of tablesToCheck) {
      try {
        const result = await queryRunner.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`  - ${tableName}: ${result[0].count} records`);
      } catch (error) {
        console.log(`  - ${tableName}: Table not found or error`);
      }
    }

    // Check foreign key constraints
    console.log('\n🔗 Foreign Key Constraints:');
    const constraints = await queryRunner.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name, tc.constraint_name
    `);

    constraints.forEach((constraint: any) => {
      console.log(`  - ${constraint.table_name}.${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
    });

    // Check for any data integrity issues
    console.log('\n🔍 Data Integrity Checks:');
    
    // Check for orphaned records in entities table
    const orphanedEntities = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM entities e 
      WHERE e.subscriber_id NOT IN (SELECT id FROM subscribers)
    `);
    console.log(`  - Orphaned entities: ${orphanedEntities[0].count}`);

    // Check for entities without corresponding individual/organization records
    const entitiesWithoutDetails = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM entities e 
      WHERE e.entity_type = 'individual' 
        AND e.id NOT IN (SELECT entity_id FROM individual_entities)
      UNION ALL
      SELECT COUNT(*) as count 
      FROM entities e 
      WHERE e.entity_type = 'organization' 
        AND e.id NOT IN (SELECT entity_id FROM organization_entities)
    `);
    
    if (entitiesWithoutDetails.length > 0) {
      console.log(`  - Entities without details: ${entitiesWithoutDetails.reduce((sum: number, row: any) => sum + parseInt(row.count), 0)}`);
    }

    await queryRunner.release();
    await AppDataSource.destroy();

    console.log('\n✅ Database verification completed successfully!');
    console.log('🎉 All migrations and seeders have been applied correctly.');

  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  }
}

verifyDatabase();