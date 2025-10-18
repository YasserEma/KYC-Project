import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EntityEntity } from '../../entities/entities/entity.entity';
import { SubscriberEntity } from '../../subscribers/entities/subscriber.entity';
import { SubscriberUserEntity } from '../../subscriber-users/entities/subscriber-user.entity';

@Entity('screening_analysis')
@Index(['entity_id'])
@Index(['subscriber_id'])
@Index(['screening_type'])
@Index(['screening_status'])
@Index(['risk_level'])
@Index(['match_status'])
@Index(['requires_review'])
@Index(['is_false_positive'])
@Index(['screening_date'])
export class ScreeningAnalysisEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  entity_id: string;

  @Column({ type: 'uuid', nullable: true })
  subscriber_id: string;

  @Column({ 
    type: 'enum', 
    enum: [
      'sanctions', 'pep', 'adverse_media', 'watchlist', 'criminal_records',
      'regulatory_enforcement', 'financial_crimes', 'terrorism', 'money_laundering',
      'fraud', 'corruption', 'tax_evasion', 'cybercrime', 'human_trafficking',
      'drug_trafficking', 'arms_trafficking', 'environmental_crimes',
      'corporate_misconduct', 'bankruptcy', 'litigation', 'comprehensive'
    ]
  })
  screening_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  screening_provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  screening_reference: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  })
  screening_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

  @Column({ type: 'timestamp', nullable: true })
  screening_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_date: Date;

  @Column({ 
    type: 'enum', 
    enum: ['low', 'medium', 'high', 'critical'], 
    nullable: true 
  })
  risk_level: 'low' | 'medium' | 'high' | 'critical';

  @Column({ 
    type: 'enum', 
    enum: ['no_match', 'possible_match', 'confirmed_match', 'false_positive'], 
    default: 'no_match' 
  })
  match_status: 'no_match' | 'possible_match' | 'confirmed_match' | 'false_positive';

  @Column({ type: 'integer', default: 0 })
  total_matches: number;

  @Column({ type: 'integer', default: 0 })
  high_risk_matches: number;

  @Column({ type: 'integer', default: 0 })
  medium_risk_matches: number;

  @Column({ type: 'integer', default: 0 })
  low_risk_matches: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  confidence_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  match_score: number;

  @Column({ type: 'boolean', default: false })
  requires_review: boolean;

  @Column({ type: 'boolean', default: false })
  is_false_positive: boolean;

  @Column({ type: 'boolean', default: false })
  is_whitelisted: boolean;

  @Column({ type: 'boolean', default: false })
  is_escalated: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  escalated_to: string;

  @Column({ type: 'timestamp', nullable: true })
  escalation_date: Date;

  @Column({ type: 'text', nullable: true })
  escalation_reason: string;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string;

  @Column({ type: 'timestamp', nullable: true })
  review_date: Date;

  @Column({ type: 'text', nullable: true })
  review_notes: string;

  @Column({ 
    type: 'enum', 
    enum: ['approved', 'rejected', 'requires_additional_review'], 
    nullable: true 
  })
  review_decision: 'approved' | 'rejected' | 'requires_additional_review';

  @Column({ type: 'jsonb', nullable: true })
  screening_results: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  match_details: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  source_data: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  provider_response: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  search_terms: string;

  @Column({ type: 'jsonb', nullable: true })
  search_parameters: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jurisdiction: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  data_sources: string;

  @Column({ type: 'timestamp', nullable: true })
  last_updated_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  next_review_date: Date;

  @Column({ type: 'integer', nullable: true })
  review_frequency_days: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'integer', default: 0 })
  retry_count: number;

  @Column({ type: 'timestamp', nullable: true })
  last_retry_date: Date;

  @Column({ type: 'integer', nullable: true })
  processing_time_seconds: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  screening_cost: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  cost_currency: string;

  @Column({ type: 'uuid', nullable: true })
  initiated_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @Column({ type: 'jsonb', nullable: true })
  compliance_flags: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  regulatory_notes: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => EntityEntity, entity => entity.screeningAnalyses)
  @JoinColumn({ name: 'entity_id' })
  entity: EntityEntity;

  @ManyToOne(() => SubscriberEntity, subscriber => subscriber.screeningAnalyses)
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: SubscriberEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'initiated_by' })
  initiator: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: SubscriberUserEntity;

  // Virtual properties
  get is_completed(): boolean {
    return this.screening_status === 'completed';
  }

  get is_failed(): boolean {
    return this.screening_status === 'failed';
  }

  get is_pending(): boolean {
    return this.screening_status === 'pending' || this.screening_status === 'in_progress';
  }

  get has_matches(): boolean {
    return this.total_matches > 0;
  }

  get has_high_risk_matches(): boolean {
    return this.high_risk_matches > 0;
  }

  get is_high_risk(): boolean {
    return this.risk_level === 'high' || this.risk_level === 'critical';
  }

  get is_critical_risk(): boolean {
    return this.risk_level === 'critical';
  }

  get needs_review(): boolean {
    return this.requires_review || this.has_high_risk_matches || this.match_status === 'possible_match';
  }

  get is_overdue_review(): boolean {
    return this.next_review_date && this.next_review_date < new Date();
  }

  get processing_time_minutes(): number | null {
    return this.processing_time_seconds ? Math.round((this.processing_time_seconds / 60) * 100) / 100 : null;
  }

  get days_since_screening(): number | null {
    if (!this.screening_date) return null;
    
    const diffTime = new Date().getTime() - this.screening_date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get days_until_next_review(): number | null {
    if (!this.next_review_date) return null;
    
    const diffTime = this.next_review_date.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get screening_age_days(): number | null {
    if (!this.completed_date) return null;
    
    const diffTime = new Date().getTime() - this.completed_date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get is_stale(): boolean {
    const maxAge = 90; // 90 days
    return this.screening_age_days !== null && this.screening_age_days > maxAge;
  }

  get risk_score(): number {
    let score = 0;
    
    if (this.risk_level === 'low') score += 25;
    else if (this.risk_level === 'medium') score += 50;
    else if (this.risk_level === 'high') score += 75;
    else if (this.risk_level === 'critical') score += 100;
    
    if (this.match_score) score = Math.max(score, this.match_score);
    if (this.confidence_score) score = (score + this.confidence_score) / 2;
    
    return Math.min(100, Math.max(0, score));
  }

  get status_summary(): string {
    const statuses: string[] = [];
    
    statuses.push(`Status: ${this.screening_status}`);
    if (this.risk_level) statuses.push(`Risk: ${this.risk_level}`);
    statuses.push(`Matches: ${this.match_status}`);
    
    if (this.requires_review) statuses.push('Needs Review');
    if (this.is_false_positive) statuses.push('False Positive');
    if (this.is_whitelisted) statuses.push('Whitelisted');
    if (this.is_escalated) statuses.push('Escalated');
    if (this.is_stale) statuses.push('Stale');
    
    return statuses.join(', ');
  }

  get compliance_summary(): string[] {
    const flags: string[] = [];
    
    if (this.has_high_risk_matches) flags.push('High Risk Matches Found');
    if (this.match_status === 'confirmed_match') flags.push('Confirmed Match');
    if (this.requires_review && !this.reviewed_by) flags.push('Pending Review');
    if (this.is_overdue_review) flags.push('Overdue Review');
    if (this.is_escalated && !this.review_decision) flags.push('Escalated - Pending Decision');
    if (this.is_stale) flags.push('Screening Data Stale');
    if (this.screening_status === 'failed') flags.push('Screening Failed');
    if (this.retry_count > 0) flags.push(`Retried ${this.retry_count} times`);
    
    return flags;
  }

  get search_term_list(): string[] {
    if (!this.search_terms) return [];
    return this.search_terms.split(',').map(term => term.trim()).filter(Boolean);
  }

  set search_term_list(terms: string[]) {
    this.search_terms = terms.join(', ');
  }

  get data_source_list(): string[] {
    if (!this.data_sources) return [];
    return this.data_sources.split(',').map(source => source.trim()).filter(Boolean);
  }

  set data_source_list(sources: string[]) {
    this.data_sources = sources.join(', ');
  }

  get tag_list(): string[] {
    if (!this.tags) return [];
    return this.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }

  set tag_list(tags: string[]) {
    this.tags = tags.join(', ');
  }

  get match_distribution(): { high: number; medium: number; low: number } {
    return {
      high: this.high_risk_matches,
      medium: this.medium_risk_matches,
      low: this.low_risk_matches,
    };
  }

  get effectiveness_score(): number {
    if (!this.is_completed) return 0;
    
    let score = 50; // Base score for completion
    
    if (this.confidence_score) score += this.confidence_score * 0.3;
    if (this.processing_time_seconds && this.processing_time_seconds < 300) score += 10; // Fast processing
    if (this.total_matches > 0 && this.match_status !== 'no_match') score += 20; // Found relevant matches
    if (this.is_false_positive) score -= 15; // Penalty for false positives
    if (this.retry_count > 0) score -= (this.retry_count * 5); // Penalty for retries
    
    return Math.min(100, Math.max(0, score));
  }

  get priority_level(): 'low' | 'medium' | 'high' | 'critical' {
    if (this.is_critical_risk || (this.is_escalated && !this.review_decision)) return 'critical';
    if (this.is_high_risk || this.has_high_risk_matches || this.is_overdue_review) return 'high';
    if (this.needs_review || this.match_status === 'possible_match') return 'medium';
    return 'low';
  }
}