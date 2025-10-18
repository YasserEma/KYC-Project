Complete Enhanced Database Description for KYC/KYB Compliance System
Executive Summary
This database schema represents a multi-tenant KYC/KYB compliance platform designed to enable organizations (subscribers) to onboard individuals and organizations, perform automated sanctions screening, execute risk assessments, manage documents, and maintain complete audit trails. The design emphasizes data isolation, configurability, versioning, relationship mapping, and comprehensive history tracking.
Key Design Principles
Multi-Tenancy with Complete Isolation: All data is scoped to subscribers with strict tenant boundaries.
Versioned Configuration Management: Screening and risk configurations support versioning for complete audit trails of rule changes.
Consolidated Relationship Model: Organization-individual associations are unified in a single flexible table to accommodate diverse and future relationship types.
Comprehensive History Tracking: All entity changes are recorded as transactional events, capturing all fields modified in a single operation.
Custom Field Support: A flexible key-value schema (ENTITY_CUSTOM_FIELDS) allows for jurisdiction-specific or business-specific data requirements without altering the core schema.
Snapshot Architecture: Analysis records are immutable, storing point-in-time snapshots of both the configuration rules and the entity data used, ensuring perfect auditability.
Flexible List Management: All reference data (e.g., countries, occupations) is managed through centrally defined, reusable lists that are logically referenced by the risk engine.

Section A: Core System & Subscriber Management
1. SUBSCRIBERS Table
Purpose: Represents the top-level tenant organizations using the compliance platform. Each subscriber is an independent customer (e.g., bank, retail chain, financial institution) with completely isolated data.
Attributes:
id (UUID, Primary Key): Unique identifier for the subscriber
username (String, Unique, Not Null): Login identifier for the subscriber's admin account
email (String, Unique, Not Null): Primary contact email for the subscriber organization
password (String, Not Null, Hashed): Encrypted authentication credential for subscriber admin
type (Enum, Not Null): Organization type - BANK, SUPERMARKET, FINANCIAL_INSTITUTION, ENTERPRISE
contact_person_name (String): Full name of the primary point of contact
contact_person_phone (String): Contact person's phone number
subscription_tier (String): Service level - BASIC, PREMIUM, ENTERPRISE
subscription_valid_from (Date): Start date of current subscription period
subscription_valid_until (Date): End date of current subscription period
jurisdiction (String): Primary regulatory jurisdiction (ISO 3166-1 alpha-2 country code)
is_active (Boolean, Default: true): Whether the subscriber account is active
created_at (Timestamp, Not Null): Registration timestamp
updated_at (Timestamp, Not Null): Last modification timestamp
Relationships:
One-to-Many with SUBSCRIBER_USERS
One-to-Many with ENTITIES
One-to-Many with LOGS
One-to-Many with SCREENING_CONFIGURATION
One-to-Many with RISK_CONFIGURATION
One-to-Many with LISTS_MANAGEMENT
2. SUBSCRIBER_USERS Table
Purpose: Represents individual users who operate within a subscriber's account. These are employees or authorized personnel performing KYC/KYB operations, reviews, and system administration.
Attributes:
id (UUID, Primary Key): Unique user identifier
subscriber_id (UUID, Foreign Key → SUBSCRIBERS, Not Null, Indexed): Parent subscriber
name (String, Not Null): Full name of the user
email (String, Not Null): User's email address (unique within subscriber)
phone_number (String): Contact phone number
role (Enum, Not Null): User role - ADMIN, ANALYST, REVIEWER, AUDITOR
password (String, Not Null, Hashed): Encrypted authentication credential
is_active (Boolean, Not Null, Default: true): Whether user account is active
last_login (Timestamp): Most recent successful login timestamp
created_at (Timestamp, Not Null): User creation timestamp
created_by (UUID, Foreign Key → SUBSCRIBER_USERS, Nullable): User who created this account (self-reference)
permissions (JSONB, Not Null, Default: []): Array of granular permission strings (e.g., ["create_entity", "view_entity", "screen_entity", "review_screening"])
Relationships:
Many-to-One with SUBSCRIBERS
Many-to-One with SUBSCRIBER_USERS (self-reference for created_by)
One-to-Many with ENTITIES (as creator/updater)
One-to-Many with DOCUMENTS (as uploader/verifier)
One-to-Many with SCREENING_ANALYSIS (as performer/reviewer)
One-to-Many with RISK_ANALYSIS (as performer/reviewer)
One-to-Many with ENTITY_HISTORY (as change recorder)
One-to-Many with LOGS
3. LOGS Table
Purpose: Comprehensive audit trail capturing all system actions, user activities, configuration changes, and access events for compliance, security monitoring, and forensic analysis.
Attributes:
id (UUID, Primary Key): Unique log entry identifier
subscriber_id (UUID, Foreign Key → SUBSCRIBERS, Not Null, Indexed): Associated subscriber
user_id (UUID, Foreign Key → SUBSCRIBER_USERS, Nullable, Indexed): User who performed action (null for system-initiated actions)
timestamp (Timestamp, Not Null, Indexed): When action occurred (millisecond precision for correlation)
action_type (String, Not Null, Indexed): Category of action - LOGIN, LOGOUT, CREATE_ENTITY, UPDATE_ENTITY, DELETE_ENTITY, SCREEN, RISK_ASSESS, UPLOAD_DOCUMENT, APPROVE, REJECT, CONFIGURE, EXPORT, IMPORT
entity_type (String, Indexed): Type of resource acted upon - ENTITY, DOCUMENT, USER, CONFIGURATION, LIST
entity_id (String): Identifier of the specific record affected
action_description (Text, Not Null): Human-readable description of what happened
ip_address (String): Source IP address of the request
user_agent (Text): Browser/client user agent string
request_data (JSONB): Request payload or parameters (sanitized of sensitive data like passwords)
response_data (JSONB): Response outcome data
status (Enum): Action outcome - SUCCESS, FAILURE, PARTIAL, ERROR
error_message (Text): Detailed error information if action failed
session_id (String): User session identifier for request correlation
affected_fields (JSONB): Array of field-level changes with before/after values
severity (Enum): Log severity level - INFO, WARNING, ERROR, CRITICAL
Relationships:
Many-to-One with SUBSCRIBERS
Many-to-One with SUBSCRIBER_USERS

