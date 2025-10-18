export const DATABASE_CONSTANTS = {
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_PAGE: 1,

  // Query limits
  MAX_QUERY_TIMEOUT: 30000, // 30 seconds
  BULK_INSERT_BATCH_SIZE: 1000,
  
  // Encryption
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  IV_LENGTH: 16,
  SALT_LENGTH: 32,
  TAG_LENGTH: 16,

  // Transaction isolation levels
  ISOLATION_LEVELS: {
    READ_UNCOMMITTED: 'READ UNCOMMITTED',
    READ_COMMITTED: 'READ COMMITTED',
    REPEATABLE_READ: 'REPEATABLE READ',
    SERIALIZABLE: 'SERIALIZABLE',
  } as const,

  // Common table names
  TABLES: {
    SUBSCRIBERS: 'subscribers',
    SUBSCRIBER_USERS: 'subscriber_users',
    ENTITIES: 'entities',
    ENTITY_HISTORY: 'entity_history',
    ENTITY_CUSTOM_FIELDS: 'entity_custom_fields',
    INDIVIDUAL_RELATIONSHIPS: 'individual_relationships',
    ORGANIZATION_RELATIONSHIPS: 'organization_relationships',
    ORGANIZATION_ASSOCIATIONS: 'organization_associations',
    DOCUMENTS: 'documents',
    SCREENING_ANALYSIS: 'screening_analysis',
    RISK_ANALYSIS: 'risk_analysis',
    SCREENING_CONFIG_VALUES: 'screening_config_values',
    RISK_CONFIGURATION: 'risk_configuration',
    LISTS_MANAGEMENT: 'lists_management',
    LIST_VALUES: 'list_values',
    LOGS: 'logs',
  } as const,

  // Common column names
  COLUMNS: {
    ID: 'id',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    DELETED_AT: 'deleted_at',
    IS_ACTIVE: 'is_active',
    SUBSCRIBER_ID: 'subscriber_id',
    ENTITY_ID: 'entity_id',
    USER_ID: 'user_id',
  } as const,
} as const;

export type DatabaseTable = typeof DATABASE_CONSTANTS.TABLES[keyof typeof DATABASE_CONSTANTS.TABLES];
export type DatabaseColumn = typeof DATABASE_CONSTANTS.COLUMNS[keyof typeof DATABASE_CONSTANTS.COLUMNS];
export type IsolationLevel = typeof DATABASE_CONSTANTS.ISOLATION_LEVELS[keyof typeof DATABASE_CONSTANTS.ISOLATION_LEVELS];