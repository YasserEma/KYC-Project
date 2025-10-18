import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EntityEntity } from '../../entities/entities/entity.entity';
import { SubscriberEntity } from '../../subscribers/entities/subscriber.entity';
import { SubscriberUserEntity } from '../../subscriber-users/entities/subscriber-user.entity';

@Entity('risk_analysis')
@Index(['entity_id'])
@Index(['subscriber_id'])
@Index(['risk_type'])
@Index(['risk_level'])
@Index(['analysis_status'])
@Index(['requires_review'])
@Index(['is_escalated'])
@Index(['analysis_date'])
export class RiskAnalysisEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  entity_id: string;

  @Column({ type: 'uuid', nullable: true })
  subscriber_id: string;

  @Column({ 
    type: 'enum', 
    enum: [
      'customer_risk', 'transaction_risk', 'geographic_risk', 'product_risk',
      'channel_risk', 'aml_risk', 'sanctions_risk', 'pep_risk', 'reputational_risk',
      'operational_risk', 'credit_risk', 'market_risk', 'liquidity_risk',
      'regulatory_risk', 'compliance_risk', 'fraud_risk', 'cybersecurity_risk',
      'concentration_risk', 'country_risk', 'industry_risk', 'business_risk',
      'relationship_risk', 'beneficial_ownership_risk', 'source_of_funds_risk',
      'source_of_wealth_risk', 'comprehensive_risk'
    ]
  })
  risk_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  risk_category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  risk_subcategory: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  })
  analysis_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

  @Column({ type: 'timestamp', nullable: true })
  analysis_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_date: Date;

  @Column({ 
    type: 'enum', 
    enum: ['low', 'medium', 'high', 'critical'], 
    nullable: true 
  })
  risk_level: 'low' | 'medium' | 'high' | 'critical';

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  risk_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  inherent_risk_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  residual_risk_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  control_effectiveness_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  probability_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  impact_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  confidence_level: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  risk_methodology: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  analysis_model: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model_version: string;

  @Column({ type: 'boolean', default: false })
  requires_review: boolean;

  @Column({ type: 'boolean', default: false })
  is_escalated: boolean;

  @Column({ type: 'boolean', default: false })
  is_approved: boolean;

  @Column({ type: 'boolean', default: false })
  is_exception: boolean;

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
    enum: ['approved', 'rejected', 'requires_additional_review', 'exception_granted'], 
    nullable: true 
  })
  review_decision: 'approved' | 'rejected' | 'requires_additional_review' | 'exception_granted';

  @Column({ type: 'uuid', nullable: true })
  approved_by: string;

  @Column({ type: 'timestamp', nullable: true })
  approval_date: Date;

  @Column({ type: 'text', nullable: true })
  approval_notes: string;

  @Column({ type: 'jsonb', nullable: true })
  risk_factors: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  mitigating_controls: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  risk_indicators: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  analysis_results: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  model_inputs: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  model_outputs: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  sensitivity_analysis: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  scenario_analysis: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  stress_test_results: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  benchmarking_data: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  risk_appetite_statement: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  risk_tolerance_threshold: number;

  @Column({ type: 'boolean', default: false })
  exceeds_risk_appetite: boolean;

  @Column({ type: 'boolean', default: false })
  exceeds_risk_tolerance: boolean;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'text', nullable: true })
  action_items: string;

  @Column({ type: 'timestamp', nullable: true })
  next_review_date: Date;

  @Column({ type: 'integer', nullable: true })
  review_frequency_days: number;

  @Column({ type: 'timestamp', nullable: true })
  last_updated_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  data_sources: string;

  @Column({ type: 'timestamp', nullable: true })
  data_as_of_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jurisdiction: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  regulatory_framework: string;

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
  @ManyToOne(() => EntityEntity, entity => entity.riskAnalyses)
  @JoinColumn({ name: 'entity_id' })
  entity: EntityEntity;

  @ManyToOne(() => SubscriberEntity, subscriber => subscriber.riskAnalyses)
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: SubscriberEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'initiated_by' })
  initiator: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: SubscriberUserEntity;

  @ManyToOne(() => SubscriberUserEntity)
  @JoinColumn({ name: 'approved_by' })
  approver: SubscriberUserEntity;

  // Virtual properties
  get is_completed(): boolean {
    return this.analysis_status === 'completed';
  }

  get is_failed(): boolean {
    return this.analysis_status === 'failed';
  }

  get is_pending(): boolean {
    return this.analysis_status === 'pending' || this.analysis_status === 'in_progress';
  }

  get is_high_risk(): boolean {
    return this.risk_level === 'high' || this.risk_level === 'critical';
  }

  get is_critical_risk(): boolean {
    return this.risk_level === 'critical';
  }

  get needs_review(): boolean {
    return this.requires_review || this.is_high_risk || this.exceeds_risk_appetite || this.exceeds_risk_tolerance;
  }

  get is_overdue_review(): boolean {
    return this.next_review_date && this.next_review_date < new Date();
  }

  get processing_time_minutes(): number | null {
    return this.processing_time_seconds ? Math.round((this.processing_time_seconds / 60) * 100) / 100 : null;
  }

  get days_since_analysis(): number | null {
    if (!this.analysis_date) return null;
    
    const diffTime = new Date().getTime() - this.analysis_date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get days_until_next_review(): number | null {
    if (!this.next_review_date) return null;
    
    const diffTime = this.next_review_date.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get analysis_age_days(): number | null {
    if (!this.completed_date) return null;
    
    const diffTime = new Date().getTime() - this.completed_date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get is_stale(): boolean {
    const maxAge = 90; // 90 days
    return this.analysis_age_days !== null && this.analysis_age_days > maxAge;
  }

  get risk_mitigation_effectiveness(): number | null {
    if (!this.inherent_risk_score || !this.residual_risk_score) return null;
    
    const reduction = this.inherent_risk_score - this.residual_risk_score;
    return Math.round((reduction / this.inherent_risk_score) * 100);
  }

  get composite_risk_score(): number {
    if (this.risk_score) return this.risk_score;
    
    let score = 0;
    let components = 0;
    
    if (this.probability_score && this.impact_score) {
      score += (this.probability_score * this.impact_score) / 100;
      components++;
    }
    
    if (this.inherent_risk_score) {
      score += this.inherent_risk_score;
      components++;
    }
    
    if (this.residual_risk_score) {
      score += this.residual_risk_score;
      components++;
    }
    
    return components > 0 ? score / components : 0;
  }

  get risk_level_from_score(): 'low' | 'medium' | 'high' | 'critical' {
    const score = this.composite_risk_score;
    
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  get status_summary(): string {
    const statuses: string[] = [];
    
    statuses.push(`Status: ${this.analysis_status}`);
    if (this.risk_level) statuses.push(`Risk: ${this.risk_level}`);
    
    if (this.requires_review) statuses.push('Needs Review');
    if (this.is_escalated) statuses.push('Escalated');
    if (this.is_approved) statuses.push('Approved');
    if (this.is_exception) statuses.push('Exception');
    if (this.exceeds_risk_appetite) statuses.push('Exceeds Appetite');
    if (this.exceeds_risk_tolerance) statuses.push('Exceeds Tolerance');
    if (this.is_stale) statuses.push('Stale');
    
    return statuses.join(', ');
  }

  get compliance_summary(): string[] {
    const flags: string[] = [];
    
    if (this.is_critical_risk) flags.push('Critical Risk Level');
    if (this.exceeds_risk_appetite) flags.push('Exceeds Risk Appetite');
    if (this.exceeds_risk_tolerance) flags.push('Exceeds Risk Tolerance');
    if (this.requires_review && !this.reviewed_by) flags.push('Pending Review');
    if (this.is_overdue_review) flags.push('Overdue Review');
    if (this.is_escalated && !this.review_decision) flags.push('Escalated - Pending Decision');
    if (this.is_stale) flags.push('Analysis Data Stale');
    if (this.analysis_status === 'failed') flags.push('Analysis Failed');
    if (this.retry_count > 0) flags.push(`Retried ${this.retry_count} times`);
    if (!this.is_approved && this.is_high_risk) flags.push('High Risk - Not Approved');
    
    return flags;
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

  get action_item_list(): string[] {
    if (!this.action_items) return [];
    return this.action_items.split('\n').map(item => item.trim()).filter(Boolean);
  }

  set action_item_list(items: string[]) {
    this.action_items = items.join('\n');
  }

  get recommendation_list(): string[] {
    if (!this.recommendations) return [];
    return this.recommendations.split('\n').map(rec => rec.trim()).filter(Boolean);
  }

  set recommendation_list(recommendations: string[]) {
    this.recommendations = recommendations.join('\n');
  }

  get risk_profile(): {
    inherent: number | null;
    residual: number | null;
    mitigation_effectiveness: number | null;
    control_effectiveness: number | null;
    overall_score: number;
  } {
    return {
      inherent: this.inherent_risk_score,
      residual: this.residual_risk_score,
      mitigation_effectiveness: this.risk_mitigation_effectiveness,
      control_effectiveness: this.control_effectiveness_score,
      overall_score: this.composite_risk_score,
    };
  }

  get priority_level(): 'low' | 'medium' | 'high' | 'critical' {
    if (this.is_critical_risk || (this.is_escalated && !this.review_decision)) return 'critical';
    if (this.is_high_risk || this.exceeds_risk_tolerance || this.is_overdue_review) return 'high';
    if (this.needs_review || this.exceeds_risk_appetite) return 'medium';
    return 'low';
  }

  get data_quality_score(): number {
    let score = 100;
    
    if (!this.data_as_of_date) score -= 20;
    if (!this.data_sources) score -= 15;
    if (!this.confidence_level) score -= 10;
    if (this.analysis_age_days && this.analysis_age_days > 30) score -= 15;
    if (this.retry_count > 0) score -= (this.retry_count * 5);
    
    return Math.max(0, score);
  }
}