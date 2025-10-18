import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScreeningConfigValues1700000000015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS screening_config_values (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        configuration_id UUID NOT NULL,
        config_key TEXT NOT NULL,
        config_value TEXT,
        value_type TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_by UUID,
        CONSTRAINT fk_screening_config_values_configuration
          FOREIGN KEY (configuration_id) REFERENCES screening_configuration(id) ON DELETE CASCADE,
        CONSTRAINT fk_screening_config_values_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_screening_config_values_updated_by
          FOREIGN KEY (updated_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_screening_config_values_configuration_id ON screening_config_values (configuration_id)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_screening_config_key_per_configuration ON screening_config_values (configuration_id, config_key)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS screening_config_values`);
  }
}