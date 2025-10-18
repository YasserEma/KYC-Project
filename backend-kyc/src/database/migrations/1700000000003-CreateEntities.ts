import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntities1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS entities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        subscriber_id UUID NOT NULL,
        entity_type TEXT NOT NULL,
        name TEXT NOT NULL,
        reference_number TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_by UUID,
        risk_level TEXT,
        screening_status TEXT,
        onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
        onboarded_at TIMESTAMP,
        last_screened_at TIMESTAMP,
        last_risk_assessed_at TIMESTAMP,
        deleted_at TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT fk_entities_subscriber
          FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
        CONSTRAINT fk_entities_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_entities_updated_by
          FOREIGN KEY (updated_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entities_subscriber_id ON entities (subscriber_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entities_entity_type ON entities (entity_type)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entities_name ON entities (name)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entities_status ON entities (status)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS entities`);
  }
}