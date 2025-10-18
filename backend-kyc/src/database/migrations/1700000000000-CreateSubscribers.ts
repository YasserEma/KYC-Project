import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscribers1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        type TEXT NOT NULL,
        contact_person_name TEXT,
        contact_person_phone TEXT,
        subscription_tier TEXT,
        subscription_valid_from DATE,
        subscription_valid_until DATE,
        jurisdiction TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subscribers_username ON subscribers (username)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subscribers_type ON subscribers (type)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS subscribers`);
  }
}