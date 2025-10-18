import { DataSource } from 'typeorm';

export async function seedScreeningConfigValues(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  // Check if data already exists
  const existingData = await queryRunner.query('SELECT COUNT(*) as count FROM screening_config_values');
  if (parseInt(existingData[0].count) > 0) {
    console.log('Screening config values data already exists, skipping seeding');
    return;
  }

  // Get screening configurations
  const configurations = await queryRunner.query(`
    SELECT id, entity_type, configuration_name 
    FROM screening_configuration 
    ORDER BY id
  `);

  if (configurations.length === 0) {
    console.log('No screening configurations found. Please run screening configuration seeder first.');
    return;
  }

  // Get an admin user for created_by field
    const adminUser = await queryRunner.query(`
      SELECT id FROM subscriber_users WHERE role = 'ADMIN' LIMIT 1
    `);

    if (adminUser.length === 0) {
      console.log('No admin user found. Please ensure subscriber users are seeded first.');
      return;
    }

  const createdBy = adminUser[0].id;

  const configValuesData = [];

  // Generate config values for each configuration
  for (const config of configurations) {
    const configId = config.id;
    const entityType = config.entity_type;
    const configName = config.configuration_name;

    // Base configuration values for all types
    configValuesData.push(
      {
        configuration_id: configId,
        config_key: 'threshold_score',
        config_value: '75',
        value_type: 'number',
        description: `Risk threshold score for ${configName}`,
        created_by: createdBy
      },
      {
        configuration_id: configId,
        config_key: 'auto_approve_threshold',
        config_value: '25',
        value_type: 'number',
        description: `Auto-approval threshold for ${configName}`,
        created_by: createdBy
      },
      {
        configuration_id: configId,
        config_key: 'enabled',
        config_value: 'true',
        value_type: 'boolean',
        description: `Enable/disable ${configName}`,
        created_by: createdBy
      }
    );

    // Entity-type specific configuration values
    if (entityType === 'individual') {
      configValuesData.push(
        {
          configuration_id: configId,
          config_key: 'identity_verification',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Enable identity verification for individuals',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'document_types',
          config_value: 'PASSPORT,DRIVERS_LICENSE,NATIONAL_ID',
          value_type: 'array',
          description: 'Accepted document types for individual verification',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'age_verification',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Enable age verification for individuals',
          created_by: createdBy
        }
      );
    } else if (entityType === 'corporate') {
      configValuesData.push(
        {
          configuration_id: configId,
          config_key: 'beneficial_ownership',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Enable beneficial ownership screening',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'corporate_structure',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Analyze corporate structure',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'ubo_threshold',
          config_value: '25',
          value_type: 'number',
          description: 'Ultimate beneficial ownership threshold percentage',
          created_by: createdBy
        }
      );
    } else if (entityType === 'transaction') {
      configValuesData.push(
        {
          configuration_id: configId,
          config_key: 'amount_threshold',
          config_value: '10000',
          value_type: 'number',
          description: 'Transaction amount threshold for screening',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'velocity_monitoring',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Enable transaction velocity monitoring',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'pattern_detection',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Enable suspicious pattern detection',
          created_by: createdBy
        }
      );
    }

    // Add configuration-specific values based on configuration name
    if (configName.toLowerCase().includes('sanctions')) {
      configValuesData.push(
        {
          configuration_id: configId,
          config_key: 'sanctions_lists',
          config_value: 'OFAC,UN,EU,HMT',
          value_type: 'array',
          description: 'Sanctions lists to check against',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'fuzzy_matching',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Enable fuzzy matching for sanctions screening',
          created_by: createdBy
        }
      );
    }

    if (configName.toLowerCase().includes('pep')) {
      configValuesData.push(
        {
          configuration_id: configId,
          config_key: 'pep_categories',
          config_value: 'HEAD_OF_STATE,MINISTER,JUDGE,MILITARY',
          value_type: 'array',
          description: 'PEP categories to screen for',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'include_family',
          config_value: 'true',
          value_type: 'boolean',
          description: 'Include family members in PEP screening',
          created_by: createdBy
        }
      );
    }

    if (configName.toLowerCase().includes('adverse') || configName.toLowerCase().includes('media')) {
      configValuesData.push(
        {
          configuration_id: configId,
          config_key: 'media_sources',
          config_value: 'NEWS,BLOGS,SOCIAL_MEDIA',
          value_type: 'array',
          description: 'Media sources to monitor',
          created_by: createdBy
        },
        {
          configuration_id: configId,
          config_key: 'keywords',
          config_value: 'fraud,corruption,money laundering,terrorism',
          value_type: 'array',
          description: 'Keywords to search for in adverse media',
          created_by: createdBy
        }
      );
    }
  }

  console.log('Seeding screening config values...');
  
  // Insert data using raw SQL
  for (const configValue of configValuesData) {
    await queryRunner.query(`
      INSERT INTO screening_config_values (
        configuration_id, config_key, config_value, value_type, description, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (configuration_id, config_key) DO NOTHING
    `, [
      configValue.configuration_id,
      configValue.config_key,
      configValue.config_value,
      configValue.value_type,
      configValue.description,
      configValue.created_by
    ]);
  }
  
  console.log(`Successfully seeded ${configValuesData.length} screening config values`);
}