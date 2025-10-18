import { DataSource } from 'typeorm';

export async function seedRiskConfiguration(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  // Check if data already exists
  const existingData = await queryRunner.query('SELECT COUNT(*) as count FROM risk_configuration');
  if (parseInt(existingData[0].count) > 0) {
    console.log('Risk configuration data already exists, skipping seeding');
    return;
  }

  // Get subscriber IDs and their types
  const subscribers = await queryRunner.query('SELECT id, type, username FROM subscribers');
  if (subscribers.length === 0) {
    console.log('No subscribers found, skipping risk configuration seeding');
    return;
  }

  // Get user IDs for each subscriber
  const users = await queryRunner.query('SELECT id, subscriber_id FROM subscriber_users WHERE role = \'ADMIN\'');
  if (users.length === 0) {
    console.log('No admin users found, skipping risk configuration seeding');
    return;
  }

  const riskConfigData = [];

  // Generate risk configurations for each subscriber based on their type
  for (const subscriber of subscribers) {
    const subscriberId = subscriber.id;
    const subscriberType = subscriber.type;
    const subscriberUsername = subscriber.username;
    
    // Find an admin user for this subscriber
    const adminUser = users.find((u: any) => u.subscriber_id === subscriberId);
    const createdBy = adminUser ? adminUser.id : users[0].id;

    // Base configurations for all subscriber types
    riskConfigData.push(
      {
        subscriber_id: subscriberId,
        entity_type: 'individual',
        configuration_name: 'Individual Risk Scoring Configuration',
        description: 'Base configuration for individual customer risk scoring',
        is_default: true,
        created_by: createdBy
      },
      {
        subscriber_id: subscriberId,
        entity_type: 'corporate',
        configuration_name: 'Corporate Risk Scoring Configuration',
        description: 'Base configuration for corporate customer risk scoring',
        is_default: true,
        created_by: createdBy
      },
      {
        subscriber_id: subscriberId,
        entity_type: 'transaction',
        configuration_name: 'Transaction Risk Configuration',
        description: 'Configuration for transaction-based risk assessment',
        is_default: false,
        created_by: createdBy
      }
    );

    // Add specific configurations based on subscriber type
    if (subscriberType === 'BANK') {
      riskConfigData.push(
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'High Net Worth Individual Configuration',
          description: 'Enhanced risk configuration for high net worth individuals',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'corporate',
          configuration_name: 'Financial Institution Configuration',
          description: 'Risk configuration for financial institution customers',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'transaction',
          configuration_name: 'Wire Transfer Risk Configuration',
          description: 'Specific configuration for wire transfer risk assessment',
          is_default: false,
          created_by: createdBy
        }
      );
    } else if (subscriberType === 'CRYPTO_EXCHANGE') {
      riskConfigData.push(
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'Crypto Trader Risk Configuration',
          description: 'Risk configuration for cryptocurrency traders',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'transaction',
          configuration_name: 'Crypto Transaction Risk Configuration',
          description: 'Risk assessment for cryptocurrency transactions',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'wallet',
          configuration_name: 'Wallet Address Risk Configuration',
          description: 'Risk configuration for wallet address screening',
          is_default: false,
          created_by: createdBy
        }
      );
    } else if (subscriberType === 'INSURANCE') {
      riskConfigData.push(
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'Policyholder Risk Configuration',
          description: 'Risk configuration for insurance policyholders',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'claim',
          configuration_name: 'Insurance Claim Risk Configuration',
          description: 'Risk assessment for insurance claims',
          is_default: false,
          created_by: createdBy
        }
      );
    } else if (subscriberType === 'FINTECH') {
      riskConfigData.push(
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'Digital Customer Risk Configuration',
          description: 'Risk configuration for digital-first customers',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'transaction',
          configuration_name: 'Digital Payment Risk Configuration',
          description: 'Risk assessment for digital payment transactions',
          is_default: false,
          created_by: createdBy
        }
      );
    } else if (subscriberType === 'MSB') {
      riskConfigData.push(
        {
          subscriber_id: subscriberId,
          entity_type: 'individual',
          configuration_name: 'Money Transfer Customer Configuration',
          description: 'Risk configuration for money transfer customers',
          is_default: false,
          created_by: createdBy
        },
        {
          subscriber_id: subscriberId,
          entity_type: 'transaction',
          configuration_name: 'Remittance Risk Configuration',
          description: 'Risk assessment for remittance transactions',
          is_default: false,
          created_by: createdBy
        }
      );
    }
  }

  // Insert risk configuration data
  for (const config of riskConfigData) {
    await queryRunner.query(`
      INSERT INTO risk_configuration (
        subscriber_id, entity_type, configuration_name, description, is_default, created_by
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

  console.log(`Seeded ${riskConfigData.length} risk configuration records`);
}