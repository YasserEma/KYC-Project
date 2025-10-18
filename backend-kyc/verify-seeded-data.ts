import { AppDataSource } from './src/config/data-source';

async function verifySeededData() {
  try {
    console.log('🔍 Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('\n📊 Verifying seeded data integrity...\n');
    
    // Check basic table counts
    console.log('=== TABLE COUNTS ===');
    const tables = [
      'subscribers',
      'subscriber_users', 
      'screening_configuration',
      'lists_management',
      'list_values',
      'screening_config_values',
      'risk_configuration',
      'entities',
      'individual_entities',
      'organization_entities',
      'documents',
      'screening_analysis',
      'logs'
    ];
    
    for (const table of tables) {
      try {
        const result = await AppDataSource.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table.padEnd(25)}: ${result[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table.padEnd(25)}: Error - ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    console.log('\n=== FOREIGN KEY RELATIONSHIPS ===');
    
    // Check subscriber_users -> subscribers relationship
    try {
      const orphanedUsers = await AppDataSource.query(`
        SELECT COUNT(*) as count 
        FROM subscriber_users su 
        LEFT JOIN subscribers s ON su.subscriber_id = s.id 
        WHERE s.id IS NULL
      `);
      console.log(`✅ Orphaned subscriber_users: ${orphanedUsers[0].count}`);
    } catch (error) {
      console.log(`❌ subscriber_users relationship check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check entities -> subscribers relationship
    try {
      const orphanedEntities = await AppDataSource.query(`
        SELECT COUNT(*) as count 
        FROM entities e 
        LEFT JOIN subscribers s ON e.subscriber_id = s.id 
        WHERE s.id IS NULL
      `);
      console.log(`✅ Orphaned entities: ${orphanedEntities[0].count}`);
    } catch (error) {
      console.log(`❌ entities relationship check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check individual_entities -> entities relationship
    try {
      const orphanedIndividuals = await AppDataSource.query(`
        SELECT COUNT(*) as count 
        FROM individual_entities ie 
        LEFT JOIN entities e ON ie.entity_id = e.id 
        WHERE e.id IS NULL
      `);
      console.log(`✅ Orphaned individual_entities: ${orphanedIndividuals[0].count}`);
    } catch (error) {
      console.log(`❌ individual_entities relationship check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check organization_entities -> entities relationship
    try {
      const orphanedOrganizations = await AppDataSource.query(`
        SELECT COUNT(*) as count 
        FROM organization_entities oe 
        LEFT JOIN entities e ON oe.entity_id = e.id 
        WHERE e.id IS NULL
      `);
      console.log(`✅ Orphaned organization_entities: ${orphanedOrganizations[0].count}`);
    } catch (error) {
      console.log(`❌ organization_entities relationship check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check documents -> entities relationship
    try {
      const orphanedDocuments = await AppDataSource.query(`
        SELECT COUNT(*) as count 
        FROM documents d 
        LEFT JOIN entities e ON d.entity_id = e.id 
        WHERE e.id IS NULL
      `);
      console.log(`✅ Orphaned documents: ${orphanedDocuments[0].count}`);
    } catch (error) {
      console.log(`❌ documents relationship check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check screening_analysis -> entities relationship
    try {
      const orphanedScreenings = await AppDataSource.query(`
        SELECT COUNT(*) as count 
        FROM screening_analysis sa 
        LEFT JOIN entities e ON sa.entity_id = e.id 
        WHERE e.id IS NULL
      `);
      console.log(`✅ Orphaned screening_analysis: ${orphanedScreenings[0].count}`);
    } catch (error) {
      console.log(`❌ screening_analysis relationship check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Check logs -> subscribers relationship
    try {
      const orphanedLogs = await AppDataSource.query(`
        SELECT COUNT(*) as count 
        FROM logs l 
        LEFT JOIN subscribers s ON l.subscriber_id = s.id 
        WHERE s.id IS NULL
      `);
      console.log(`✅ Orphaned logs: ${orphanedLogs[0].count}`);
    } catch (error) {
      console.log(`❌ logs relationship check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('\n=== DATA CONSISTENCY CHECKS ===');
    
    // Check entity type consistency
    try {
      const entityTypeConsistency = await AppDataSource.query(`
        SELECT 
          e.entity_type,
          COUNT(CASE WHEN ie.entity_id IS NOT NULL THEN 1 END) as individual_count,
          COUNT(CASE WHEN oe.entity_id IS NOT NULL THEN 1 END) as organization_count
        FROM entities e
        LEFT JOIN individual_entities ie ON e.id = ie.entity_id
        LEFT JOIN organization_entities oe ON e.id = oe.entity_id
        GROUP BY e.entity_type
      `);
      
      console.log('Entity type consistency:');
      for (const row of entityTypeConsistency) {
        const isConsistent = 
          (row.entity_type === 'individual' && parseInt(row.individual_count) > 0 && parseInt(row.organization_count) === 0) ||
          (row.entity_type === 'organization' && parseInt(row.organization_count) > 0 && parseInt(row.individual_count) === 0);
        
        console.log(`  ${row.entity_type}: ${isConsistent ? '✅' : '❌'} (Individual: ${row.individual_count}, Organization: ${row.organization_count})`);
      }
    } catch (error) {
      console.log(`❌ Entity type consistency check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('\n=== SAMPLE DATA VERIFICATION ===');
    
    // Show sample entities with their details
    try {
      const sampleEntities = await AppDataSource.query(`
        SELECT 
          e.id,
          e.entity_type,
          e.name,
          e.status,
          CASE 
            WHEN ie.entity_id IS NOT NULL THEN CONCAT('Individual - DOB: ', ie.date_of_birth)
            WHEN oe.entity_id IS NOT NULL THEN CONCAT('Organization - ', oe.legal_name)
            ELSE 'No details'
          END as detailed_name
        FROM entities e
        LEFT JOIN individual_entities ie ON e.id = ie.entity_id
        LEFT JOIN organization_entities oe ON e.id = oe.entity_id
        LIMIT 5
      `);
      
      console.log('Sample entities:');
      for (const entity of sampleEntities) {
        console.log(`  ${entity.entity_type}: ${entity.name} (${entity.detailed_name}) - Status: ${entity.status}`);
      }
    } catch (error) {
      console.log(`❌ Sample data verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('\n✅ Data integrity verification completed!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the verification
verifySeededData();