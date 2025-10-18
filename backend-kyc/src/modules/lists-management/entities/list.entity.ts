import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SubscriberEntity } from '../../subscribers/entities/subscriber.entity';
import { SubscriberUserEntity } from '../../subscriber-users/entities/subscriber-user.entity';
import { ListValueEntity } from './list-value.entity';

@Entity('lists_management')
export class ListEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  subscriber_id: string;

  @Column({ type: 'varchar', length: 100 })
  list_name: string;

  @Column({ type: 'varchar', length: 50 })
  list_type: string; // 'whitelist', 'blacklist', 'greylist', 'watchlist', 'sanctions', 'pep', 'custom'

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string; // 'active', 'inactive', 'archived', 'draft'

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string; // 'regulatory', 'internal', 'external', 'customer', 'vendor'

  @Column({ type: 'varchar', length: 50, nullable: true })
  subcategory: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  priority: string; // 'low', 'medium', 'high', 'critical'

  @Column({ type: 'varchar', length: 50, nullable: true })
  risk_level: string; // 'low', 'medium', 'high', 'critical'

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_system_list: boolean;

  @Column({ type: 'boolean', default: false })
  is_readonly: boolean;

  @Column({ type: 'boolean', default: false })
  is_encrypted: boolean;

  @Column({ type: 'boolean', default: false })
  is_sensitive: boolean;

  @Column({ type: 'boolean', default: false })
  requires_approval: boolean;

  @Column({ type: 'boolean', default: false })
  auto_update: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  data_source: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  source_url: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source_version: string;

  @Column({ type: 'timestamp', nullable: true })
  source_last_updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_sync_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sync_status: string; // 'pending', 'in_progress', 'completed', 'failed'

  @Column({ type: 'text', nullable: true })
  sync_error: string;

  @Column({ type: 'int', default: 0 })
  sync_retry_count: number;

  @Column({ type: 'timestamp', nullable: true })
  next_sync_date: Date;

  @Column({ type: 'int', nullable: true })
  sync_frequency_hours: number;

  @Column({ type: 'int', default: 0 })
  total_entries: number;

  @Column({ type: 'int', default: 0 })
  active_entries: number;

  @Column({ type: 'int', default: 0 })
  inactive_entries: number;

  @Column({ type: 'int', default: 0 })
  pending_entries: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  jurisdiction: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  regulatory_framework: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  compliance_requirement: string;

  @Column({ type: 'boolean', default: false })
  requires_enhanced_due_diligence: boolean;

  @Column({ type: 'boolean', default: false })
  triggers_alert: boolean;

  @Column({ type: 'boolean', default: false })
  blocks_transaction: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  alert_severity: string; // 'low', 'medium', 'high', 'critical'

  @Column({ type: 'varchar', length: 50, nullable: true })
  action_required: string; // 'none', 'review', 'approve', 'reject', 'escalate'

  @Column({ type: 'jsonb', nullable: true })
  matching_criteria: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  validation_rules: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

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

  @Column({ type: 'int', default: 0 })
  version: number;

  @Column({ type: 'timestamp', nullable: true })
  effective_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiry_date: Date;

  @Column({ type: 'int', default: 0 })
  retention_days: number;

  @Column({ type: 'timestamp', nullable: true })
  last_accessed_date: Date;

  @Column({ type: 'int', default: 0 })
  access_count: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => SubscriberEntity)
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

  @OneToMany(() => ListValueEntity, listValue => listValue.list)
  list_values: ListValueEntity[];

  // Virtual properties
  get is_expired(): boolean {
    return this.expiry_date ? new Date() > this.expiry_date : false;
  }

  get is_effective(): boolean {
    const now = new Date();
    const effectiveCheck = this.effective_date ? now >= this.effective_date : true;
    const expiryCheck = this.expiry_date ? now <= this.expiry_date : true;
    return effectiveCheck && expiryCheck;
  }

  get is_approved(): boolean {
    return !!this.approved_by && !!this.approved_date;
  }

  get is_pending_approval(): boolean {
    return this.requires_approval && !this.is_approved;
  }

  get is_sync_overdue(): boolean {
    if (!this.auto_update || !this.next_sync_date) return false;
    return new Date() > this.next_sync_date;
  }

  get is_sync_failed(): boolean {
    return this.sync_status === 'failed';
  }

  get sync_health_status(): string {
    if (!this.auto_update) return 'manual';
    if (this.is_sync_failed) return 'failed';
    if (this.is_sync_overdue) return 'overdue';
    if (this.sync_status === 'in_progress') return 'syncing';
    return 'healthy';
  }

  get days_until_expiry(): number | null {
    if (!this.expiry_date) return null;
    const diffTime = this.expiry_date.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get age_in_days(): number {
    const diffTime = new Date().getTime() - this.created_at.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  get last_accessed_days_ago(): number | null {
    if (!this.last_accessed_date) return null;
    const diffTime = new Date().getTime() - this.last_accessed_date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  get utilization_rate(): number {
    if (this.total_entries === 0) return 0;
    return (this.active_entries / this.total_entries) * 100;
  }

  get completion_rate(): number {
    if (this.total_entries === 0) return 0;
    const completedEntries = this.total_entries - this.pending_entries;
    return (completedEntries / this.total_entries) * 100;
  }

  get status_summary(): string {
    if (!this.is_active) return 'inactive';
    if (this.is_expired) return 'expired';
    if (!this.is_effective) return 'not_effective';
    if (this.is_pending_approval) return 'pending_approval';
    if (this.is_sync_failed) return 'sync_failed';
    if (this.is_sync_overdue) return 'sync_overdue';
    return 'active';
  }

  get risk_flags(): string[] {
    const flags: string[] = [];
    
    if (this.risk_level === 'high' || this.risk_level === 'critical') flags.push('high_risk');
    if (this.is_sensitive) flags.push('sensitive_data');
    if (this.requires_enhanced_due_diligence) flags.push('enhanced_due_diligence');
    if (this.triggers_alert) flags.push('alert_trigger');
    if (this.blocks_transaction) flags.push('transaction_blocker');
    if (this.is_expired) flags.push('expired');
    if (!this.is_effective) flags.push('not_effective');
    if (this.is_sync_failed) flags.push('sync_issues');
    
    return flags;
  }

  get compliance_flags(): string[] {
    const flags: string[] = [];
    
    if (this.regulatory_framework) flags.push('regulatory_compliance');
    if (this.compliance_requirement) flags.push('compliance_required');
    if (this.requires_approval && !this.is_approved) flags.push('approval_pending');
    if (this.jurisdiction) flags.push('jurisdiction_specific');
    
    return flags;
  }

  get tag_list(): string {
    return this.tags ? this.tags.join(', ') : '';
  }

  get display_name(): string {
    return `${this.list_name} (${this.list_type})`;
  }

  get priority_level(): number {
    const priorityMap = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorityMap[this.priority as keyof typeof priorityMap] || 0;
  }

  get risk_score(): number {
    const riskMap = { low: 25, medium: 50, high: 75, critical: 100 };
    return riskMap[this.risk_level as keyof typeof riskMap] || 0;
  }

  get data_quality_score(): number {
    let score = 100;
    
    // Deduct points for missing critical information
    if (!this.description) score -= 10;
    if (!this.category) score -= 5;
    if (!this.priority) score -= 5;
    if (!this.risk_level) score -= 10;
    if (!this.jurisdiction && this.list_type !== 'custom') score -= 5;
    if (this.total_entries === 0) score -= 20;
    if (this.pending_entries > this.total_entries * 0.2) score -= 15; // More than 20% pending
    if (this.is_sync_failed) score -= 20;
    if (this.is_sync_overdue) score -= 10;
    
    return Math.max(0, score);
  }
}