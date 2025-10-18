Phase 1: Complete Database Setup Prompt for Cursor AI
📋 Project Context
You are building a Multi-tenant KYC/KYB Compliance System using NestJS, PostgreSQL, and TypeORM seqlize . This is Phase 1 which focuses exclusively on creating the complete database infrastructure with proper structure, migrations, seeders, and repository setup.

🎯 Phase 1 Objectives

Create complete database schema with all tables
Implement TypeORM entities with proper relationships
Create database migrations for version control
Implement comprehensive seeders for initial data
Set up repository pattern with base repositories
Configure database connection and environment setup
Implement proper indexing and constraints
Add database utilities and helpers

make the project run with 1-migration 2-seeders  3- dev 
download postgress if not exist on my system 


📁 Required Project Structure
src/
├── config/
│   ├── database.config.ts          # TypeORM configuration
│   ├── app.config.ts                # Application configuration
│   └── validation.schema.ts         # Environment validation
│
├── database/
│   ├── migrations/                  # All migration files
│   │   ├── 1700000000000-CreateSubscribers.ts
│   │   ├── 1700000000001-CreateSubscriberUsers.ts
│   │   ├── 1700000000002-CreateLogs.ts
│   │   ├── 1700000000003-CreateEntities.ts
│   │   ├── 1700000000004-CreateIndividualEntities.ts
│   │   ├── 1700000000005-CreateOrganizationEntities.ts
│   │   ├── 1700000000006-CreateEntityHistory.ts
│   │   ├── 1700000000007-CreateEntityCustomFields.ts
│   │   ├── 1700000000008-CreateIndividualRelationships.ts
│   │   ├── 1700000000009-CreateOrganizationRelationships.ts
│   │   ├── 1700000000010-CreateOrganizationAssociations.ts
│   │   ├── 1700000000011-CreateDocuments.ts
│   │   ├── 1700000000012-CreateScreeningAnalysis.ts
│   │   ├── 1700000000013-CreateRiskAnalysis.ts
│   │   ├── 1700000000014-CreateScreeningConfiguration.ts
│   │   ├── 1700000000015-CreateScreeningConfigValues.ts
│   │   ├── 1700000000016-CreateRiskConfiguration.ts
│   │   ├── 1700000000017-CreateListsManagement.ts
│   │   ├── 1700000000018-CreateListValues.ts
│   │   └── 1700000000019-AddIndexesAndConstraints.ts
│   │
│   ├── seeders/                     # All seeder files
│   │   ├── 01-subscriber.seeder.ts
│   │   ├── 02-subscriber-users.seeder.ts
│   │   ├── 03-lists-management.seeder.ts
│   │   ├── 04-list-values.seeder.ts
│   │   ├── 05-screening-configuration.seeder.ts
│   │   └── 06-risk-configuration.seeder.ts
│   │
│   └── seeds.ts                     # Main seed orchestrator
│
├── modules/
│   ├── common/
│   │   ├── entities/
│   │   │   └── base.entity.ts       # Base entity with common fields
│   │   ├── repositories/
│   │   │   └── base.repository.ts   # Base repository with common methods
│   │   └── interfaces/
│   │       ├── pagination.interface.ts
│   │       └── filter.interface.ts
│   │
│   ├── subscribers/
│   │   ├── entities/
│   │   │   └── subscriber.entity.ts
│   │   └── repositories/
│   │       └── subscriber.repository.ts
│   │
│   ├── subscriber-users/
│   │   ├── entities/
│   │   │   └── subscriber-user.entity.ts
│   │   └── repositories/
│   │       └── subscriber-user.repository.ts
│   │
│   ├── logs/
│   │   ├── entities/
│   │   │   └── log.entity.ts
│   │   └── repositories/
│   │       └── log.repository.ts
│   │
│   ├── entities/
│   │   ├── entities/
│   │   │   ├── entity.entity.ts
│   │   │   ├── individual-entity.entity.ts
│   │   │   ├── organization-entity.entity.ts
│   │   │   ├── entity-history.entity.ts
│   │   │   └── entity-custom-field.entity.ts
│   │   └── repositories/
│   │       ├── entity.repository.ts
│   │       ├── individual-entity.repository.ts
│   │       ├── organization-entity.repository.ts
│   │       ├── entity-history.repository.ts
│   │       └── entity-custom-field.repository.ts
│   │
│   ├── relationships/
│   │   ├── entities/
│   │   │   ├── individual-relationship.entity.ts
│   │   │   ├── organization-relationship.entity.ts
│   │   │   └── organization-association.entity.ts
│   │   └── repositories/
│   │       ├── individual-relationship.repository.ts
│   │       ├── organization-relationship.repository.ts
│   │       └── organization-association.repository.ts
│   │
│   ├── documents/
│   │   ├── entities/
│   │   │   └── document.entity.ts
│   │   └── repositories/
│   │       └── document.repository.ts
│   │
│   ├── screening/
│   │   ├── entities/
│   │   │   └── screening-analysis.entity.ts
│   │   └── repositories/
│   │       └── screening-analysis.repository.ts
│   │
│   ├── risk/
│   │   ├── entities/
│   │   │   └── risk-analysis.entity.ts
│   │   └── repositories/
│   │       └── risk-analysis.repository.ts
│   │
│   ├── configurations/
│   │   ├── entities/
│   │   │   ├── screening-configuration.entity.ts
│   │   │   ├── screening-config-value.entity.ts
│   │   │   └── risk-configuration.entity.ts
│   │   └── repositories/
│   │       ├── screening-configuration.repository.ts
│   │       ├── screening-config-value.repository.ts
│   │       └── risk-configuration.repository.ts
│   │
│   └── lists/
│       ├── entities/
│       │   ├── list-management.entity.ts
│       │   └── list-value.entity.ts
│       └── repositories/
│           ├── list-management.repository.ts
│           └── list-value.repository.ts
│
├── utils/
│   ├── database/
│   │   ├── transaction.helper.ts    # Transaction utilities
│   │   ├── query.helper.ts          # Query building helpers
│   │   └── encryption.helper.ts     # Field encryption utilities
│   └── constants/
│       ├── enums.ts                 # All system enums
│       └── database.constants.ts    # Database-related constants
│
├── app.module.ts
└── main.ts

