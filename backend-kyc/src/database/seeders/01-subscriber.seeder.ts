import { DataSource } from 'typeorm';

export async function seedSubscribers(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const subscribers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        username: 'bank_one',
        email: 'admin@bankone.test',
        password: 'hashed-password',
        type: 'BANK',
        subscription_tier: 'ENTERPRISE',
        jurisdiction: 'US',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'supermarket_one',
        email: 'admin@supermarket.test',
        password: 'hashed-password',
        type: 'SUPERMARKET',
        subscription_tier: 'PREMIUM',
        jurisdiction: 'US',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        username: 'credit_union_eu',
        email: 'admin@creditunion.test',
        password: 'hashed-password',
        type: 'CREDIT_UNION',
        subscription_tier: 'STANDARD',
        jurisdiction: 'EU',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        username: 'fintech_startup',
        email: 'admin@fintech.test',
        password: 'hashed-password',
        type: 'FINTECH',
        subscription_tier: 'BASIC',
        jurisdiction: 'UK',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        username: 'insurance_corp',
        email: 'admin@insurance.test',
        password: 'hashed-password',
        type: 'INSURANCE',
        subscription_tier: 'ENTERPRISE',
        jurisdiction: 'CA',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        username: 'crypto_exchange',
        email: 'admin@cryptoexchange.test',
        password: 'hashed-password',
        type: 'CRYPTO_EXCHANGE',
        subscription_tier: 'PREMIUM',
        jurisdiction: 'SG',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        username: 'money_service_business',
        email: 'admin@msb.test',
        password: 'hashed-password',
        type: 'MSB',
        subscription_tier: 'STANDARD',
        jurisdiction: 'AU',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        username: 'investment_firm',
        email: 'admin@investment.test',
        password: 'hashed-password',
        type: 'INVESTMENT_FIRM',
        subscription_tier: 'ENTERPRISE',
        jurisdiction: 'CH',
      },
    ];

    for (const s of subscribers) {
      await queryRunner.query(
        `
        INSERT INTO subscribers (id, username, email, password, type, subscription_tier, jurisdiction)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (username) DO NOTHING
        `,
        [s.id, s.username, s.email, s.password, s.type, s.subscription_tier, s.jurisdiction],
      );
    }
  } finally {
    await queryRunner.release();
  }
}