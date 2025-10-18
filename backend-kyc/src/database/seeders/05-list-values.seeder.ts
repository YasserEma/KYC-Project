import { DataSource } from 'typeorm';

export async function seedListValues(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  // Check if data already exists
  const existingData = await queryRunner.query('SELECT COUNT(*) as count FROM list_values');
  if (parseInt(existingData[0].count) > 0) {
    console.log('List values data already exists, skipping seeding');
    return;
  }

  // Get list IDs from lists_management table
  const lists = await queryRunner.query('SELECT id, list_name, list_type FROM lists_management ORDER BY created_at');
  
  if (lists.length === 0) {
    console.log('No lists found, skipping list values seeding');
    return;
  }

  const listValuesData = [];

  // Generate values for each list based on its type
  for (const list of lists) {
    const listId = list.id;
    const listType = list.list_type;
    const listName = list.list_name;

    if (listType === 'sanctions') {
      // Add sanctions list entries
      listValuesData.push(
        {
          list_id: listId,
          value_name: 'John Doe',
          value_code: 'OFAC-12345',
          value_description: 'Individual on OFAC sanctions list for terrorism financing',
          value_metadata: {
            date_of_birth: '1980-01-15',
            nationality: 'Unknown',
            passport_numbers: ['P123456789'],
            aliases: ['John D.', 'J. Doe'],
            source: 'OFAC',
            risk_level: 'high',
            sanctions_type: 'terrorism'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          list_id: listId,
          value_name: 'ABC Corporation',
          value_code: 'OFAC-67890',
          value_description: 'Corporate entity on OFAC sanctions list for money laundering',
          value_metadata: {
            registration_number: 'REG123456',
            incorporation_date: '2015-06-01',
            business_type: 'Financial Services',
            aliases: ['ABC Corp', 'ABC Financial'],
            source: 'OFAC',
            risk_level: 'high',
            sanctions_type: 'money_laundering'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          list_id: listId,
          value_name: 'Viktor Petrov',
          value_code: 'EU-SAN-001',
          value_description: 'Russian oligarch subject to EU sanctions',
          value_metadata: {
            date_of_birth: '1965-03-22',
            nationality: 'Russian',
            passport_numbers: ['RU987654321'],
            aliases: ['V. Petrov', 'Viktor P.'],
            source: 'EU',
            risk_level: 'high',
            sanctions_type: 'asset_freeze'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        }
      );
    } else if (listType === 'pep') {
      // Add PEP list entries
      listValuesData.push(
        {
          list_id: listId,
          value_name: 'Jane Smith',
          value_code: 'PEP-001',
          value_description: 'Government official - Minister of Finance',
          value_metadata: {
            position: 'Minister of Finance',
            department: 'Ministry of Finance',
            appointment_date: '2020-07-01',
            country: 'United Kingdom',
            aliases: ['J. Smith', 'Jane S.'],
            source: 'WorldCheck',
            risk_level: 'medium',
            pep_category: 'senior_government'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          list_id: listId,
          value_name: 'Carlos Rodriguez',
          value_code: 'PEP-002',
          value_description: 'Central Bank Governor',
          value_metadata: {
            position: 'Governor',
            department: 'Central Bank',
            appointment_date: '2018-01-15',
            country: 'Spain',
            aliases: ['C. Rodriguez', 'Carlos R.'],
            source: 'WorldCheck',
            risk_level: 'high',
            pep_category: 'central_bank'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        }
      );
    } else if (listType === 'whitelist') {
      // Add whitelist entries
      listValuesData.push(
        {
          list_id: listId,
          value_name: 'Trusted Bank Ltd',
          value_code: 'WL-001',
          value_description: 'Trusted counterparty - approved financial institution',
          value_metadata: {
            license_number: 'FCA123456',
            established_date: '1995-01-01',
            business_type: 'Commercial Bank',
            aliases: ['Trusted Bank', 'TB Ltd'],
            source: 'internal',
            risk_level: 'low',
            approval_date: '2023-01-01'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          list_id: listId,
          value_name: 'Premium Customer Inc',
          value_code: 'WL-002',
          value_description: 'VIP customer with enhanced verification',
          value_metadata: {
            customer_since: '2020-05-15',
            verification_level: 'enhanced',
            business_type: 'Technology',
            aliases: ['Premium Inc', 'PC Inc'],
            source: 'internal',
            risk_level: 'low',
            approval_date: '2023-06-01'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        }
      );
    } else if (listType === 'watchlist') {
      // Add watchlist entries
      listValuesData.push(
        {
          list_id: listId,
          value_name: 'Suspicious Entity LLC',
          value_code: 'WL-SUS-001',
          value_description: 'Entity under investigation for suspicious activities',
          value_metadata: {
            investigation_date: '2023-08-15',
            business_type: 'Import/Export',
            suspicious_activity: 'unusual_transaction_patterns',
            aliases: ['Suspicious LLC', 'SE LLC'],
            source: 'internal',
            risk_level: 'high',
            monitoring_level: 'enhanced'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          list_id: listId,
          value_name: 'High Risk Country - North Korea',
          value_code: 'WL-COUNTRY-001',
          value_description: 'High-risk jurisdiction with AML/CFT deficiencies',
          value_metadata: {
            country_code: 'KP',
            fatf_status: 'high_risk',
            risk_factors: ['sanctions', 'money_laundering', 'terrorism_financing'],
            source: 'FATF',
            risk_level: 'critical',
            monitoring_level: 'enhanced'
          },
          is_active: true,
          created_by: '550e8400-e29b-41d4-a716-446655440001'
        }
      );
    }
  }

  console.log('Seeding list values...');
  
  // Insert data using raw SQL
  for (const listValue of listValuesData) {
    await queryRunner.query(`
      INSERT INTO list_values (
        list_id, value_name, value_code, value_description, value_metadata, is_active, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (list_id, value_name) DO NOTHING
    `, [
      listValue.list_id,
      listValue.value_name,
      listValue.value_code,
      listValue.value_description,
      JSON.stringify(listValue.value_metadata),
      listValue.is_active,
      listValue.created_by
    ]);
  }
  
  console.log(`Successfully seeded ${listValuesData.length} list values`);
}