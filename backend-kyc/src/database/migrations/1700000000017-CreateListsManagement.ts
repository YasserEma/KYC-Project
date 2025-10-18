import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListsManagement1700000000017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS lists_management (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        subscriber_id UUID NOT NULL,
        list_name TEXT NOT NULL,
        list_type TEXT NOT NULL,
        description TEXT,
        scope TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_by UUID,
        CONSTRAINT fk_lists_subscriber
          FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
        CONSTRAINT fk_lists_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_lists_updated_by
          FOREIGN KEY (updated_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_lists_subscriber_id ON lists_management (subscriber_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_lists_type ON lists_management (list_type)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_lists_name_per_subscriber ON lists_management (subscriber_id, list_name)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS lists_management`);
  }
}