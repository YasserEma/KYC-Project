import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SubscriberEntity } from '../../subscribers/entities/subscriber.entity';
import { SubscriberUserEntity } from '../../subscriber-users/entities/subscriber-user.entity';

@Entity('risk_configuration')
@Index(['subscriber_id', 'config_key'], { unique: true })
@Index(['subscriber_id', 'config_category'])
@Index(['subscriber_id', 'config_type'])
@Index(['subscriber_id', 'risk_type'])
@Index(['subscriber_id', 'status'])
@Index(['subscriber_id', 'is_active'])
@Index(['subscriber_id', 'is_system_config'])
@Index(['subscriber_id', 'priority'])
@Index(['subscriber_id', 'risk_level'])
@Index(['subscriber_id', 'effective_date'])
@Index(['subscriber_id', 'expiry_date'])
@Index(['subscriber_id', 'requires_approval'])
@Index(['subscriber_id', 'approved_by'])
@Index(['subscriber_id', 'is_sensitive'])
@Index(['subscriber_id', 'is_encrypted'])
@Index(['subscriber_id', 'regulatory_framework'])
@Index(['subscriber_id', 'jurisdiction'])
@Index(['subscriber_id', 'model_type'])
@Index(['subscriber_id', 'calculation_method'])
@Index(['subscriber_id', 'created_at'])
@Index(['subscriber_id', 'updated_at'])
export class RiskConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  subscriber_id: string;

  // Configuration identification
  @Column({ type: 'varchar', length: 255 })
  config_key: string;

  @Column({ type: 'varchar', length: 100 })
  config_category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  config_subcategory: string;

  @Column({ type: 'varchar', length: 255 })
  config_name: string;

  @Column({ type: 'text', nullable: true })
  config_description: string;

  @Column({ type: 'varchar', length: 50 })
  config_type: string; // threshold, weight, multiplier, formula, rule, matrix, model, parameter

  // Risk-specific configuration
  @Column({ type: 'varchar', length: 100 })
  risk_type: string; // credit, operational, market, liquidity, compliance, reputational, strategic

  @Column({ type: 'varchar', length: 50 })
  risk_level: string; // low, medium, high, critical

  @Column({ type: 'varchar', length: 100, nullable: true })
  risk_category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  risk_subcategory: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  model_type: string; // statistical, machine_learning, rule_based, hybrid

  @Column({ type: 'varchar', length: 100, nullable: true })
  calculation_method: string; // weighted_average, monte_carlo, var, expected_shortfall, scoring

  // Configuration values
  @Column({ type: 'jsonb', nullable: true })
  config_value: any;

  @Column({ type: 'jsonb', nullable: true })
  default_value: any;

  @Column({ type: 'jsonb', nullable: true })
  min_value: any;

  @Column({ type: 'jsonb', nullable: true })
  max_value: any;

  @Column({ type: 'jsonb', nullable: true })
  allowed_values: any[];

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string; // active, inactive, pending, deprecated, testing

  @Column({ type: 'varchar', length: 50, default: 'medium' })
  priority: string; // low, medium, high, critical

  // Configuration flags
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
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

  @Column({ type: 'boolean', default: false })
  affects_scoring: boolean;

  @Column({ type: 'boolean', default: false })
  affects_thresholds: boolean;

  @Column({ type: 'boolean', default: false })
  affects_models: boolean;

  @Column({ type: 'boolean', default: false })
  affects_reporting: boolean;

  @Column({ type: 'boolean', default: false })
  affects_compliance: boolean;

  // Validation and constraints
  @Column({ type: 'varchar', length: 100, nullable: true })
  validation_type: string; // regex, range, enum, custom, formula

  @Column({ type: 'jsonb', nullable: true })
  validation_rules: any;

  @Column({ type: 'text', nullable: true })
  validation_error_message: string;

  @Column({ type: 'jsonb', nullable: true })
  constraints: any;

  @Column({ type: 'jsonb', nullable: true })
  business_rules: any;

  // Risk model configuration
  @Column({ type: 'jsonb', nullable: true })
  model_parameters: any;

  @Column({ type: 'jsonb', nullable: true })
  scoring_weights: any;

  @Column({ type: 'jsonb', nullable: true })
  threshold_values: any;

  @Column({ type: 'jsonb', nullable: true })
  risk_factors: any;

  @Column({ type: 'jsonb', nullable: true })
  calculation_formula: any;

  @Column({ type: 'jsonb', nullable: true })
  aggregation_rules: any;

  @Column({ type: 'jsonb', nullable: true })
  normalization_rules: any;

  // Dependencies and relationships
  @Column({ type: 'jsonb', nullable: true })
  dependencies: string[];

  @Column({ type: 'jsonb', nullable: true })
  dependent_configs: string[];

  @Column({ type: 'jsonb', nullable: true })
  related_configs: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  config_group: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  config_hierarchy: string;

  // Data source and provider information
  @Column({ type: 'varchar', length: 100, nullable: true })
  data_source: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider_version: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  data_feed: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  update_frequency: string; // real_time, hourly, daily, weekly, monthly

  @Column({ type: 'timestamp', nullable: true })
  last_sync_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sync_status: string; // success, failed, pending, in_progress

  // Environment and deployment
  @Column({ type: 'varchar', length: 50, nullable: true })
  environment: string; // development, testing, staging, production

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  jurisdiction: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  regulatory_framework: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  compliance_requirement: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  impact_level: string; // low, medium, high, critical

  // Approval and review
  @Column({ type: 'uuid', nullable: true })
  approved_by: string;

  @Column({ type: 'timestamp', nullable: true })
  approved_date: Date;

  @Column({ type: 'text', nullable: true })
  approval_notes: string;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_date: Date;

  @Column({ type: 'text', nullable: true })
  review_notes: string;

  @Column({ type: 'timestamp', nullable: true })
  next_review_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  review_frequency: string; // monthly, quarterly, semi_annually, annually

  // Effective dates and versioning
  @Column({ type: 'timestamp', nullable: true })
  effective_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiry_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({ type: 'jsonb', nullable: true })
  version_history: any[];

  @Column({ type: 'jsonb', nullable: true })
  change_log: any[];

  // Usage and performance tracking
  @Column({ type: 'integer', default: 0 })
  usage_count: number;

  @Column({ type: 'timestamp', nullable: true })
  last_used_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_modified_date: Date;

  @Column({ type: 'uuid', nullable: true })
  last_modified_by: string;

  @Column({ type: 'jsonb', nullable: true })
  performance_metrics: any;

  @Column({ type: 'jsonb', nullable: true })
  usage_statistics: any;

  // UI and display properties
  @Column({ type: 'varchar', length: 100, nullable: true })
  ui_component: string;

  @Column({ type: 'jsonb', nullable: true })
  ui_properties: any;

  @Column({ type: 'integer', nullable: true })
  display_order: number;

  @Column({ type: 'text', nullable: true })
  help_text: string;

  @Column({ type: 'text', nullable: true })
  tooltip: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  display_label: string;

  // Backup and recovery
  @Column({ type: 'jsonb', nullable: true })
  backup_config: any;

  @Column({ type: 'timestamp', nullable: true })
  last_backup_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  backup_status: string;

  @Column({ type: 'jsonb', nullable: true })
  recovery_config: any;

  // Audit and compliance
  @Column({ type: 'jsonb', nullable: true })
  audit_trail: any[];

  @Column({ type: 'jsonb', nullable: true })
  compliance_flags: any;

  @Column({ type: 'text', nullable: true })
  regulatory_notes: string;

  @Column({ type: 'jsonb', nullable: true })
  risk_assessment: any;

  @Column({ type: 'varchar', length: 50, nullable: true })
  data_classification: string; // public, internal, confidential, restricted

  // Metadata and tags
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  // Audit fields
  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => SubscriberEntity)
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: SubscriberEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'created_by' })
  creator: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'updated_by' })
  updater: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'approved_by' })
  approver: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'last_modified_by' })
  lastModifier: SubscriberUserEntity;

  // Virtual properties for computed values
  get isExpired(): boolean {
    return this.expiry_date ? new Date() > this.expiry_date : false;
  }

  get isEffective(): boolean {
    const now = new Date();
    const isActive = this.is_active && this.status === 'active';
    const isInEffectivePeriod = (!this.effective_date || this.effective_date <= now) && 
                               (!this.expiry_date || this.expiry_date > now);
    return isActive && isInEffectivePeriod;
  }

  get isFutureEffective(): boolean {
    return this.effective_date ? new Date() < this.effective_date : false;
  }

  get isPendingApproval(): boolean {
    return this.requires_approval && !this.approved_by;
  }

  get isApproved(): boolean {
    return !this.requires_approval || !!this.approved_by;
  }

  get isOverdueForReview(): boolean {
    return this.next_review_date ? new Date() > this.next_review_date : false;
  }

  get isDueForReview(): boolean {
    if (!this.next_review_date) return false;
    const daysUntilReview = Math.ceil((this.next_review_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilReview <= 30;
  }

  get isExpiringSoon(): boolean {
    if (!this.expiry_date) return false;
    const daysUntilExpiry = Math.ceil((this.expiry_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }

  get isStale(): boolean {
    if (!this.last_used_date) return true;
    const daysSinceLastUse = Math.ceil((new Date().getTime() - this.last_used_date.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastUse > 90;
  }

  get isUnused(): boolean {
    return this.usage_count === 0;
  }

  get isFrequentlyUsed(): boolean {
    return this.usage_count >= 100;
  }

  get isHighImpact(): boolean {
    return ['high', 'critical'].includes(this.impact_level);
  }

  get isHighPriority(): boolean {
    return ['high', 'critical'].includes(this.priority);
  }

  get isHighRisk(): boolean {
    return ['high', 'critical'].includes(this.risk_level);
  }

  get isSecure(): boolean {
    return this.is_sensitive || this.is_encrypted;
  }

  get isBusinessCritical(): boolean {
    return this.affects_scoring || this.affects_thresholds || this.affects_models || this.affects_compliance;
  }

  get isComplianceRelated(): boolean {
    return !!this.regulatory_framework || !!this.compliance_requirement || this.affects_compliance;
  }

  get hasValidation(): boolean {
    return !!this.validation_rules;
  }

  get hasDependencies(): boolean {
    return this.dependencies && this.dependencies.length > 0;
  }

  get hasDependents(): boolean {
    return this.dependent_configs && this.dependent_configs.length > 0;
  }

  get hasCustomValue(): boolean {
    return this.config_value !== null && this.config_value !== this.default_value;
  }

  get isUsingDefaultValue(): boolean {
    return this.config_value === null || this.config_value === this.default_value;
  }

  get hasNullValue(): boolean {
    return this.config_value === null;
  }

  get isSyncOverdue(): boolean {
    if (!this.last_sync_date || !this.update_frequency) return false;
    
    const now = new Date();
    const daysSinceSync = Math.ceil((now.getTime() - this.last_sync_date.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (this.update_frequency) {
      case 'real_time': return daysSinceSync > 0;
      case 'hourly': return daysSinceSync > 0;
      case 'daily': return daysSinceSync > 1;
      case 'weekly': return daysSinceSync > 7;
      case 'monthly': return daysSinceSync > 30;
      default: return false;
    }
  }

  get isSyncFailed(): boolean {
    return this.sync_status === 'failed';
  }

  get ageDays(): number {
    return Math.ceil((new Date().getTime() - this.created_at.getTime()) / (1000 * 60 * 60 * 24));
  }

  get daysSinceLastUse(): number {
    if (!this.last_used_date) return -1;
    return Math.ceil((new Date().getTime() - this.last_used_date.getTime()) / (1000 * 60 * 60 * 24));
  }

  get daysSinceLastModified(): number {
    if (!this.last_modified_date) return this.ageDays;
    return Math.ceil((new Date().getTime() - this.last_modified_date.getTime()) / (1000 * 60 * 60 * 24));
  }

  get daysUntilExpiry(): number {
    if (!this.expiry_date) return -1;
    return Math.ceil((this.expiry_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  get daysUntilReview(): number {
    if (!this.next_review_date) return -1;
    return Math.ceil((this.next_review_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  get statusSummary(): string {
    if (!this.is_active) return 'inactive';
    if (this.isExpired) return 'expired';
    if (this.isFutureEffective) return 'future_effective';
    if (this.isPendingApproval) return 'pending_approval';
    if (this.isOverdueForReview) return 'overdue_review';
    if (this.isExpiringSoon) return 'expiring_soon';
    if (this.isDueForReview) return 'due_review';
    if (this.isSyncOverdue) return 'sync_overdue';
    if (this.isSyncFailed) return 'sync_failed';
    return 'active';
  }

  get riskFlags(): string[] {
    const flags: string[] = [];
    if (this.isHighRisk) flags.push('high_risk');
    if (this.isHighImpact) flags.push('high_impact');
    if (this.isBusinessCritical) flags.push('business_critical');
    if (this.isSecure) flags.push('secure');
    if (this.isComplianceRelated) flags.push('compliance_related');
    return flags;
  }

  get complianceFlags(): string[] {
    const flags: string[] = [];
    if (this.regulatory_framework) flags.push('regulatory');
    if (this.compliance_requirement) flags.push('compliance_required');
    if (this.affects_compliance) flags.push('affects_compliance');
    if (this.requires_approval) flags.push('requires_approval');
    if (this.is_sensitive) flags.push('sensitive');
    if (this.is_encrypted) flags.push('encrypted');
    return flags;
  }

  get tagList(): string[] {
    return this.tags || [];
  }

  get dependencyList(): string[] {
    return this.dependencies || [];
  }

  get dependentList(): string[] {
    return this.dependent_configs || [];
  }

  get relatedConfigList(): string[] {
    return this.related_configs || [];
  }

  get displayName(): string {
    return this.display_label || this.config_name || this.config_key;
  }

  get priorityLevel(): number {
    const priorityMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorityMap[this.priority] || 2;
  }

  get riskScore(): number {
    const riskMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    const impactMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    const priorityMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    
    const riskScore = riskMap[this.risk_level] || 2;
    const impactScore = impactMap[this.impact_level] || 2;
    const priorityScore = priorityMap[this.priority] || 2;
    
    return Math.round((riskScore + impactScore + priorityScore) / 3 * 25);
  }

  get usageScore(): number {
    if (this.usage_count === 0) return 0;
    if (this.usage_count >= 1000) return 100;
    return Math.min(Math.round(this.usage_count / 10), 100);
  }

  get freshnessScore(): number {
    const daysSinceUpdate = this.daysSinceLastModified;
    if (daysSinceUpdate <= 7) return 100;
    if (daysSinceUpdate <= 30) return 75;
    if (daysSinceUpdate <= 90) return 50;
    if (daysSinceUpdate <= 180) return 25;
    return 0;
  }

  get completenessScore(): number {
    let score = 0;
    let total = 0;

    // Required fields
    if (this.config_key) score += 10; total += 10;
    if (this.config_name) score += 10; total += 10;
    if (this.config_type) score += 10; total += 10;
    if (this.risk_type) score += 10; total += 10;

    // Important fields
    if (this.config_description) score += 5; total += 5;
    if (this.config_value !== null) score += 10; total += 10;
    if (this.default_value !== null) score += 5; total += 5;

    // Validation and constraints
    if (this.validation_rules) score += 5; total += 5;
    if (this.constraints) score += 5; total += 5;

    // Documentation
    if (this.help_text) score += 5; total += 5;
    if (this.notes) score += 5; total += 5;

    // Metadata
    if (this.tags && this.tags.length > 0) score += 5; total += 5;
    if (this.metadata && Object.keys(this.metadata).length > 0) score += 5; total += 5;

    // Approval and review
    if (!this.requires_approval || this.approved_by) score += 5; total += 5;
    if (this.reviewed_by) score += 5; total += 5;

    return total > 0 ? Math.round((score / total) * 100) : 0;
  }

  get dataQualityScore(): number {
    let score = 0;
    let total = 0;

    // Value consistency
    if (this.config_value !== null) {
      score += 20; total += 20;
      
      // Value within constraints
      if (this.min_value !== null && this.max_value !== null) {
        const value = typeof this.config_value === 'number' ? this.config_value : 0;
        const min = typeof this.min_value === 'number' ? this.min_value : 0;
        const max = typeof this.max_value === 'number' ? this.max_value : 0;
        if (value >= min && value <= max) score += 10;
        total += 10;
      }
    } else {
      total += 20;
    }

    // Validation rules present
    if (this.validation_rules) score += 15; total += 15;

    // Documentation quality
    if (this.config_description && this.config_description.length > 20) score += 10; total += 10;
    if (this.help_text && this.help_text.length > 10) score += 10; total += 10;

    // Metadata richness
    if (this.tags && this.tags.length >= 2) score += 10; total += 10;
    if (this.metadata && Object.keys(this.metadata).length >= 3) score += 10; total += 10;

    // Approval status
    if (!this.requires_approval || this.approved_by) score += 10; total += 10;

    // Freshness
    if (this.daysSinceLastModified <= 30) score += 15; total += 15;

    return total > 0 ? Math.round((score / total) * 100) : 0;
  }
}