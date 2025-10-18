import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndividualRelationships1700000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS individual_relationships (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        primary_individual_id UUID NOT NULL,
        related_individual_id UUID NOT NULL,
        relationship_type TEXT NOT NULL,
        relationship_description TEXT,
        effective_from DATE NOT NULL,
        effective_to DATE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_by UUID,
        verified_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        CONSTRAINT fk_ind_rel_primary
          FOREIGN KEY (primary_individual_id) REFERENCES individual_entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_ind_rel_related
          FOREIGN KEY (related_individual_id) REFERENCES individual_entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_ind_rel_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_ind_rel_verified_by
          FOREIGN KEY (verified_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_ind_rel_primary ON individual_relationships (primary_individual_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_ind_rel_related ON individual_relationships (related_individual_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_ind_rel_type ON individual_relationships (relationship_type)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS individual_relationships`);
  }
}