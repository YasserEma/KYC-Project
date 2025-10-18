import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationEntities1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS organization_entities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        entity_id UUID UNIQUE NOT NULL,
        legal_name TEXT NOT NULL,
        trade_name TEXT,
        country_of_incorporation TEXT NOT NULL,
        date_of_incorporation DATE NOT NULL,
        organization_type TEXT,
        legal_structure TEXT,
        tax_identification_number TEXT,
        commercial_registration_number TEXT,
        registered_address TEXT,
        operating_address TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        industry_sector TEXT,
        number_of_employees INTEGER,
        annual_revenue DECIMAL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT fk_organization_entities_entity
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_organization_entities_country ON organization_entities (country_of_incorporation)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_organization_entities_org_type ON organization_entities (organization_type)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS organization_entities`);
  }
}