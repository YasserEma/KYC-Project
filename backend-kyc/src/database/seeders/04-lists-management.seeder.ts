import { DataSource } from 'typeorm';

export async function seedListsManagement(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  
  try {
    // Check if data already exists
    const existingCount = await queryRunner.query('SELECT COUNT(*) FROM lists_management');
    if (parseInt(existingCount[0].count) > 0) {
      console.log('Lists management data already exists, skipping seeding');
      return;
    }

    const listsData = [
      // Bank One Lists
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
        list_name: 'OFAC Sanctions List',
        list_type: 'sanctions',
        description: 'Office of Foreign Assets Control sanctions list for regulatory compliance',
        scope: 'global',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
        list_name: 'Internal Whitelist',
        list_type: 'whitelist',
        description: 'Internal whitelist for trusted entities and low-risk customers',
        scope: 'internal',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
        list_name: 'PEP Database',
        list_type: 'pep',
        description: 'Politically Exposed Persons database for enhanced due diligence',
        scope: 'global',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440023',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
        list_name: 'EU Sanctions List',
        list_type: 'sanctions',
        description: 'European Union consolidated sanctions list',
        scope: 'regional',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440024',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
        list_name: 'UN Security Council List',
        list_type: 'sanctions',
        description: 'United Nations Security Council consolidated list',
        scope: 'global',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440001'
      },
      // Crypto Exchange Lists
      {
        id: '550e8400-e29b-41d4-a716-446655440025',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440006',
        list_name: 'Crypto Sanctions List',
        list_type: 'sanctions',
        description: 'Cryptocurrency-specific sanctions and blocked addresses',
        scope: 'global',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440061'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440026',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440006',
        list_name: 'High-Risk Jurisdictions',
        list_type: 'watchlist',
        description: 'Countries and jurisdictions with high AML/CFT risks',
        scope: 'global',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440061'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440027',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440006',
        list_name: 'Verified Customers',
        list_type: 'whitelist',
        description: 'Customers who have completed enhanced verification',
        scope: 'internal',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440061'
      },
      // Insurance Corp Lists
      {
        id: '550e8400-e29b-41d4-a716-446655440028',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440005',
        list_name: 'Insurance Fraud Database',
        list_type: 'watchlist',
        description: 'Known insurance fraud cases and suspicious entities',
        scope: 'industry',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440051'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440029',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440005',
        list_name: 'Preferred Partners',
        list_type: 'whitelist',
        description: 'Trusted business partners and service providers',
        scope: 'internal',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440051'
      },
      // Fintech Startup Lists
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440004',
        list_name: 'FATF Grey List',
        list_type: 'watchlist',
        description: 'Countries under increased monitoring by FATF',
        scope: 'global',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440041'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        subscriber_id: '550e8400-e29b-41d4-a716-446655440004',
        list_name: 'VIP Customers',
        list_type: 'whitelist',
        description: 'High-value customers with expedited processing',
        scope: 'internal',
        is_active: true,
        created_by: '550e8400-e29b-41d4-a716-446655440041'
      }
    ];

    for (const data of listsData) {
      await queryRunner.query(
        `
        INSERT INTO lists_management (
          id, subscriber_id, list_name, list_type, description, scope, is_active, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
        `,
        [
          data.id, data.subscriber_id, data.list_name, data.list_type, 
          data.description, data.scope, data.is_active, data.created_by
        ],
      );
    }
    
    console.log(`Seeded ${listsData.length} list management records`);
  } finally {
    await queryRunner.release();
  }
}