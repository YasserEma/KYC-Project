import { DataSource } from 'typeorm';

export async function seedScreeningConfiguration(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    // Check if data already exists
    const existingData = await queryRunner.query('SELECT COUNT(*) as count FROM screening_configuration');
    if (parseInt(existingData[0].count) > 0) {
      console.log('Screening configuration data already exists, skipping seeding');
      return;
    }

    // Get subscriber IDs and their types
    const subscribers = await queryRunner.query('SELECT id, type, username FROM subscribers');
    if (subscribers.length === 0) {
      console.log('No subscribers found, skipping screening configuration seeding');
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

    const screeningConfigData = [];

    // Generate screening configurations for each subscriber based on their type
    for (const subscriber of subscribers) {
      const subscriberId = subscriber.id;
      const subscriberType = subscriber.type;
      const subscriberUsername = subscriber.username;

      // Base configurations for all subscriber types
      screeningConfigData.push(
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'Individual Sanctions Screening',
          description: 'Standard configuration for individual sanctions list screening',
          is_default: true,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'corporate',
          configuration_name: 'Corporate Sanctions Screening',
          description: 'Standard configuration for corporate sanctions list screening',
          is_default: true,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'PEP Screening Configuration',
          description: 'Configuration for Politically Exposed Person screening',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'Adverse Media Screening',
          description: 'Configuration for adverse media screening',
          is_default: false,
          created_by: createdBy
        }
      );

      // Add specific configurations based on subscriber type
      if (subscriberType === 'BANK') {
        screeningConfigData.push(
          {
            subscriber_id: subscriberId,
            entity_type: 'individual',
            configuration_name: 'Enhanced Due Diligence Screening',
            description: 'Enhanced screening for high-risk banking customers',
            is_default: false,
            created_by: createdBy
          },
          {
            subscriber_id: subscriberId,
            entity_type: 'transaction',
            configuration_name: 'Wire Transfer Screening',
            description: 'Specialized screening for wire transfer transactions',
            is_default: false,
            created_by: createdBy
          },
          {
            subscriber_id: subscriberId,
            entity_type: 'corporate',
            configuration_name: 'Correspondent Banking Screening',
            description: 'Screening configuration for correspondent banking relationships',
            is_default: false,
            created_by: createdBy
          }
        );
      } else if (subscriberType === 'CRYPTO_EXCHANGE') {
        screeningConfigData.push(
          {
            subscriber_id: subscriberId,
            entity_type: 'individual',
            configuration_name: 'Crypto Trader Screening',
            description: 'Specialized screening for cryptocurrency traders',
            is_default: false,
            created_by: createdBy
          },
          {
            subscriber_id: subscriberId,
            entity_type: 'transaction',
            configuration_name: 'Crypto Transaction Screening',
            description: 'Screening configuration for cryptocurrency transactions',
            is_default: false,
            created_by: createdBy
          },
          {
            subscriber_id: subscriberId,
            entity_type: 'corporate',
            configuration_name: 'Crypto Exchange Screening',
            description: 'Screening for crypto exchange interactions',
            is_default: false,
            created_by: createdBy
          }
        );
      } else if (subscriberType === 'INSURANCE') {
        screeningConfigData.push(
          {
            subscriber_id: subscriberId,
            entity_type: 'individual',
            configuration_name: 'Policyholder Screening',
            description: 'Screening configuration for insurance policyholders',
            is_default: false,
            created_by: createdBy
          },
          {
            subscriber_id: subscriberId,
            entity_type: 'corporate',
            configuration_name: 'Corporate Policy Screening',
            description: 'Screening for corporate insurance policies',
            is_default: false,
            created_by: createdBy
          }
        );
      } else if (subscriberType === 'FINTECH') {
        screeningConfigData.push(
          {
            subscriber_id: subscriberId,
            entity_type: 'individual',
            configuration_name: 'Digital Customer Screening',
            description: 'Screening configuration for digital-first customers',
            is_default: false,
            created_by: createdBy
          },
          {
            subscriber_id: subscriberId,
            entity_type: 'transaction',
            configuration_name: 'Digital Payment Screening',
            description: 'Screening for digital payment transactions',
            is_default: false,
            created_by: createdBy
          }
        );
      } else if (subscriberType === 'MSB') {
        screeningConfigData.push(
          {
            subscriber_id: subscriberId,
            entity_type: 'individual',
            configuration_name: 'Money Transfer Customer Screening',
            description: 'Screening configuration for money transfer customers',
            is_default: false,
            created_by: createdBy
          },
          {
            subscriber_id: subscriberId,
            entity_type: 'transaction',
            configuration_name: 'Cross-Border Transaction Screening',
            description: 'Enhanced screening for cross-border transactions',
            is_default: false,
            created_by: createdBy
          }
        );
      }
    }

    console.log('Seeding screening configurations...');
    
    // Insert screening configuration data
    for (const config of screeningConfigData) {
      await queryRunner.query(`
        INSERT INTO screening_configuration (
          subscriber_id, entity_type, configuration_name, description, 
          is_default, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (subscriber_id, configuration_name) DO NOTHING
      `, [
        config.subscriber_id,
        config.entity_type,
        config.configuration_name,
        config.description,
        config.is_default,
        config.created_by
      ]);
    }
    
    console.log(`Successfully seeded ${screeningConfigData.length} screening configurations`);
  } catch (error) {
    console.error('Error seeding screening configurations:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}