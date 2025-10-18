import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndividualEntities1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS individual_entities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        entity_id UUID UNIQUE NOT NULL,
        date_of_birth DATE NOT NULL,
        nationality JSONB NOT NULL DEFAULT '[]'::jsonb,
        country_of_residence JSONB DEFAULT '[]'::jsonb,
        gender TEXT,
        address TEXT,
        occupation TEXT,
        national_id TEXT,
        id_type TEXT,
        id_expiry_date DATE,
        source_of_income TEXT,
        is_pep BOOLEAN NOT NULL DEFAULT FALSE,
        has_criminal_record BOOLEAN NOT NULL DEFAULT FALSE,
        pep_details TEXT,
        criminal_record_details TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT fk_individual_entities_entity
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_individual_entities_gender ON individual_entities (gender)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_individual_entities_id_type ON individual_entities (id_type)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_individual_entities_id_expiry_date ON individual_entities (id_expiry_date)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS individual_entities`);
  }
}