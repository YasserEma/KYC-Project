import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScreeningAnalysis1700000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS screening_analysis (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        entity_id UUID NOT NULL,
        screening_date TIMESTAMP NOT NULL DEFAULT NOW(),
        screening_source TEXT NOT NULL,
        matched_records JSONB,
        best_match_score DECIMAL,
        screening_status TEXT NOT NULL,
        reviewer_id UUID,
        review_decision TEXT,
        review_notes TEXT,
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        CONSTRAINT fk_screening_entity
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_screening_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_screening_reviewer
          FOREIGN KEY (reviewer_id) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_screening_entity_id ON screening_analysis (entity_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_screening_date ON screening_analysis (screening_date)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_screening_status ON screening_analysis (screening_status)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS screening_analysis`);
  }
}