🛠️ Technical Requirements
1. Technology Stack

Framework: NestJS v10+
Database: PostgreSQL v14+
ORM: TypeORM v0.3+
Node.js: v18+
TypeScript: v5+

2. Database Design Principles

Use UUID for all primary keys
Implement soft deletes where appropriate (is_deleted, deleted_at fields)
Add audit fields (created_at, updated_at, created_by, updated_by)
Use JSONB for flexible data structures
Implement proper indexing on foreign keys and frequently queried fields
Use enums for fixed value sets
Implement check constraints for data validation
Use encryption for sensitive fields (national_id, tax_identification_number, etc.)

3. Entity Requirements

All entities must extend a BaseEntity with common fields
Use class-validator decorators for validation
Implement proper TypeORM decorators (@Entity, @Column, @ManyToOne, etc.)
Use @Index decorators for indexed fields
Implement cascade options carefully
Use lazy loading for heavy relationships
Add entity listeners for audit trails

4. Repository Pattern

Create a BaseRepository with common CRUD operations
Implement pagination methods
Add soft delete support
Include transaction support
Implement bulk operations
Add query builders for complex queries

5. Migration Requirements

Each migration must be reversible (up and down methods)
Migrations should be idempotent
Use proper naming convention: timestamp-Description.ts
Add indexes in separate migration after table creation
Include comments in migration files
Test both up and down migrations

6. Seeder Requirements

Create realistic test data
Ensure referential integrity
Support environment-based seeding (dev, staging, production)
Make seeders idempotent (can run multiple times)
Include at least:

2 subscribers (one bank, one supermarket)
5 users per subscriber with different roles
10 individual entities and 5 organization entities per subscriber
Complete list management data (countries, industries, occupations)
Sample screening and risk configurations




📝 Specific Implementation Instructions
A. Environment Configuration
Create .env.example and .env files with:
env# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=kyc_kyb_system
DB_SYNCHRONIZE=false
DB_LOGGING=true

# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key
ENCRYPTION_ALGORITHM=aes-256-cbc

# File Storage
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png
B. TypeORM Configuration
Create config/database.config.ts:
typescriptimport { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
  logging: configService.get('DB_LOGGING') === 'true',
  migrationsRun: false,
  ssl: configService.get('NODE_ENV') === 'production',
});
C. Base Entity
Create modules/common/entities/base.entity.ts:
typescriptimport {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
D. Enums Definition
Create utils/constants/enums.ts with ALL enums from the schema:
typescriptexport enum SubscriberType {
  BANK = 'BANK',
  SUPERMARKET = 'SUPERMARKET',
  FINANCIAL_INSTITUTION = 'FINANCIAL_INSTITUTION',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  REVIEWER = 'REVIEWER',
  AUDITOR = 'AUDITOR',
}

export enum EntityType {
  INDIVIDUAL = 'INDIVIDUAL',
  ORGANIZATION = 'ORGANIZATION',
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  ARCHIVED = 'ARCHIVED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ScreeningStatus {
  CLEAR = 'CLEAR',
  MATCH = 'MATCH',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum IDType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
}

export enum OrganizationType {
  CORPORATION = 'CORPORATION',
  LLC = 'LLC',
  PARTNERSHIP = 'PARTNERSHIP',
  NGO = 'NGO',
  TRUST = 'TRUST',
  FOUNDATION = 'FOUNDATION',
}

export enum ChangeType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

export enum FieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  URL = 'URL',
  EMAIL = 'EMAIL',
}

