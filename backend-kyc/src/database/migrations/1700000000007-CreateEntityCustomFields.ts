import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntityCustomFields1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS entity_custom_fields (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        entity_id UUID NOT NULL,
        field_key TEXT NOT NULL,
        field_value TEXT,
        field_type TEXT NOT NULL,
        field_category TEXT,
        is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_by UUID,
        CONSTRAINT fk_entity_custom_fields_entity
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_entity_custom_fields_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_entity_custom_fields_updated_by
          FOREIGN KEY (updated_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entity_custom_fields_entity_id ON entity_custom_fields (entity_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entity_custom_fields_field_type ON entity_custom_fields (field_type)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_entity_custom_field_key ON entity_custom_fields (entity_id, field_key)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS entity_custom_fields`);
  }
}