import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLogs1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        subscriber_id UUID NOT NULL,
        user_id UUID,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        action_type TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        action_description TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        request_data JSONB,
        response_data JSONB,
        status TEXT,
        error_message TEXT,
        session_id TEXT,
        affected_fields JSONB,
        severity TEXT,
        CONSTRAINT fk_logs_subscriber
          FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
        CONSTRAINT fk_logs_user
          FOREIGN KEY (user_id) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_logs_subscriber_id ON logs (subscriber_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs (user_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs (timestamp)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_logs_action_type ON logs (action_type)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS logs`);
  }
}