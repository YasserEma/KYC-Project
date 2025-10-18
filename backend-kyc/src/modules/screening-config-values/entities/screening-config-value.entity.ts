import { Entity, Column, ManyToOne, JoinColumn, Index, VirtualColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { SubscriberEntity } from '../../subscribers/entities/subscriber.entity';
import { SubscriberUserEntity } from '../../subscriber-users/entities/subscriber-user.entity';

@Entity('screening_config_values')
@Index(['subscriber_id', 'config_key'])
@Index(['subscriber_id', 'config_category'])
@Index(['subscriber_id', 'config_key', 'is_active'])
@Index(['subscriber_id', 'config_category', 'is_active'])
@Index(['config_key', 'is_system_config'])
@Index(['config_category', 'is_system_config'])
@Index(['is_active', 'is_system_config'])
@Index(['effective_date', 'expiry_date'])
@Index(['created_at'])
@Index(['updated_at'])
export class ScreeningConfigValueEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  subscriber_id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  config_key: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  config_category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  config_subcategory: string;

  @Column({ type: 'varchar', length: 255 })
  config_name: string;

  @Column({ type: 'text', nullable: true })
  config_description: string;

  @Column({ type: 'varchar', length: 50 })
  config_type: string; // string, number, boolean, json, array, date, enum

  @Column({ type: 'jsonb', nullable: true })
  config_value: any;

  @Column({ type: 'jsonb', nullable: true })
  default_value: any;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  @Index()
  status: string; // active, inactive, deprecated, pending

  @Column({ type: 'varchar', length: 50, default: 'medium' })
  priority: string; // low, medium, high, critical

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_system_config: boolean;

  @Column({ type: 'boolean', default: false })
  is_readonly: boolean;

  @Column({ type: 'boolean', default: false })
  is_encrypted: boolean;

  @Column({ type: 'boolean', default: false })
  is_sensitive: boolean;

  @Column({ type: 'boolean', default: false })
  requires_approval: boolean;

  @Column({ type: 'boolean', default: false })
  requires_restart: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  validation_type: string; // regex, range, enum, custom

  @Column({ type: 'jsonb', nullable: true })
  validation_rules: any;

  @Column({ type: 'text', nullable: true })
  validation_error_message: string;

  @Column({ type: 'jsonb', nullable: true })
  allowed_values: any[];

  @Column({ type: 'jsonb', nullable: true })
  value_constraints: any;

  @Column({ type: 'varchar', length: 100, nullable: true })
  data_source: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  environment: string; // development, staging, production

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  jurisdiction: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  regulatory_framework: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  compliance_requirement: string;

  @Column({ type: 'boolean', default: false })
  affects_screening: boolean;

  @Column({ type: 'boolean', default: false })
  affects_risk_scoring: boolean;

  @Column({ type: 'boolean', default: false })
  affects_compliance: boolean;

  @Column({ type: 'boolean', default: false })
  affects_reporting: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  impact_level: string; // low, medium, high, critical

  @Column({ type: 'text', nullable: true })
  impact_description: string;

  @Column({ type: 'jsonb', nullable: true })
  dependencies: string[];

  @Column({ type: 'jsonb', nullable: true })
  dependent_configs: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  config_group: string;

  @Column({ type: 'integer', default: 0 })
  display_order: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ui_component: string;

  @Column({ type: 'jsonb', nullable: true })
  ui_properties: any;

  @Column({ type: 'text', nullable: true })
  help_text: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  help_url: string;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  effective_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  expiry_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({ type: 'jsonb', nullable: true })
  version_history: any[];

  @Column({ type: 'jsonb', nullable: true })
  change_log: any[];

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @Column({ type: 'uuid', nullable: true })
  approved_by: string;

  @Column({ type: 'timestamp', nullable: true })
  approved_date: Date;

  @Column({ type: 'text', nullable: true })
  approval_notes: string;

  @Column({ type: 'timestamp', nullable: true })
  last_accessed_date: Date;

  @Column({ type: 'integer', default: 0 })
  access_count: number;

  @Column({ type: 'timestamp', nullable: true })
  last_modified_date: Date;

  @Column({ type: 'uuid', nullable: true })
  last_modified_by: string;

  @Column({ type: 'jsonb', nullable: true })
  access_log: any[];

  @Column({ type: 'jsonb', nullable: true })
  audit_trail: any[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relationships
  @ManyToOne(() => SubscriberEntity, { nullable: false })
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: SubscriberEntity;

  @ManyToOne(() => SubscriberUserEntity, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity, { nullable: true })
  @JoinColumn({ name: 'last_modified_by' })
  lastModifier: SubscriberUserEntity;

  // Virtual Properties
  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.is_active = true AND ${alias}.status = 'active' THEN true 
        ELSE false 
      END
    `
  })
  is_effective: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.expiry_date IS NOT NULL AND ${alias}.expiry_date < NOW() THEN true 
        ELSE false 
      END
    `
  })
  is_expired: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.effective_date IS NOT NULL AND ${alias}.effective_date > NOW() THEN true 
        ELSE false 
      END
    `
  })
  is_future_effective: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.requires_approval = true AND ${alias}.approved_by IS NULL THEN true 
        ELSE false 
      END
    `
  })
  is_pending_approval: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.config_value IS NULL OR ${alias}.config_value = 'null'::jsonb THEN true 
        ELSE false 
      END
    `
  })
  is_null_value: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.config_value = ${alias}.default_value THEN true 
        ELSE false 
      END
    `
  })
  is_default_value: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.config_value IS NOT NULL AND ${alias}.config_value != ${alias}.default_value THEN true 
        ELSE false 
      END
    `
  })
  is_customized: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.validation_rules IS NOT NULL THEN true 
        ELSE false 
      END
    `
  })
  has_validation: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.dependencies IS NOT NULL AND jsonb_array_length(${alias}.dependencies) > 0 THEN true 
        ELSE false 
      END
    `
  })
  has_dependencies: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.dependent_configs IS NOT NULL AND jsonb_array_length(${alias}.dependent_configs) > 0 THEN true 
        ELSE false 
      END
    `
  })
  has_dependents: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.expiry_date IS NOT NULL AND ${alias}.expiry_date BETWEEN NOW() AND NOW() + INTERVAL '30 days' THEN true 
        ELSE false 
      END
    `
  })
  is_expiring_soon: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.last_accessed_date IS NULL OR ${alias}.last_accessed_date < NOW() - INTERVAL '90 days' THEN true 
        ELSE false 
      END
    `
  })
  is_stale: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.access_count = 0 THEN true 
        ELSE false 
      END
    `
  })
  is_unused: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.access_count >= 100 THEN true 
        ELSE false 
      END
    `
  })
  is_frequently_used: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.impact_level IN ('high', 'critical') THEN true 
        ELSE false 
      END
    `
  })
  is_high_impact: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.priority IN ('high', 'critical') THEN true 
        ELSE false 
      END
    `
  })
  is_high_priority: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.is_sensitive = true OR ${alias}.is_encrypted = true THEN true 
        ELSE false 
      END
    `
  })
  is_secure: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.affects_screening = true OR ${alias}.affects_risk_scoring = true OR ${alias}.affects_compliance = true THEN true 
        ELSE false 
      END
    `
  })
  is_business_critical: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.regulatory_framework IS NOT NULL OR ${alias}.compliance_requirement IS NOT NULL THEN true 
        ELSE false 
      END
    `
  })
  is_compliance_related: boolean;

  @VirtualColumn({
    query: (alias) => `
      SELECT EXTRACT(EPOCH FROM (NOW() - ${alias}.created_at)) / 86400
    `
  })
  age_in_days: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT EXTRACT(EPOCH FROM (NOW() - ${alias}.last_accessed_date)) / 86400
    `
  })
  days_since_last_access: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.expiry_date IS NOT NULL THEN EXTRACT(EPOCH FROM (${alias}.expiry_date - NOW())) / 86400
        ELSE NULL 
      END
    `
  })
  days_until_expiry: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.effective_date IS NOT NULL THEN EXTRACT(EPOCH FROM (${alias}.effective_date - NOW())) / 86400
        ELSE NULL 
      END
    `
  })
  days_until_effective: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.status = 'active' AND ${alias}.is_active = true THEN 'Active'
        WHEN ${alias}.status = 'inactive' OR ${alias}.is_active = false THEN 'Inactive'
        WHEN ${alias}.status = 'deprecated' THEN 'Deprecated'
        WHEN ${alias}.status = 'pending' THEN 'Pending'
        ELSE 'Unknown'
      END
    `
  })
  status_display: string;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.priority = 'critical' THEN 'Critical'
        WHEN ${alias}.priority = 'high' THEN 'High'
        WHEN ${alias}.priority = 'medium' THEN 'Medium'
        WHEN ${alias}.priority = 'low' THEN 'Low'
        ELSE 'Unknown'
      END
    `
  })
  priority_display: string;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.impact_level = 'critical' THEN 'Critical'
        WHEN ${alias}.impact_level = 'high' THEN 'High'
        WHEN ${alias}.impact_level = 'medium' THEN 'Medium'
        WHEN ${alias}.impact_level = 'low' THEN 'Low'
        ELSE 'Unknown'
      END
    `
  })
  impact_display: string;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.config_type = 'string' THEN 'Text'
        WHEN ${alias}.config_type = 'number' THEN 'Number'
        WHEN ${alias}.config_type = 'boolean' THEN 'Boolean'
        WHEN ${alias}.config_type = 'json' THEN 'JSON'
        WHEN ${alias}.config_type = 'array' THEN 'Array'
        WHEN ${alias}.config_type = 'date' THEN 'Date'
        WHEN ${alias}.config_type = 'enum' THEN 'Enumeration'
        ELSE 'Unknown'
      END
    `
  })
  type_display: string;

  @VirtualColumn({
    query: (alias) => `
      SELECT COALESCE(${alias}.config_name, ${alias}.config_key)
    `
  })
  display_name: string;

  @VirtualColumn({
    query: (alias) => `
      SELECT array_to_string(${alias}.tags, ', ')
    `
  })
  tags_display: string;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.dependencies IS NOT NULL THEN jsonb_array_length(${alias}.dependencies)
        ELSE 0 
      END
    `
  })
  dependency_count: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.dependent_configs IS NOT NULL THEN jsonb_array_length(${alias}.dependent_configs)
        ELSE 0 
      END
    `
  })
  dependent_count: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.version_history IS NOT NULL THEN jsonb_array_length(${alias}.version_history)
        ELSE 0 
      END
    `
  })
  version_count: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.change_log IS NOT NULL THEN jsonb_array_length(${alias}.change_log)
        ELSE 0 
      END
    `
  })
  change_count: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.access_log IS NOT NULL THEN jsonb_array_length(${alias}.access_log)
        ELSE 0 
      END
    `
  })
  access_log_count: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.config_value IS NOT NULL AND ${alias}.validation_rules IS NOT NULL THEN 100
        WHEN ${alias}.config_value IS NOT NULL THEN 75
        WHEN ${alias}.default_value IS NOT NULL THEN 50
        ELSE 25
      END
    `
  })
  completeness_score: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.access_count >= 100 THEN 100
        WHEN ${alias}.access_count >= 50 THEN 75
        WHEN ${alias}.access_count >= 10 THEN 50
        WHEN ${alias}.access_count > 0 THEN 25
        ELSE 0
      END
    `
  })
  usage_score: number;

  @VirtualColumn({
    query: (alias) => `
      SELECT CASE 
        WHEN ${alias}.priority = 'critical' AND ${alias}.impact_level = 'critical' THEN 100
        WHEN ${alias}.priority = 'high' OR ${alias}.impact_level = 'high' THEN 75
        WHEN ${alias}.priority = 'medium' OR ${alias}.impact_level = 'medium' THEN 50
        ELSE 25
      END
    `
  })
  importance_score: number;
}