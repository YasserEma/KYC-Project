import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationRelationships1700000000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS organization_relationships (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        primary_organization_id UUID NOT NULL,
        related_organization_id UUID NOT NULL,
        relationship_type TEXT NOT NULL,
        ownership_percentage DECIMAL,
        relationship_description TEXT,
        effective_from DATE NOT NULL,
        effective_to DATE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_by UUID,
        verified_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        CONSTRAINT fk_org_rel_primary
          FOREIGN KEY (primary_organization_id) REFERENCES organization_entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_org_rel_related
          FOREIGN KEY (related_organization_id) REFERENCES organization_entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_org_rel_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_org_rel_verified_by
          FOREIGN KEY (verified_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_org_rel_primary ON organization_relationships (primary_organization_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_org_rel_related ON organization_relationships (related_organization_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_org_rel_type ON organization_relationships (relationship_type)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS organization_relationships`);
  }
}