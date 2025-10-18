import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEntityHistory1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS entity_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        entity_id UUID NOT NULL,
        changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
        changed_by UUID NOT NULL,
        change_type TEXT NOT NULL,
        changes JSONB NOT NULL,
        change_description TEXT,
        ip_address TEXT,
        user_agent TEXT,
        CONSTRAINT fk_entity_history_entity
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_entity_history_changed_by
          FOREIGN KEY (changed_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entity_history_entity_id ON entity_history (entity_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_entity_history_changed_at ON entity_history (changed_at)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS entity_history`);
  }
}