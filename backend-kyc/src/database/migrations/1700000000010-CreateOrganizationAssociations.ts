import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationAssociations1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS organization_associations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL,
        individual_id UUID NOT NULL,
        relationship_type TEXT NOT NULL,
        ownership_type TEXT,
        ownership_percentage DECIMAL,
        position_title TEXT,
        association_description TEXT,
        effective_from DATE NOT NULL,
        effective_to DATE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_by UUID,
        verified_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        CONSTRAINT fk_org_assoc_org
          FOREIGN KEY (organization_id) REFERENCES organization_entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_org_assoc_individual
          FOREIGN KEY (individual_id) REFERENCES individual_entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_org_assoc_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_org_assoc_verified_by
          FOREIGN KEY (verified_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_org_assoc_org_id ON organization_associations (organization_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_org_assoc_individual_id ON organization_associations (individual_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_org_assoc_relationship_type ON organization_associations (relationship_type)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS organization_associations`);
  }
}