import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IndividualEntity } from '../../entities/entities/individual-entity.entity';

@Entity('individual_entity_relationships')
@Index(['primary_individual_id'])
@Index(['related_individual_id'])
@Index(['relationship_type'])
@Index(['relationship_status'])
@Index(['is_primary'])
export class IndividualEntityRelationshipEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  primary_individual_id: string;

  @Column({ type: 'uuid' })
  related_individual_id: string;

  @Column({ 
    type: 'enum', 
    enum: [
      'spouse', 'child', 'parent', 'sibling', 'relative', 'guardian', 'ward',
      'business_partner', 'associate', 'employee', 'employer', 'director',
      'shareholder', 'beneficial_owner', 'authorized_signatory', 'power_of_attorney',
      'trustee', 'beneficiary', 'settlor', 'protector', 'nominee',
      'agent', 'representative', 'advisor', 'consultant', 'other'
    ]
  })
  relationship_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  relationship_description: string;

  @Column({ 
    type: 'enum', 
    enum: ['active', 'inactive', 'terminated', 'suspended', 'pending'], 
    default: 'active' 
  })
  relationship_status: 'active' | 'inactive' | 'terminated' | 'suspended' | 'pending';

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @Column({ type: 'boolean', default: false })
  is_reciprocal: boolean;

  @Column({ type: 'date', nullable: true })
  relationship_start_date: Date;

  @Column({ type: 'date', nullable: true })
  relationship_end_date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ownership_percentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  financial_interest_amount: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  financial_interest_currency: string;

  @Column({ type: 'text', nullable: true })
  legal_basis: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  legal_document_reference: string;

  @Column({ type: 'date', nullable: true })
  legal_document_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jurisdiction: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false })
  is_pep_related: boolean;

  @Column({ type: 'boolean', default: false })
  is_sanctions_related: boolean;

  @Column({ type: 'boolean', default: false })
  requires_enhanced_due_diligence: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  risk_level: string;

  @Column({ type: 'text', nullable: true })
  risk_factors: string;

  @Column({ type: 'date', nullable: true })
  last_reviewed_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reviewed_by: string;

  @Column({ type: 'date', nullable: true })
  next_review_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source_of_information: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'date', nullable: true })
  verification_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verified_by: string;

  @Column({ type: 'text', nullable: true })
  verification_method: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => IndividualEntity, individual => individual.primary_relationships)
  @JoinColumn({ name: 'primary_individual_id' })
  primary_individual: IndividualEntity;

  @ManyToOne(() => IndividualEntity, individual => individual.related_relationships)
  @JoinColumn({ name: 'related_individual_id' })
  related_individual: IndividualEntity;

  // Virtual properties
  get is_current(): boolean {
    const now = new Date();
    const startValid = !this.relationship_start_date || this.relationship_start_date <= now;
    const endValid = !this.relationship_end_date || this.relationship_end_date >= now;
    return this.is_active && startValid && endValid;
  }

  get is_expired(): boolean {
    return this.relationship_end_date && this.relationship_end_date < new Date();
  }

  get is_future(): boolean {
    return this.relationship_start_date && this.relationship_start_date > new Date();
  }

  get duration_days(): number | null {
    if (!this.relationship_start_date) return null;
    
    const endDate = this.relationship_end_date || new Date();
    const diffTime = endDate.getTime() - this.relationship_start_date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get is_high_risk(): boolean {
    return this.is_pep_related || 
           this.is_sanctions_related || 
           this.requires_enhanced_due_diligence ||
           this.risk_level === 'high';
  }

  get needs_review(): boolean {
    if (!this.next_review_date) return true;
    return this.next_review_date <= new Date();
  }

  get verification_status(): 'verified' | 'pending' | 'expired' {
    if (!this.is_verified) return 'pending';
    
    if (this.verification_date) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      if (this.verification_date < sixMonthsAgo) {
        return 'expired';
      }
    }
    
    return 'verified';
  }

  get relationship_summary(): string {
    const primary = this.primary_individual?.full_name || 'Unknown';
    const related = this.related_individual?.full_name || 'Unknown';
    const type = this.relationship_type.replace('_', ' ');
    
    return `${primary} is ${type} of ${related}`;
  }

  get financial_summary(): string | null {
    if (!this.financial_interest_amount && !this.ownership_percentage) {
      return null;
    }

    const parts: string[] = [];
    
    if (this.ownership_percentage) {
      parts.push(`${this.ownership_percentage}% ownership`);
    }
    
    if (this.financial_interest_amount) {
      const currency = this.financial_interest_currency || 'USD';
      parts.push(`${currency} ${this.financial_interest_amount.toLocaleString()}`);
    }
    
    return parts.join(', ');
  }

  get compliance_flags(): string[] {
    const flags: string[] = [];
    
    if (this.is_pep_related) flags.push('PEP Related');
    if (this.is_sanctions_related) flags.push('Sanctions Related');
    if (this.requires_enhanced_due_diligence) flags.push('Enhanced Due Diligence Required');
    if (this.is_high_risk) flags.push('High Risk');
    if (!this.is_verified) flags.push('Unverified');
    if (this.verification_status === 'expired') flags.push('Verification Expired');
    if (this.needs_review) flags.push('Review Required');
    
    return flags;
  }
}