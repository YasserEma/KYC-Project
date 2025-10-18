import { DataSource } from 'typeorm';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
});

async function verifyDatabaseSchema() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // List all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tables = await dataSource.query(tablesQuery);
    console.log('\n📋 Tables in database:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });

    // Expected tables from database.md
    const expectedTables = [
      'subscribers',
      'subscriber_users',
      'logs',
      'entities',
      'individual_entities',
      'organization_entities',
      'entity_history',
      'entity_custom_fields',
      'individual_relationships',
      'organization_relationships',
      'organization_associations',
      'documents',
      'screening_analysis',
      'risk_analysis',
      'screening_configuration',
      'screening_config_values',
      'risk_configuration',
      'lists_management',
      'list_values',
      'migrations'
    ];

    console.log('\n🔍 Verifying expected tables:');
    const existingTableNames = tables.map((t: any) => t.table_name);
    
    let allTablesExist = true;
    expectedTables.forEach(tableName => {
      if (existingTableNames.includes(tableName)) {
        console.log(`  ✅ ${tableName}`);
      } else {
        console.log(`  ❌ ${tableName} - MISSING`);
        allTablesExist = false;
      }
    });

    if (allTablesExist) {
      console.log('\n🎉 All expected tables exist in the database!');
    } else {
      console.log('\n⚠️  Some expected tables are missing.');
    }

    // Check foreign key constraints
    const constraintsQuery = `
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name;
    `;

    const constraints = await dataSource.query(constraintsQuery);
    console.log(`\n🔗 Foreign key constraints found: ${constraints.length}`);
    
    // Group constraints by table
    const constraintsByTable: { [key: string]: any[] } = {};
    constraints.forEach((constraint: any) => {
      if (!constraintsByTable[constraint.table_name]) {
        constraintsByTable[constraint.table_name] = [];
      }
      constraintsByTable[constraint.table_name].push(constraint);
    });

    Object.keys(constraintsByTable).forEach(tableName => {
      console.log(`\n  📋 ${tableName}:`);
      constraintsByTable[tableName].forEach(constraint => {
        console.log(`    - ${constraint.column_name} → ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
      });
    });

    await dataSource.destroy();
    console.log('\n✅ Database verification completed successfully');

  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  }
}

verifyDatabaseSchema();