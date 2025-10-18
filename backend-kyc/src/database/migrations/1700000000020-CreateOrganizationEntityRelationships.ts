import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateOrganizationEntityRelationships1700000000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organization_entity_relationships',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'from_entity_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'to_entity_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'relationship_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ownership_percentage',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'additional_details',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'organization_entity_relationships',
      new TableIndex({
        name: 'idx_org_entity_rel_from_entity',
        columnNames: ['from_entity_id'],
      }),
    );

    await queryRunner.createIndex(
      'organization_entity_relationships',
      new TableIndex({
        name: 'idx_org_entity_rel_to_entity',
        columnNames: ['to_entity_id'],
      }),
    );

    await queryRunner.createIndex(
      'organization_entity_relationships',
      new TableIndex({
        name: 'idx_org_entity_rel_type',
        columnNames: ['relationship_type'],
      }),
    );

    await queryRunner.createIndex(
      'organization_entity_relationships',
      new TableIndex({
        name: 'idx_org_entity_rel_unique',
        columnNames: ['from_entity_id', 'to_entity_id', 'relationship_type'],
        isUnique: true,
      }),
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'organization_entity_relationships',
      new TableForeignKey({
        columnNames: ['from_entity_id'],
        referencedTableName: 'entities',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'fk_org_entity_rel_from_entity',
      }),
    );

    await queryRunner.createForeignKey(
      'organization_entity_relationships',
      new TableForeignKey({
        columnNames: ['to_entity_id'],
        referencedTableName: 'entities',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'fk_org_entity_rel_to_entity',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organization_entity_relationships');
  }
}