export enum IndividualRelationshipType {
  SPOUSE = 'SPOUSE',
  CHILD = 'CHILD',
  PARENT = 'PARENT',
  SIBLING = 'SIBLING',
  RELATIVE = 'RELATIVE',
  BUSINESS_PARTNER = 'BUSINESS_PARTNER',
  ASSOCIATE = 'ASSOCIATE',
  GUARDIAN = 'GUARDIAN',
  BENEFICIARY = 'BENEFICIARY',
}

export enum OrganizationRelationshipType {
  PARENT = 'PARENT',
  SUBSIDIARY = 'SUBSIDIARY',
  AFFILIATE = 'AFFILIATE',
  JOINT_VENTURE = 'JOINT_VENTURE',
  BRANCH = 'BRANCH',
  SISTER_COMPANY = 'SISTER_COMPANY',
  PARTNER = 'PARTNER',
}

export enum OwnershipType {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
  BENEFICIAL = 'BENEFICIAL',
}

export enum DocumentStatus {
  NEW = 'NEW',
  VALID = 'VALID',
  ABOUT_TO_EXPIRE = 'ABOUT_TO_EXPIRE',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

export enum AnalysisStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

export enum ScreeningResult {
  CLEAR = 'CLEAR',
  POTENTIAL_MATCH = 'POTENTIAL_MATCH',
  CONFIRMED_MATCH = 'CONFIRMED_MATCH',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export enum ReviewDecision {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ESCALATED = 'ESCALATED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  ACCEPTED = 'ACCEPTED',
  OVERRIDDEN = 'OVERRIDDEN',
}

export enum ConfigValueType {
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  JSON_ARRAY = 'JSON_ARRAY',
}

export enum ListScope {
  SUBSCRIBER_SPECIFIC = 'SUBSCRIBER_SPECIFIC',
  SYSTEM_WIDE = 'SYSTEM_WIDE',
}

export enum LogActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE_ENTITY = 'CREATE_ENTITY',
  UPDATE_ENTITY = 'UPDATE_ENTITY',
  DELETE_ENTITY = 'DELETE_ENTITY',
  SCREEN = 'SCREEN',
  RISK_ASSESS = 'RISK_ASSESS',
  UPLOAD_DOCUMENT = 'UPLOAD_DOCUMENT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  CONFIGURE = 'CONFIGURE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

export enum LogStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PARTIAL = 'PARTIAL',
  ERROR = 'ERROR',
}

export enum LogSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}
E. Base Repository
Create modules/common/repositories/base.repository.ts:
typescriptimport { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export class BaseRepository<T extends BaseEntity> extends Repository<T> {
  async findWithPagination(
    options: FindManyOptions<T>,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationResult<T>> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        current_page: page,
        total_pages,
        total_items: total,
        items_per_page: limit,
        has_next: page < total_pages,
        has_previous: page > 1,
      },
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.update(id as any, { deleted_at: new Date() } as any);
  }

  async restore(id: string): Promise<void> {
    await this.update(id as any, { deleted_at: null } as any);
  }

  async findActive(options?: FindManyOptions<T>): Promise<T[]> {
    return this.find({
      ...options,
      where: {
        ...options?.where,
        is_active: true,
        deleted_at: null as any,
      } as FindOptionsWhere<T>,
    });
  }
}

🎬 Execution Instructions for Cursor AI
Phase 1 Tasks:

Setup Project Structure

Create all folders and files according to the structure above
Install required dependencies
Configure TypeORM and environment variables


Create All Entities

Start with base entity
Create all 19 entities based on the Mermaid diagram
Implement proper decorators, relationships, and validation
Add indexes on foreign keys and frequently queried fields


Create All Migrations

Create 19 migration files (one per table)
Implement both up() and down() methods
Add a final migration for indexes and constraints
Ensure proper ordering and dependencies


Create All Repositories

Implement base repository with common methods
Create specific repositories for each entity
Add custom query methods where needed


Create Seeders

Implement 6 seeder files
Create realistic test data
Ensure data consistency and referential integrity
Make seeders idempotent


Create Utilities

Implement encryption helper for sensitive fields
Create transaction helper
Add query builder utilities


Testing

Run all migrations (up and down)
Execute seeders
Verify all relationships
Test repository methods




✅ Acceptance Criteria

 All 19 tables created with proper structure
 All migrations are reversible and tested
 All entities have proper TypeORM decorators and relationships
 All repositories implement base repository pattern
 Seeders create realistic test data with at least 2 subscribers
 Proper indexing on all foreign keys
 Encryption implemented for sensitive fields
 Environment configuration working
 No TypeScript errors
 Database can be fully migrated up and down
 All relationships work correctly (OneToOne, OneToMany, ManyToOne)


📦 Required Dependencies
json{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "dotenv": "^16.3.1",
    "crypto": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}

🚀 Final Notes

Focus ONLY on Phase 1 - database, entities, migrations, repositories, and seeders
Do NOT implement controllers, services, authentication, or API endpoints yet
Follow NestJS best practices and conventions
Use TypeScript strict mode
Add comprehensive comments in complex logic
Ensure all code is production-ready
Make the code maintainable and scalable