Section B: Core Entity Model
4. ENTITIES Table
Purpose: Central table representing all subjects undergoing compliance verification. Acts as the base entity for both individuals (KYC) and organizations (KYB), serving as the primary hub for all compliance activities.
Attributes:
id (UUID, Primary Key): Unique entity identifier
subscriber_id (UUID, Foreign Key → SUBSCRIBERS, Not Null, Indexed): Owning subscriber
entity_type (Enum, Not Null): Type of entity - INDIVIDUAL, ORGANIZATION
name (String, Not Null, Indexed): Entity name (individual's full name or organization's name)
reference_number (String, Unique, Not Null, Indexed): Auto-generated reference (format: KYC-YYYY-#### for individuals, KYB-YYYY-#### for organizations)
status (Enum, Not Null, Default: PENDING): Current status - ACTIVE, INACTIVE, PENDING, BLOCKED, ARCHIVED
created_at (Timestamp, Not Null): Entity creation timestamp
created_by (UUID, Foreign Key → SUBSCRIBER_USERS, Not Null): User who created the entity
updated_at (Timestamp, Not Null): Last modification timestamp
updated_by (UUID, Foreign Key → SUBSCRIBER_USERS): User who last updated the entity
risk_level (Enum): Current overall risk level - LOW, MEDIUM, HIGH, CRITICAL
screening_status (Enum): Current screening status - CLEAR, MATCH, PENDING_REVIEW, APPROVED, REJECTED
onboarding_completed (Boolean, Not Null, Default: false): Whether the onboarding process is complete
onboarded_at (Timestamp): Timestamp when onboarding was completed
last_screened_at (Timestamp): Most recent screening execution timestamp
last_risk_assessed_at (Timestamp): Most recent risk assessment execution timestamp
Relationships:
Many-to-One with SUBSCRIBERS
Many-to-One with SUBSCRIBER_USERS (created_by, updated_by)
One-to-One with INDIVIDUAL_ENTITIES (optional, when entity_type = INDIVIDUAL)
One-to-One with ORGANIZATION_ENTITIES (optional, when entity_type = ORGANIZATION)
One-to-Many with DOCUMENTS
One-to-Many with SCREENING_ANALYSIS
One-to-Many with RISK_ANALYSIS
One-to-Many with ENTITY_HISTORY
One-to-Many with ENTITY_CUSTOM_FIELDS
5. INDIVIDUAL_ENTITIES Table
Purpose: Stores detailed personal information specific to individual persons undergoing KYC processes. Extends the base ENTITIES table with person-specific attributes required for identity verification and compliance.
Attributes:
id (UUID, Primary Key): Unique identifier
entity_id (UUID, Foreign Key → ENTITIES, Unique, Not Null): Reference to parent entity (one-to-one relationship)
date_of_birth (Date, Not Null): Birth date
nationality (JSONB, Not Null, Default: []): Array of nationalities (ISO 3166-1 alpha-2 country codes, supports multiple citizenships)
country_of_residence (JSONB, Default: []): Array of residence countries (ISO codes, supports multiple residences)
gender (Enum): Gender - MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
address (Text): Current residential address (full address string)
occupation (String): Current occupation or profession
national_id (String, Encrypted): National identification number (encrypted at rest)
id_type (String): Type of identification document - PASSPORT, NATIONAL_ID, DRIVERS_LICENSE
id_expiry_date (Date): ID document expiration date
source_of_income (String): Primary income source category
is_pep (Boolean, Not Null, Default: false): Politically Exposed Person status
has_criminal_record (Boolean, Not Null, Default: false): Criminal record self-declaration
pep_details (Text): Detailed information if PEP status is true
criminal_record_details (Text): Details about criminal record if applicable
Relationships:
One-to-One with ENTITIES
One-to-Many with INDIVIDUAL_RELATIONSHIPS (as primary_individual)
One-to-Many with INDIVIDUAL_RELATIONSHIPS (as related_individual)
One-to-Many with ORGANIZATION_ASSOCIATIONS (as individual party)
6. ORGANIZATION_ENTITIES Table
Purpose: Stores detailed information specific to organizations/companies undergoing KYB processes. Extends the base ENTITIES table with organization-specific attributes required for corporate verification and compliance.
Attributes:
id (UUID, Primary Key): Unique identifier
entity_id (UUID, Foreign Key → ENTITIES, Unique, Not Null): Reference to parent entity (one-to-one relationship)
legal_name (String, Not Null): Official registered legal name
trade_name (String): Trading name or DBA (Doing Business As) name
country_of_incorporation (String, Not Null): Registration country (ISO 3166-1 alpha-2 code)
date_of_incorporation (Date, Not Null): Company registration date
organization_type (String): Type of organization - CORPORATION, LLC, PARTNERSHIP, NGO, TRUST, FOUNDATION
legal_structure (String): Detailed legal structure information
tax_identification_number (String, Encrypted): Tax ID or EIN (encrypted at rest)
commercial_registration_number (String): Registration number with government authorities
registered_address (Text): Official registered address
operating_address (Text): Actual operating/business address (if different from registered)
contact_email (String): Primary business contact email
contact_phone (String): Primary business contact phone
industry_sector (String): Business sector/industry classification (e.g., NAICS/SIC code)
number_of_employees (Integer): Employee count or range
annual_revenue (Decimal): Estimated or reported annual revenue
Relationships:
One-to-One with ENTITIES
One-to-Many with ORGANIZATION_RELATIONSHIPS (as primary_organization)
One-to-Many with ORGANIZATION_RELATIONSHIPS (as related_organization)
One-to-Many with ORGANIZATION_ASSOCIATIONS (as organization party)
7. ENTITY_HISTORY Table
Purpose: Tracks all changes made to entities over time, providing complete audit trail and ability to view historical states. Every modification to entity data creates a history record.
Attributes:
id (UUID, Primary Key): Unique history record identifier
entity_id (UUID, Foreign Key → ENTITIES, Not Null, Indexed): Related entity
changed_at (Timestamp, Not Null, Indexed): When the change occurred (millisecond precision)
changed_by (UUID, Foreign Key → SUBSCRIBER_USERS, Not Null): User who made the change
change_type (Enum, Not Null): Type of change - UPDATE, STATUS_CHANGE, CREATE
changes (JSONB, Not Null): Array of objects detailing each field change with structure:
JSON
  [
    {
      "field": "address",
      "old_value": "123 Main St",
      "new_value": "456 Oak Ave",
      "data_type": "TEXT"
    },
    {
      "field": "risk_level",
      "old_value": "MEDIUM",
      "new_value": "LOW",
      "data_type": "ENUM"
    }
  ]

change_description (Text): Human-readable summary of the event (e.g., "Updated residential address and risk level based on latest assessment")
ip_address (String): IP address of the user who made the change
user_agent (Text): Browser/client information
Relationships:
Many-to-One with ENTITIES
Many-to-One with SUBSCRIBER_USERS (changed_by)
8. ENTITY_CUSTOM_FIELDS Table
Purpose: Stores flexible key-value pairs defined by subscribers for entity-specific data collection beyond standard schema fields. Enables jurisdiction-specific or industry-specific data requirements without schema modifications.
Attributes:
id (UUID, Primary Key): Unique custom field record identifier
entity_id (UUID, Foreign Key → ENTITIES, Not Null, Indexed): Associated entity
field_key (String, Not Null, Indexed): Custom field name/identifier (e.g., "annual_income", "investment_experience")
field_value (Text): Custom field value (can store JSON for complex types)
field_type (Enum, Not Null): Data type - TEXT, NUMBER, DATE, BOOLEAN, JSON, URL, EMAIL
field_category (String): Grouping category - COMPLIANCE, BUSINESS, REGULATORY, FINANCIAL, PERSONAL
is_sensitive (Boolean, Not Null, Default: false): Whether field contains sensitive data requiring encryption
created_at (Timestamp, Not Null): When field was added
created_by (UUID, Foreign Key → SUBSCRIBER_USERS, Not Null): User who added the field
updated_at (Timestamp, Not Null): Last modification timestamp
updated_by (UUID, Foreign Key → SUBSCRIBER_USERS): User who last updated the field
Relationships:
Many-to-One with ENTITIES
Many-to-One with SUBSCRIBER_USERS (created_by, updated_by)

Section C: Entity Relationships
9. INDIVIDUAL_RELATIONSHIPS Table
Purpose: Manages relationships between individual entities (e.g., family members, relatives, business associates) to support comprehensive due diligence and network analysis.
Attributes:
id (UUID, Primary Key): Unique relationship identifier
primary_individual_id (UUID, Foreign Key → INDIVIDUAL_ENTITIES, Not Null, Indexed): Primary individual in the relationship
related_individual_id (UUID, Foreign Key → INDIVIDUAL_ENTITIES, Not Null, Indexed): Related individual
relationship_type (Enum, Not Null): Nature of relationship - SPOUSE, CHILD, PARENT, SIBLING, RELATIVE, BUSINESS_PARTNER, ASSOCIATE, GUARDIAN, BENEFICIARY
relationship_description (Text): Additional details about the relationship
effective_from (Date, Not Null): When relationship started or was established
effective_to (Date): When relationship ended (null if current/ongoing)
is_active (Boolean, Not Null, Default: true): Current status of relationship
verified (Boolean, Not Null, Default: false): Whether relationship has been verified through documentation
verified_by (UUID, Foreign Key → SUBSCRIBER_USERS): User who verified the relationship
verified_at (Timestamp): Verification timestamp
created_at (Timestamp, Not Null): Record creation timestamp
created_by (UUID, Foreign Key → SUBSCRIBER_USERS, Not Null): User who created the relationship record
Relationships:
Many-to-One with INDIVIDUAL_ENTITIES (primary_individual_id)
Many-to-One with INDIVIDUAL_ENTITIES (related_individual_id)
Many-to-One with SUBSCRIBER_USERS (created_by, verified_by)
10. ORGANIZATION_RELATIONSHIPS Table
Purpose: Manages relationships between organization entities (e.g., parent companies, subsidiaries, affiliates) to map corporate structures and ownership chains.
Attributes:
id (UUID, Primary Key): Unique relationship identifier
primary_organization_id (UUID, Foreign Key → ORGANIZATION_ENTITIES, Not Null, Indexed): Primary organization in the relationship
related_organization_id (UUID, Foreign Key → ORGANIZATION_ENTITIES, Not Null, Indexed): Related organization
relationship_type (Enum, Not Null): Nature of relationship - PARENT, SUBSIDIARY, AFFILIATE, JOINT_VENTURE, BRANCH, SISTER_COMPANY, PARTNER
ownership_percentage (Decimal, Nullable): Ownership stake (0-100, nullable for non-ownership relationships)
relationship_description (Text): Additional details about the relationship
effective_from (Date, Not Null): When relationship started
effective_to (Date): When relationship ended (null if current)
is_active (Boolean, Not Null, Default: true): Current status of relationship
verified (Boolean, Not Null, Default: false): Whether relationship has been verified
verified_by (UUID, Foreign Key → SUBSCRIBER_USERS): User who verified the relationship
verified_at (Timestamp): Verification timestamp
created_at (Timestamp, Not Null): Record creation timestamp
created_by (UUID, Foreign Key → SUBSCRIBER_USERS, Not Null): User who created the record
Relationships:
Many-to-One with ORGANIZATION_ENTITIES (primary_organization_id)
Many-to-One with ORGANIZATION_ENTITIES (related_organization_id)
Many-to-One with SUBSCRIBER_USERS (created_by, verified_by)
11. ORGANIZATION_ASSOCIATIONS Table (Consolidated/Merged Table)
Purpose: CRITICAL DESIGN CHANGE - This table consolidates what were previously two separate concepts (beneficial ownership and management) into a single flexible association table. It represents all types of relationships between organizations and individuals, including ownership, control, and management positions.
Attributes:
id (UUID, Primary Key): Unique association identifier
organization_entity_id (UUID, Foreign Key → ORGANIZATION_ENTITIES, Not Null, Indexed): The organization
individual_entity_id (UUID, Foreign Key → INDIVIDUAL_ENTITIES, Not Null, Indexed): The individual
relationship_type (String, Not Null): Flexible relationship descriptor - Examples include:
Ownership types: UBO, SHAREHOLDER, BENEFICIAL_OWNER, TRUSTEE, SETTLOR
Management types: CEO, CFO, COO, DIRECTOR, MANAGER, BOARD_MEMBER, SECRETARY, TREASURER
Hybrid types: CEO_SHAREHOLDER, DIRECTOR_UBO
ownership_percentage (Decimal): Ownership stake (0-100, nullable)
ownership_type (Enum): Type of ownership - DIRECT, INDIRECT, BENEFICIAL (nullable)
position_title (String): Job title or position name (nullable)
has_signing_authority (Boolean, Default: false): Whether individual can sign on behalf of organization (nullable)
start_date (Date, Not Null): When association began
end_date (Date): When association ended (null if current)
is_active (Boolean, Not Null, Default: true): Current status
verified (Boolean, Not Null, Default: false): Whether association has been verified
verified_by (UUID, Foreign Key → SUBSCRIBER_USERS): User who verified
verified_at (Timestamp): Verification timestamp
notes (Text): Additional contextual information
created_at (Timestamp, Not Null): Record creation timestamp
created_by (UUID, Foreign Key → SUBSCRIBER_USERS, Not Null): User who created the record
Relationships:
Many-to-One with ORGANIZATION_ENTITIES
Many-to-One with INDIVIDUAL_ENTITIES
Many-to-One with SUBSCRIBER_USERS (created_by, verified_by)

Section D: Analysis & Documents
12. DOCUMENTS Table
Purpose: Provides a centralized and secure repository for all documents uploaded for entity verification. It manages the lifecycle, metadata, and verification status of each document, such as passports, articles of incorporation, or utility bills.
Attributes:
id (UUID, Primary Key): Unique document identifier.
entity_id (UUID, Foreign Key → ENTITIES, Not Null): The entity this document belongs to.
document_type (String, Not Null): Type of document (e.g., "PASSPORT", "NATIONAL_ID", "UTILITY_BILL", "ARTICLES_OF_INCORPORATION").
file_name (String): Original name of the uploaded file.
file_path (String, Encrypted): A secure, encrypted reference to the file's location in a protected storage system (e.g., S3 path), not a direct file path.
file_size (Integer): File size in bytes.
mime_type (String): The MIME type of the file (e.g., "application/pdf", "image/jpeg").
file_hash (String): A SHA-256 hash of the file contents to ensure integrity and detect tampering.
expiry_date (Date, Nullable): Expiration date of the document, if applicable (indexed for quick queries on expiring documents).
issue_date (Date): Issue date of the document.
document_number (String, Encrypted): The ID number of the document (e.g., passport number), encrypted at rest.
issuing_authority (String): The authority that issued the document (e.g., "US Department of State").
issuing_country (String): ISO 3166-1 alpha-2 code of the issuing country.
status (Enum, Not Null): The current state of the document in its lifecycle - NEW, PENDING_REVIEW, VALID, REJECTED, ABOUT_TO_EXPIRE, EXPIRED.
uploaded_at (Timestamp): When the document was uploaded.
uploaded_by (UUID, Foreign Key → SUBSCRIBER_USERS): The user who uploaded the document.
verified_at (Timestamp): When the document was verified.
verified_by (UUID, Foreign Key → SUBSCRIBER_USERS): The user who performed the verification.
verification_notes (Text): Notes from the verifier.
is_deleted (Boolean, Default: false): Soft delete flag.
deleted_at (Timestamp): Timestamp of soft deletion.
deleted_by (UUID, Foreign Key → SUBSCRIBER_USERS): The user who deleted the document.
Relationships:
Many-to-One with ENTITIES
Many-to-One with SUBSCRIBER_USERS (uploaded_by, verified_by, deleted_by)
13. SCREENING_ANALYSIS Table
Purpose: To store the immutable, auditable results of every screening operation. Each record is a self-contained "capsule" that captures the result, the entity data used, and the exact configuration applied, creating a perfect historical record for compliance and auditing.
Attributes:
id (UUID, Primary Key): Unique analysis identifier.
entity_id (UUID, Foreign Key → ENTITIES, Not Null): The entity that was screened.
screening_date (Timestamp, Not Null, Indexed): When the screening was executed.
screening_type (String): The type of screening performed (e.g., "SANCTIONS", "PEP", "ADVERSE_MEDIA").
performed_by (UUID, Foreign Key → SUBSCRIBER_USERS, Nullable): The user who initiated the screening (null for automated processes).
entity_snapshot (JSONB, Not Null): A JSON snapshot of the key entity data (e.g., name, DOB, nationality) at the exact moment of screening.
configuration_snapshot (JSONB, Not Null): A JSON snapshot of the SCREENING_CONFIGURATION and SCREENING_CONFIG_VALUES used for this specific screening.
status (Enum): The status of the screening job itself - IN_PROGRESS, COMPLETED, FAILED.
overall_result (Enum): The final compliance outcome of the screening - CLEAR, POTENTIAL_MATCH, CONFIRMED_MATCH.
best_match_score (Decimal): The highest confidence score (0-100) of any match found.
match_details (JSONB): A detailed array of all potential matches found, including the matched name, list source, and individual score.
reviewed_at (Timestamp): Timestamp of the human review.
reviewed_by (UUID, Foreign Key → SUBSCRIBER_USERS): The user who reviewed the POTENTIAL_MATCH.
review_decision (Enum): The decision made by the reviewer - APPROVED, REJECTED, ESCALATED, FALSE_POSITIVE.
review_notes (Text): Comments from the reviewer.
is_automatic (Boolean): Flag indicating if the screening was triggered automatically (e.g., by a scheduler or an entity update).
Relationships:
Many-to-One with ENTITIES
Many-to-One with SUBSCRIBER_USERS (performed_by, reviewed_by)
14. RISK_ANALYSIS Table
Purpose: To store the immutable, auditable results of every risk assessment. Similar to SCREENING_ANALYSIS, each record is a self-contained historical document capturing the calculated risk score, the entity data used, and the exact risk rules applied.
Attributes:
id (UUID, Primary Key): Unique analysis identifier.
entity_id (UUID, Foreign Key → ENTITIES, Not Null): The entity that was assessed.
analysis_date (Timestamp, Not Null, Indexed): When the assessment was executed.
performed_by (UUID, Foreign Key → SUBSCRIBER_USERS, Nullable): User who initiated the assessment (null for automated processes).
entity_snapshot (JSONB, Not Null): A JSON snapshot of the entity data and its relationships at the exact moment of analysis.
rule_configuration_snapshot (JSONB, Not Null): A JSON snapshot of the RISK_CONFIGURATION (including the risk_rules JSON) used for this specific assessment.
status (Enum): The status of the assessment job itself - IN_PROGRESS, COMPLETED, FAILED.
overall_risk_score (Decimal): The final calculated numerical risk score.
risk_level (Enum): The categorical risk level derived from the score - LOW, MEDIUM, HIGH, CRITICAL.
contributing_factors (JSONB): An array of factors that increased the risk score (e.g., "Nationality is on High-Risk Country list").
rules_applied (JSONB): A log of which specific rules were triggered during the assessment.
reviewed_at (Timestamp): Timestamp of a manual review or override.
reviewed_by (UUID, Foreign Key → SUBSCRIBER_USERS): User who reviewed or overrode the score.
review_decision (Enum): Decision of the reviewer - ACCEPTED, OVERRIDDEN, ESCALATED.
manual_override_score (Decimal, Nullable): If the score was manually changed, the new score is stored here.
review_notes (Text): Justification for the review decision or override.
is_automatic (Boolean): Flag indicating if the assessment was triggered automatically.
Relationships:
Many-to-One with ENTITIES
Many-to-One with SUBSCRIBER_USERS (performed_by, reviewed_by)

Section E: Subscriber Configuration
15. SCREENING_CONFIGURATION Table
Purpose: Defines versioned "profiles" for screening operations. This allows a subscriber to create and manage different sets of screening settings for different purposes (e.g., one profile for individuals, another for organizations) and to track how these settings evolve over time.
Attributes:
id (UUID, Primary Key): Unique identifier for this specific version of the configuration.
config_profile_id (UUID, Not Null, Indexed): A shared identifier that groups all versions of the same profile together.
version (Integer, Not Null): The version number of this configuration (1, 2, 3...).
is_active (Boolean, Not Null): Flag indicating if this is the currently active version for this profile.
subscriber_id (UUID, Foreign Key → SUBSCRIBERS, Not Null): The subscriber who owns this configuration.
config_name (String, Not Null): A human-readable name for the profile (e.g., "Default Individual Screening").
entity_type (Enum, Not Null): The entity type this profile applies to - INDIVIDUAL, ORGANIZATION, ALL.
auto_screen_on_create (Boolean): Whether to trigger screening automatically when a new entity of this type is created.
re_screen_interval_days (Integer): The frequency in days for periodic, ongoing screening.
created_at (Timestamp): When this version was created.
created_by (UUID, Foreign Key → SUBSCRIBER_USERS): The user who created this version.
change_description (Text): A note explaining why this new version was created.
Relationships:
Many-to-One with SUBSCRIBERS
One-to-Many with SCREENING_CONFIG_VALUES
16. SCREENING_CONFIG_VALUES Table
Purpose: Stores the specific key-value parameter settings for a single version of a SCREENING_CONFIGURATION profile. This design provides maximum flexibility to add new settings in the future without altering the database schema.
Attributes:
id (UUID, Primary Key): Unique identifier for the setting value.
configuration_id (UUID, Foreign Key → SCREENING_CONFIGURATION, Not Null): The specific configuration version this setting belongs to.
config_key (String, Not Null): The name of the parameter (e.g., "matching_score", "enabled_lists").
config_value (String, Not Null): The value of the parameter (e.g., "85", '["SANCTIONS", "PEP"]').
value_type (Enum, Not Null): The data type of the value (NUMBER, BOOLEAN, STRING, JSON_ARRAY) to assist the application in parsing.
Relationships:
Many-to-One with SCREENING_CONFIGURATION
17. RISK_CONFIGURATION Table
Purpose: Defines versioned "profiles" for risk assessment. Unlike screening, where parameters are similar, risk profiles can contain completely different sets of rules and logic for different subscribers or entity types.
Attributes:
id (UUID, Primary Key): Unique identifier for this specific version of the configuration.
config_profile_id (UUID, Not Null, Indexed): A shared identifier that groups all versions of the same risk profile.
version (Integer, Not Null): The version number.
is_active (Boolean, Not Null): Flag indicating if this is the currently active version.
subscriber_id (UUID, Foreign Key → SUBSCRIBERS, Not Null): The owning subscriber.
config_name (String, Not Null): A human-readable name for the profile (e.g., "Retail Customer Risk Model").
entity_type (Enum, Not Null): The entity type this profile applies to - INDIVIDUAL, ORGANIZATION, ALL.
risk_rules (JSONB, Not Null): An array of JSON objects defining the entire risk logic. These rules can logically reference lists in LISTS_MANAGEMENT by name.
risk_thresholds (JSONB, Not Null): A JSON object defining the score ranges for each risk level (e.g., {"LOW": [0, 20], "MEDIUM": [21, 60]}).
auto_assess_on_create (Boolean): Whether to trigger risk assessment automatically on entity creation.
re_assess_interval_days (Integer): The frequency in days for periodic risk reassessment.
created_at (Timestamp): When this version was created.
created_by (UUID, Foreign Key → SUBSCRIBER_USERS): The user who created this version.
change_description (Text): A note explaining the reason for the new version.
Relationships:
Many-to-One with SUBSCRIBERS
18. LISTS_MANAGEMENT Table
Purpose: Acts as a directory or index for all reusable lists of reference data. This allows subscribers to create and manage their own lists (e.g., of high-risk countries, specific occupations, etc.) that can be used by the risk engine.
Attributes:
id (UUID, Primary Key): Unique identifier for the list.
subscriber_id (UUID, Foreign Key → SUBSCRIBERS, Not Null): The subscriber who owns this list.
list_name (String, Not Null): The unique, human-readable name of the list (e.g., "High-Risk Countries"). This name is used to logically reference the list from within risk_rules.
list_type (String, Not Null): The type of data in the list (e.g., "COUNTRY", "OCCUPATION", "INDUSTRY").
scope (Enum): The visibility of the list - SUBSCRIBER_SPECIFIC or SYSTEM_WIDE.
is_active (Boolean): Whether the list is currently active.
created_at (Timestamp): Creation timestamp.
created_by (UUID, Foreign Key → SUBSCRIBER_USERS): The user who created the list.
Relationships:
Many-to-One with SUBSCRIBERS
One-to-Many with LIST_VALUES
19. LIST_VALUES Table
Purpose: Stores the actual data entries or items for each list defined in LISTS_MANAGEMENT.
Attributes:
id (UUID, Primary Key): Unique identifier for the list value.
list_id (UUID, Foreign Key → LISTS_MANAGEMENT, Not Null): The list this value belongs to.
value_name (String, Not Null): The actual value of the item (e.g., "IR" for a country, "Arms Dealer" for an occupation).
value_description (Text): A description for the value.
is_active (Boolean): Whether this specific value is active.
weight (Decimal, Nullable): An optional numerical weight that can be used in risk calculations (e.g., a country might have a risk weight of 80).
metadata (JSONB): Any additional structured data associated with this value.
effective_from (Date): The date this value becomes effective.
effective_to (Date): The date this value expires.
Relationships:
Many-to-One with LISTS_MANAGEMENT

mermaid code is "%%{init: { 'theme': 'base', 'themeVariables': {
  'primaryColor': '#F4F6F6',
  'primaryTextColor': '#212F3D',
  'lineColor': '#5D6D7E',
  'fontSize': '16px',
  'clusterBkg': '#FAFAFA',
  'clusterBorder': '#AAB7B8'
}}}%%
erDiagram LR

    %% -------------------------------------
    %% VISUAL GROUPING & TABLE DEFINITIONS
    %% -------------------------------------

    subgraph "A. Core System & Subscriber"
        SUBSCRIBERS {
            uuid id PK
            string username UK "Unique login identifier"
            string email UK "Primary contact email"
            string password "Hashed password"
            enum type "BANK, SUPERMARKET, FINANCIAL_INSTITUTION, ENTERPRISE"
            string contact_person_name "Primary point of contact"
            string contact_person_phone "Contact's phone number"
            string subscription_tier "BASIC, PREMIUM, ENTERPRISE"
            date subscription_valid_from "Start date of current subscription"
            date subscription_valid_until "End date of current subscription"
            string jurisdiction "ISO country code"
            boolean is_active "Default true"
            timestamp created_at
            timestamp updated_at
        }
        SUBSCRIBER_USERS {
            uuid id PK
            uuid subscriber_id FK "References SUBSCRIBERS"
            string name "Full name"
            string email "Unique within subscriber"
            string phone_number
            enum role "ADMIN, ANALYST, REVIEWER, AUDITOR"
            string password "Hashed password"
            boolean is_active "Default true"
            timestamp last_login
            timestamp created_at
            uuid created_by FK "Self-reference"
            jsonb permissions "Array of permission strings"
        }
        LOGS {
            uuid id PK
            uuid subscriber_id FK "References SUBSCRIBERS"
            uuid user_id FK "References SUBSCRIBER_USERS, nullable for system"
            timestamp timestamp "Millisecond precision, indexed"
            string action_type "LOGIN, CREATE_ENTITY, SCREEN, etc"
            string entity_type "ENTITY, DOCUMENT, USER, etc"
            string entity_id "Affected record ID"
            text action_description
            string ip_address
            text user_agent
            jsonb request_data "Sanitized request payload"
            jsonb response_data "Response outcome"
            enum status "SUCCESS, FAILURE, PARTIAL, ERROR"
            text error_message
            string session_id "For correlation"
            jsonb affected_fields "Before/after values array"
            enum severity "INFO, WARNING, ERROR, CRITICAL"
        }
    end

    subgraph "B. Core Entity Model"
        ENTITIES {
            uuid id PK
            uuid subscriber_id FK "References SUBSCRIBERS"
            enum entity_type "INDIVIDUAL, ORGANIZATION"
            string name "Entity name"
            string reference_number UK "Auto-generated KYC/KYB-YYYY-####"
            enum status "ACTIVE, INACTIVE, PENDING, BLOCKED, ARCHIVED"
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
            timestamp updated_at
            uuid updated_by FK "References SUBSCRIBER_USERS"
            enum risk_level "LOW, MEDIUM, HIGH, CRITICAL"
            enum screening_status "CLEAR, MATCH, PENDING_REVIEW, APPROVED, REJECTED"
            boolean onboarding_completed "Default false"
            timestamp onboarded_at
            timestamp last_screened_at
            timestamp last_risk_assessed_at
        }
        INDIVIDUAL_ENTITIES {
            uuid id PK
            uuid entity_id FK, UK "References ENTITIES (1-to-1)"
            date date_of_birth
            jsonb nationality "Array of ISO country codes"
            jsonb country_of_residence "Array of ISO country codes"
            enum gender "MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY"
            text address
            string occupation
            string national_id "Encrypted"
            string id_type "PASSPORT, NATIONAL_ID, DRIVERS_LICENSE"
            date id_expiry_date
            string source_of_income
            boolean is_pep "Default false"
            boolean has_criminal_record "Default false"
            text pep_details
            text criminal_record_details
        }
        ORGANIZATION_ENTITIES {
            uuid id PK
            uuid entity_id FK, UK "References ENTITIES (1-to-1)"
            string legal_name
            string trade_name
            string country_of_incorporation "ISO code"
            date date_of_incorporation
            string organization_type "CORPORATION, LLC, PARTNERSHIP, NGO, etc"
            string legal_structure
            string tax_identification_number "Encrypted"
            string commercial_registration_number
            text registered_address
            text operating_address
            string contact_email
            string contact_phone
            string industry_sector
            integer number_of_employees
            decimal annual_revenue
        }
        ENTITY_HISTORY {
            uuid id PK
            uuid entity_id FK "References ENTITIES"
            timestamp changed_at "When change occurred"
            uuid changed_by FK "References SUBSCRIBER_USERS"
            enum change_type "UPDATE, STATUS_CHANGE, CREATE"
            jsonb changes "Array of objects detailing each field change"
            text change_description "Human-readable summary of the event"
            string ip_address
            text user_agent
        }
        ENTITY_CUSTOM_FIELDS {
            uuid id PK
            uuid entity_id FK "References ENTITIES"
            string field_key "Custom field name"
            text field_value "Can be JSON"
            enum field_type "TEXT, NUMBER, DATE, BOOLEAN, JSON, URL, EMAIL"
            string field_category "COMPLIANCE, BUSINESS, REGULATORY, etc"
            boolean is_sensitive "Default false, requires encryption"
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
            timestamp updated_at
            uuid updated_by FK "References SUBSCRIBER_USERS"
        }
    end

    subgraph "C. Entity Relationships"
        INDIVIDUAL_RELATIONSHIPS {
            uuid id PK
            uuid primary_individual_id FK "References INDIVIDUAL_ENTITIES"
            uuid related_individual_id FK "References INDIVIDUAL_ENTITIES"
            enum relationship_type "SPOUSE, CHILD, PARENT, SIBLING, RELATIVE, etc"
            text relationship_description
            date effective_from
            date effective_to "Nullable"
            boolean is_active "Default true"
            boolean verified "Default false"
            uuid verified_by FK "References SUBSCRIBER_USERS"
            timestamp verified_at
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
        }
        ORGANIZATION_RELATIONSHIPS {
            uuid id PK
            uuid primary_organization_id FK "References ORGANIZATION_ENTITIES"
            uuid related_organization_id FK "References ORGANIZATION_ENTITIES"
            enum relationship_type "PARENT, SUBSIDIARY, AFFILIATE, etc"
            decimal ownership_percentage "0-100, nullable"
            text relationship_description
            date effective_from
            date effective_to "Nullable"
            boolean is_active "Default true"
            boolean verified "Default false"
            uuid verified_by FK "References SUBSCRIBER_USERS"
            timestamp verified_at
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
        }
        %% --- UPDATED: Merged Table --- %%
        ORGANIZATION_ASSOCIATIONS {
            uuid id PK
            uuid organization_entity_id FK "References ORGANIZATION_ENTITIES"
            uuid individual_entity_id FK "References INDIVIDUAL_ENTITIES"
            string relationship_type "e.g. UBO, Shareholder, CEO, Director"
            
            %% Ownership-specific fields
            decimal ownership_percentage "Nullable"
            enum ownership_type "DIRECT, INDIRECT, BENEFICIAL, Nullable"
            
            %% Management-specific fields
            string position_title "Nullable"
            boolean has_signing_authority "Nullable, Default false"
            
            %% Common fields
            date start_date
            date end_date "Nullable"
            boolean is_active "Default true"
            boolean verified "Default false"
            uuid verified_by FK "References SUBSCRIBER_USERS"
            timestamp verified_at
            text notes
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
        }
    end

    subgraph "D. Analysis & Documents"
        DOCUMENTS {
            uuid id PK
            uuid entity_id FK "References ENTITIES"
            string document_type "PASSPORT, NATIONAL_ID, etc"
            string file_name
            string file_path "Encrypted storage reference"
            integer file_size "Bytes"
            string mime_type
            string file_hash "SHA-256 for integrity"
            date expiry_date "Nullable, indexed"
            date issue_date
            string document_number "Encrypted"
            string issuing_authority
            string issuing_country "ISO code"
            enum status "NEW, VALID, ABOUT_TO_EXPIRE, EXPIRED, REJECTED, PENDING_REVIEW"
            timestamp uploaded_at
            uuid uploaded_by FK "References SUBSCRIBER_USERS"
            timestamp verified_at
            uuid verified_by FK "References SUBSCRIBER_USERS"
            text verification_notes
            boolean is_deleted "Default false"
            timestamp deleted_at
            uuid deleted_by FK "References SUBSCRIBER_USERS"
        }
        SCREENING_ANALYSIS {
            uuid id PK
            uuid entity_id FK "References ENTITIES"
            timestamp screening_date "Indexed"
            string screening_type "SANCTIONS, PEP, ADVERSE_MEDIA, etc"
            uuid performed_by FK "References SUBSCRIBER_USERS"
            jsonb entity_snapshot "Snapshot of entity data at time of screening"
            jsonb configuration_snapshot "Snapshot of settings used for this screening"
            enum status "IN_PROGRESS, COMPLETED, FAILED, PENDING_REVIEW"
            enum overall_result "CLEAR, POTENTIAL_MATCH, CONFIRMED_MATCH, FALSE_POSITIVE"
            decimal best_match_score "0-100"
            decimal threshold_used
            integer total_matches_found
            integer qualifying_matches
            jsonb match_details "Detailed match info with scores"
            timestamp reviewed_at
            uuid reviewed_by FK "References SUBSCRIBER_USERS"
            enum review_decision "APPROVED, REJECTED, ESCALATED, FALSE_POSITIVE"
            text review_notes
            boolean is_automatic
        }
        RISK_ANALYSIS {
            uuid id PK
            uuid entity_id FK "References ENTITIES"
            timestamp analysis_date "Indexed"
            uuid performed_by FK "References SUBSCRIBER_USERS"
            jsonb entity_snapshot "Snapshot of entity data at time of analysis"
            jsonb rule_configuration_snapshot "Snapshot of risk rules used for this analysis"
            enum status "IN_PROGRESS, COMPLETED, FAILED, PENDING_REVIEW"
            decimal overall_risk_score "0-100"
            enum risk_level "LOW, MEDIUM, HIGH, CRITICAL"
            jsonb risk_category_scores "Category breakdowns with weights"
            jsonb contributing_factors "Array of risk increasers"
            jsonb mitigating_factors "Array of risk reducers"
            jsonb rules_applied "Rules evaluated with outcomes"
            timestamp reviewed_at
            uuid reviewed_by FK "References SUBSCRIBER_USERS"
            enum review_decision "ACCEPTED, OVERRIDDEN, ESCALATED"
            decimal manual_override_score "Nullable"
            text review_notes
            boolean is_automatic
        }
    end

    subgraph "E. Subscriber Configuration"
        SCREENING_CONFIGURATION {
            uuid id PK
            uuid config_profile_id "Groups all versions of a profile"
            integer version "Version number (1, 2, 3...)"
            boolean is_active "Indicates if this is the currently active version"
            uuid subscriber_id FK "References SUBSCRIBERS"
            string config_name "e.g., Default Individuals, High-Risk Orgs"
            enum entity_type "INDIVIDUAL, ORGANIZATION, ALL"
            boolean auto_screen_on_create "Default true"
            integer re_screen_interval_days "Default 30"
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
            text change_description "Reason for this new version"
        }
        SCREENING_CONFIG_VALUES {
            uuid id PK
            uuid configuration_id FK "References SCREENING_CONFIGURATION"
            string config_key UK "e.g., base_threshold, use_embeddings"
            string config_value "e.g., 85.0, true"
            enum value_type "NUMBER, BOOLEAN, STRING"
        }
        RISK_CONFIGURATION {
            uuid id PK
            uuid config_profile_id "Groups all versions of a profile"
            integer version "Version number (1, 2, 3...)"
            boolean is_active "Indicates if this is the currently active version"
            uuid subscriber_id FK "References SUBSCRIBERS"
            string config_name "e.g., Retail Risk Rules, Corporate Risk Rules"
            enum entity_type "INDIVIDUAL, ORGANIZATION, ALL"
            jsonb risk_rules "Array of rule objects that can reference lists by name"
            jsonb risk_thresholds "Score ranges for levels"
            boolean auto_assess_on_create "Default true"
            integer re_assess_interval_days "Default 90"
            boolean re_assess_on_screening "Default true"
            boolean enable_manual_override "Default true"
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
            text change_description "Reason for this new version"
        }
        LISTS_MANAGEMENT {
            uuid id PK
            uuid subscriber_id FK "References SUBSCRIBERS"
            string list_name "Unique per subscriber, referenced by risk rules"
            text description
            string list_type "COUNTRY, INDUSTRY, OCCUPATION, etc"
            enum scope "SUBSCRIBER_SPECIFIC, SYSTEM_WIDE"
            boolean is_active "Default true"
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
            timestamp updated_at
            uuid updated_by FK "References SUBSCRIBER_USERS"
        }
        LIST_VALUES {
            uuid id PK
            uuid list_id FK "References LISTS_MANAGEMENT"
            string value_name "The actual value"
            text value_description
            boolean is_active "Default true"
            decimal weight "Optional score"
            jsonb metadata "Type-specific data"
            date effective_from
            date effective_to "Nullable"
            timestamp created_at
            uuid created_by FK "References SUBSCRIBER_USERS"
            timestamp updated_at
            uuid updated_by FK "References SUBSCRIBER_USERS"
        }
    end

    %% --------------------------
    %% RELATIONSHIP DEFINITIONS
    %% --------------------------

    %% Core System Relationships
    SUBSCRIBERS ||--o{ SUBSCRIBER_USERS : "has users"
    SUBSCRIBERS ||--o{ ENTITIES : "owns"
    SUBSCRIBERS ||--o{ LOGS : "generates"
    SUBSCRIBERS ||--o{ SCREENING_CONFIGURATION : "configures"
    SUBSCRIBERS ||--o{ RISK_CONFIGURATION : "configures"
    SUBSCRIBERS ||--o{ LISTS_MANAGEMENT : "manages"
    
    %% Entity Relationships
    ENTITIES ||--o| INDIVIDUAL_ENTITIES : "extends to"
    ENTITIES ||--o| ORGANIZATION_ENTITIES : "extends to"
    ENTITIES ||--o{ DOCUMENTS : "has"
    ENTITIES ||--o{ SCREENING_ANALYSIS : "undergoes"
    ENTITIES ||--o{ RISK_ANALYSIS : "undergoes"
    ENTITIES ||--o{ ENTITY_HISTORY : "tracks changes"
    ENTITIES ||--o{ ENTITY_CUSTOM_FIELDS : "has custom data"
    
    %% --- UPDATED: Relationships for Merged Table --- %%
    INDIVIDUAL_ENTITIES ||--o{ INDIVIDUAL_RELATIONSHIPS : "primary individual"
    INDIVIDUAL_ENTITIES ||--o{ INDIVIDUAL_RELATIONSHIPS : "related individual"
    INDIVIDUAL_ENTITIES ||--o{ ORGANIZATION_ASSOCIATIONS : "is associated with"
    
    ORGANIZATION_ENTITIES ||--o{ ORGANIZATION_RELATIONSHIPS : "primary organization"
    ORGANIZATION_ENTITIES ||--o{ ORGANIZATION_RELATIONSHIPS : "related organization"
    ORGANIZATION_ENTITIES ||--o{ ORGANIZATION_ASSOCIATIONS : "has associations"
    
    %% Configuration Relationships
    SCREENING_CONFIGURATION ||--o{ SCREENING_CONFIG_VALUES : "has settings"
    LISTS_MANAGEMENT ||--o{ LIST_VALUES : "contains"

    %% User Activity Relationships
    SUBSCRIBER_USERS ||--o{ ENTITIES : "creates/updates"
    SUBSCRIBER_USERS ||--o{ DOCUMENTS : "uploads/verifies"
    SUBSCRIBER_USERS ||--o{ SCREENING_ANALYSIS : "performs/reviews"
    SUBSCRIBER_USERS ||--o{ RISK_ANALYSIS : "performs/reviews"
    SUBSCRIBER_USERS ||--o{ ENTITY_HISTORY : "records changes"
    SUBSCRIBER_USERS ||--o{ ENTITY_CUSTOM_FIELDS : "creates/updates"
    SUBSCRIBER_USERS ||--o{ INDIVIDUAL_RELATIONSHIPS : "creates/verifies"
    SUBSCRIBER_USERS ||--o{ ORGANIZATION_RELATIONSHIPS : "creates/verifies"
    SUBSCRIBER_USERS ||--o{ ORGANIZATION_ASSOCIATIONS : "creates/verifies"
    SUBSCRIBER_USERS ||--o{ LOGS : "generates"
    SUBSCRIBER_USERS ||--o{ LISTS_MANAGEMENT : "creates/manages"
    SUBSCRIBER_USERS ||--o{ LIST_VALUES : "creates/updates"
    SUBSCRIBER_USERS ||--o{ SCREENING_CONFIGURATION : "configures"
    SUBSCRIBER_USERS ||--o{ RISK_CONFIGURATION : "configures"

    %% --------------------------
    %% STYLING DEFINITIONS
    %% --------------------------
    
    style SUBSCRIBERS fill:#EBF5FB,stroke:#85C1E9,color:black
    style SUBSCRIBER_USERS fill:#EBF5FB,stroke:#85C1E9,color:black
    style LOGS fill:#EBF5FB,stroke:#85C1E9,color:black
    
    style ENTITIES fill:#E8F8F5,stroke:#7DCEA0,color:black
    style INDIVIDUAL_ENTITIES fill:#E8F8F5,stroke:#7DCEA0,color:black
    style ORGANIZATION_ENTITIES fill:#E8F8F5,stroke:#7DCEA0,color:black
    style ENTITY_HISTORY fill:#E8F8F5,stroke:#7DCEA0,color:black
    style ENTITY_CUSTOM_FIELDS fill:#E8F8F5,stroke:#7DCEA0,color:black
    
    %% --- UPDATED: Styling for Merged Table --- %%
    style INDIVIDUAL_RELATIONSHIPS fill:#FEF9E7,stroke:#F8C471,color:black
    style ORGANIZATION_RELATIONSHIPS fill:#FEF9E7,stroke:#F8C471,color:black
    style ORGANIZATION_ASSOCIATIONS fill:#FEF9E7,stroke:#F8C471,color:black

    style DOCUMENTS fill:#F4ECF7,stroke:#C39BD3,color:black
    style SCREENING_ANALYSIS fill:#F4ECF7,stroke:#C39BD3,color:black
    style RISK_ANALYSIS fill:#F4ECF7,stroke:#C39BD3,color:black

    style SCREENING_CONFIGURATION fill:#E6F2F8,stroke:#83B6D3,color:black
    style SCREENING_CONFIG_VALUES fill:#E6F2F8,stroke:#83B6D3,color:black
    style RISK_CONFIGURATION fill:#E6F2F8,stroke:#83B6D3,color:black
    style LISTS_MANAGEMENT fill:#E6F2F8,stroke:#83B6D3,color:black
    style LIST_VALUES fill:#E6F2F8,stroke:#83B6D3,color:black"