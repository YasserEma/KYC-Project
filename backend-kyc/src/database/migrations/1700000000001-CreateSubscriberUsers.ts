import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriberUsers1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS subscriber_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        subscriber_id UUID NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone_number TEXT,
        role TEXT NOT NULL,
        password TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by UUID,
        permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
        CONSTRAINT fk_subscriber_users_subscriber
          FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
        CONSTRAINT fk_subscriber_users_created_by
          FOREIGN KEY (created_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_subscriber_users_subscriber_email ON subscriber_users (subscriber_id, email)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subscriber_users_subscriber_id ON subscriber_users (subscriber_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subscriber_users_role ON subscriber_users (role)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS subscriber_users`);
  }
}