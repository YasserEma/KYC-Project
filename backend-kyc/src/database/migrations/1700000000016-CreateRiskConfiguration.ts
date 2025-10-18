import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRiskConfiguration1700000000016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS risk_configuration (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        config_profile_id UUID,
        subscriber_id UUID NOT NULL,
        entity_type TEXT NOT NULL,
        configuration_name TEXT NOT NULL,
        description TEXT,
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_by UUID,
        CONSTRAINT fk_risk_config_subscriber
          FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
        CONSTRAINT fk_risk_config_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_risk_config_updated_by
          FOREIGN KEY (updated_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_risk_config_profile_id ON risk_configuration (config_profile_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_risk_config_subscriber_id ON risk_configuration (subscriber_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_risk_config_entity_type ON risk_configuration (entity_type)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_risk_config_name_per_subscriber ON risk_configuration (subscriber_id, configuration_name)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS risk_configuration`);
  }
}