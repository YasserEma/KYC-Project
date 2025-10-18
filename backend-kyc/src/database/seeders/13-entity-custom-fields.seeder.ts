import { DataSource } from 'typeorm';

export async function seedEntityCustomFields(dataSource: DataSource): Promise<void> {
  console.log('🔄 Seeding entity custom fields...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Check if custom fields already exist
    const existingFields = await queryRunner.query('SELECT COUNT(*) as count FROM entity_custom_fields');
    if (parseInt(existingFields[0].count) > 0) {
      console.log('📋 Entity custom fields already exist, skipping seeding');
      return;
    }

    // Get existing entities and users
    const entities = await queryRunner.query('SELECT id, entity_type FROM entities');
    const users = await queryRunner.query('SELECT id FROM subscriber_users');

    if (entities.length === 0 || users.length === 0) {
      console.log('⚠️ No entities or users found, skipping custom fields seeding');
      return;
    }

    // Define custom field templates based on entity type and category
    const individualFields = [
      // COMPLIANCE category
      { key: 'annual_income', type: 'NUMBER', category: 'COMPLIANCE', sensitive: true, sampleValues: ['50000', '75000', '100000', '150000', '200000'] },
      { key: 'source_of_wealth', type: 'TEXT', category: 'COMPLIANCE', sensitive: false, sampleValues: ['Employment', 'Business ownership', 'Inheritance', 'Investment returns', 'Real estate'] },
      { key: 'investment_experience', type: 'TEXT', category: 'COMPLIANCE', sensitive: false, sampleValues: ['Beginner', 'Intermediate', 'Advanced', 'Professional'] },
      { key: 'risk_tolerance', type: 'TEXT', category: 'COMPLIANCE', sensitive: false, sampleValues: ['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'] },
      
      // FINANCIAL category
      { key: 'net_worth', type: 'NUMBER', category: 'FINANCIAL', sensitive: true, sampleValues: ['100000', '250000', '500000', '1000000', '2500000'] },
      { key: 'monthly_income', type: 'NUMBER', category: 'FINANCIAL', sensitive: true, sampleValues: ['3000', '5000', '8000', '12000', '20000'] },
      { key: 'employment_status', type: 'TEXT', category: 'FINANCIAL', sensitive: false, sampleValues: ['Employed', 'Self-employed', 'Unemployed', 'Retired', 'Student'] },
      
      // PERSONAL category
      { key: 'preferred_language', type: 'TEXT', category: 'PERSONAL', sensitive: false, sampleValues: ['English', 'Spanish', 'French', 'German', 'Chinese'] },
      { key: 'communication_preference', type: 'TEXT', category: 'PERSONAL', sensitive: false, sampleValues: ['Email', 'Phone', 'SMS', 'Mail'] },
      { key: 'marketing_consent', type: 'BOOLEAN', category: 'PERSONAL', sensitive: false, sampleValues: ['true', 'false'] },
      
      // REGULATORY category
      { key: 'tax_residency', type: 'TEXT', category: 'REGULATORY', sensitive: true, sampleValues: ['US', 'UK', 'CA', 'DE', 'FR', 'AU'] },
      { key: 'fatca_status', type: 'BOOLEAN', category: 'REGULATORY', sensitive: true, sampleValues: ['true', 'false'] },
      { key: 'crs_reportable', type: 'BOOLEAN', category: 'REGULATORY', sensitive: true, sampleValues: ['true', 'false'] }
    ];

    const organizationFields = [
      // BUSINESS category
      { key: 'business_model', type: 'TEXT', category: 'BUSINESS', sensitive: false, sampleValues: ['B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS'] },
      { key: 'target_market', type: 'TEXT', category: 'BUSINESS', sensitive: false, sampleValues: ['Local', 'National', 'International', 'Global'] },
      { key: 'customer_base_size', type: 'NUMBER', category: 'BUSINESS', sensitive: false, sampleValues: ['100', '1000', '10000', '100000', '1000000'] },
      
      // FINANCIAL category
      { key: 'annual_turnover', type: 'NUMBER', category: 'FINANCIAL', sensitive: true, sampleValues: ['500000', '1000000', '5000000', '10000000', '50000000'] },
      { key: 'profit_margin', type: 'NUMBER', category: 'FINANCIAL', sensitive: true, sampleValues: ['5', '10', '15', '20', '25'] },
      { key: 'funding_sources', type: 'JSON', category: 'FINANCIAL', sensitive: true, sampleValues: ['["Self-funded"]', '["Angel investors"]', '["Venture capital"]', '["Bank loans", "Self-funded"]'] },
      
      // COMPLIANCE category
      { key: 'regulatory_licenses', type: 'JSON', category: 'COMPLIANCE', sensitive: false, sampleValues: ['["Banking license"]', '["Insurance license"]', '["Investment license"]', '["None"]'] },
      { key: 'compliance_officer', type: 'TEXT', category: 'COMPLIANCE', sensitive: false, sampleValues: ['John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Wilson'] },
      { key: 'audit_frequency', type: 'TEXT', category: 'COMPLIANCE', sensitive: false, sampleValues: ['Annual', 'Bi-annual', 'Quarterly', 'Monthly'] },
      
      // REGULATORY category
      { key: 'tax_jurisdiction', type: 'TEXT', category: 'REGULATORY', sensitive: true, sampleValues: ['US', 'UK', 'CA', 'DE', 'FR', 'AU'] },
      { key: 'beneficial_ownership_disclosed', type: 'BOOLEAN', category: 'REGULATORY', sensitive: true, sampleValues: ['true', 'false'] },
      { key: 'sanctions_screening_required', type: 'BOOLEAN', category: 'REGULATORY', sensitive: false, sampleValues: ['true', 'false'] }
    ];

    const customFields = [];
    const now = new Date();

    // Generate custom fields for each entity
    for (const entity of entities) {
      const fieldsToUse = entity.entity_type === 'INDIVIDUAL' ? individualFields : organizationFields;
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Each entity gets 3-8 random custom fields
      const numFields = Math.floor(Math.random() * 6) + 3;
      const selectedFields = fieldsToUse.sort(() => 0.5 - Math.random()).slice(0, numFields);
      
      for (const fieldTemplate of selectedFields) {
        const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000); // Within last 60 days
        const updatedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * (now.getTime() - createdAt.getTime())));
        
        let fieldValue = fieldTemplate.sampleValues[Math.floor(Math.random() * fieldTemplate.sampleValues.length)];
        
        // For JSON fields, ensure proper formatting
        if (fieldTemplate.type === 'JSON') {
          fieldValue = fieldValue; // Already properly formatted JSON strings
        }
        
        customFields.push({
          id: 'gen_random_uuid()',
          entity_id: entity.id,
          field_key: fieldTemplate.key,
          field_value: fieldValue,
          field_type: fieldTemplate.type,
          field_category: fieldTemplate.category,
          is_sensitive: fieldTemplate.sensitive,
          created_at: createdAt.toISOString(),
          created_by: randomUser.id,
          updated_at: updatedAt.toISOString(),
          updated_by: randomUser.id
        });
      }
    }

    // Insert custom fields in batches
    const batchSize = 50;
    for (let i = 0; i < customFields.length; i += batchSize) {
      const batch = customFields.slice(i, i + batchSize);
      const values = batch.map(field => 
        `(gen_random_uuid(), '${field.entity_id}', '${field.field_key}', '${field.field_value.replace(/'/g, "''")}', '${field.field_type}', '${field.field_category}', ${field.is_sensitive}, '${field.created_at}', '${field.created_by}', '${field.updated_at}', '${field.updated_by}')`
      ).join(', ');

      await queryRunner.query(`
        INSERT INTO entity_custom_fields (id, entity_id, field_key, field_value, field_type, field_category, is_sensitive, created_at, created_by, updated_at, updated_by)
        VALUES ${values}
      `);
    }

    console.log(`✅ Successfully seeded ${customFields.length} entity custom fields`);

  } catch (error) {
    console.error('❌ Error seeding entity custom fields:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}