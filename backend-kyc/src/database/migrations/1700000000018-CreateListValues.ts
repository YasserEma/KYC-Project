import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListValues1700000000018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS list_values (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        list_id UUID NOT NULL,
        value_name TEXT NOT NULL,
        value_code TEXT,
        value_description TEXT,
        value_metadata JSONB,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_by UUID,
        CONSTRAINT fk_list_values_list
          FOREIGN KEY (list_id) REFERENCES lists_management(id) ON DELETE CASCADE,
        CONSTRAINT fk_list_values_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_list_values_updated_by
          FOREIGN KEY (updated_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_list_values_list_id ON list_values (list_id)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_list_values_name_per_list ON list_values (list_id, value_name)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS list_values`);
  }
}