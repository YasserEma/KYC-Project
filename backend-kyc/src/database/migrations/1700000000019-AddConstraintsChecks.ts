import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConstraintsChecks1700000000019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add check constraints to ensure numeric ranges and logical values
    await queryRunner.query(`
      ALTER TABLE organization_relationships
      ADD CONSTRAINT chk_org_rel_ownership_percentage
      CHECK (ownership_percentage IS NULL OR (ownership_percentage >= 0 AND ownership_percentage <= 100));
    `);

    await queryRunner.query(`
      ALTER TABLE organization_associations
      ADD CONSTRAINT chk_org_assoc_ownership_percentage
      CHECK (ownership_percentage IS NULL OR (ownership_percentage >= 0 AND ownership_percentage <= 100));
    `);

    await queryRunner.query(`
      ALTER TABLE screening_analysis
      ADD CONSTRAINT chk_screening_best_match_score
      CHECK (best_match_score IS NULL OR (best_match_score >= 0 AND best_match_score <= 100));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE screening_analysis DROP CONSTRAINT IF EXISTS chk_screening_best_match_score`,
    );
    await queryRunner.query(
      `ALTER TABLE organization_associations DROP CONSTRAINT IF EXISTS chk_org_assoc_ownership_percentage`,
    );
    await queryRunner.query(
      `ALTER TABLE organization_relationships DROP CONSTRAINT IF EXISTS chk_org_rel_ownership_percentage`,
    );
  }
}