import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRiskAnalysis1700000000013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS risk_analysis (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        entity_id UUID NOT NULL,
        analysis_date TIMESTAMP NOT NULL DEFAULT NOW(),
        risk_level TEXT NOT NULL,
        risk_score DECIMAL,
        risk_factors JSONB,
        mitigation_actions JSONB,
        analyst_id UUID,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        CONSTRAINT fk_risk_entity
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_risk_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_risk_analyst
          FOREIGN KEY (analyst_id) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_risk_entity_id ON risk_analysis (entity_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_risk_analysis_date ON risk_analysis (analysis_date)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_risk_level ON risk_analysis (risk_level)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS risk_analysis`);
  }
}