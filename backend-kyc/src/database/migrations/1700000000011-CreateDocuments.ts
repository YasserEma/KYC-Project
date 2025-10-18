import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocuments1700000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        entity_id UUID NOT NULL,
        document_type TEXT NOT NULL,
        document_subtype TEXT,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_hash TEXT,
        mime_type TEXT,
        storage_provider TEXT,
        issued_by TEXT,
        issued_date DATE,
        expiry_date DATE,
        country TEXT,
        status TEXT NOT NULL,
        review_notes TEXT,
        uploaded_by UUID NOT NULL,
        uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
        verified_by UUID,
        verified_at TIMESTAMP,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        deleted_at TIMESTAMP,
        deleted_by UUID,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_documents_entity
          FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
        CONSTRAINT fk_documents_uploaded_by
          FOREIGN KEY (uploaded_by) REFERENCES subscriber_users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_documents_verified_by
          FOREIGN KEY (verified_by) REFERENCES subscriber_users(id) ON DELETE SET NULL,
        CONSTRAINT fk_documents_deleted_by
          FOREIGN KEY (deleted_by) REFERENCES subscriber_users(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_documents_entity_id ON documents (entity_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents (document_type)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON documents (expiry_date)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS documents`);
  }
}