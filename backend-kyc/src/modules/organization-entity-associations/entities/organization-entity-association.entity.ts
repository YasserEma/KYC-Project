import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrganizationEntity } from '../../entities/entities/organization-entity.entity';
import { IndividualEntity } from '../../entities/entities/individual-entity.entity';

@Entity('organization_entity_associations')
@Index(['organization_id'])
@Index(['individual_id'])
@Index(['association_type'])
@Index(['association_status'])
@Index(['is_beneficial_owner'])
@Index(['is_authorized_signatory'])
export class OrganizationEntityAssociationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  organization_id: string;

  @Column({ type: 'uuid' })
  individual_id: string;

  @Column({ 
    type: 'enum', 
    enum: [
      'director', 'officer', 'shareholder', 'beneficial_owner', 'authorized_signatory',
      'trustee', 'protector', 'settlor', 'beneficiary', 'nominee',
      'employee', 'consultant', 'advisor', 'agent', 'representative',
      'partner', 'member', 'manager', 'controller', 'other'
    ]
  })
  association_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position_title: string;

  @Column({ type: 'text', nullable: true })
  role_description: string;

  @Column({ 
    type: 'enum', 
    enum: ['active', 'inactive', 'terminated', 'suspended', 'pending'], 
    default: 'active' 
  })
  association_status: 'active' | 'inactive' | 'terminated' | 'suspended' | 'pending';

  @Column({ type: 'boolean', default: false })
  is_beneficial_owner: boolean;

  @Column({ type: 'boolean', default: false })
  is_authorized_signatory: boolean;

  @Column({ type: 'boolean', default: false })
  is_key_management_personnel: boolean;

  @Column({ type: 'boolean', default: false })
  is_ultimate_beneficial_owner: boolean;

  @Column({ type: 'date', nullable: true })
  association_start_date: Date;

  @Column({ type: 'date', nullable: true })
  association_end_date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ownership_percentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  voting_rights_percentage: number;

  @Column({ type: 'integer', nullable: true })
  number_of_shares: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  share_class: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  share_value: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  share_currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  compensation_amount: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  compensation_currency: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  compensation_frequency: string;

  @Column({ type: 'text', nullable: true })
  appointment_method: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  appointing_authority: string;

  @Column({ type: 'date', nullable: true })
  appointment_date: Date;

  @Column({ type: 'text', nullable: true })
  termination_reason: string;

  @Column({ type: 'date', nullable: true })
  termination_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jurisdiction: string;

  @Column({ type: 'text', nullable: true })
  legal_basis: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  legal_document_reference: string;

  @Column({ type: 'date', nullable: true })
  legal_document_date: Date;

  @Column({ type: 'text', nullable: true })
  powers_and_authorities: string;

  @Column({ type: 'text', nullable: true })
  limitations_and_restrictions: string;

  @Column({ type: 'text', nullable: true })
  fiduciary_duties: string;

  @Column({ type: 'boolean', default: false })
  is_pep: boolean;

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

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => OrganizationEntity, (organization: OrganizationEntity) => organization.associations)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @ManyToOne(() => IndividualEntity, individual => individual.organization_associations)
  @JoinColumn({ name: 'individual_id' })
  individual: IndividualEntity;

  // Virtual properties
  get is_current(): boolean {
    const now = new Date();
    const startValid = !this.association_start_date || this.association_start_date <= now;
    const endValid = !this.association_end_date || this.association_end_date >= now;
    return this.is_active && startValid && endValid;
  }

  get is_expired(): boolean {
    return this.association_end_date && this.association_end_date < new Date();
  }

  get is_future(): boolean {
    return this.association_start_date && this.association_start_date > new Date();
  }

  get duration_days(): number | null {
    if (!this.association_start_date) return null;
    
    const endDate = this.association_end_date || new Date();
    const diffTime = endDate.getTime() - this.association_start_date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get is_high_risk(): boolean {
    return this.is_pep || 
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

  get is_significant_control(): boolean {
    return this.ownership_percentage >= 25 || 
           this.voting_rights_percentage >= 25 ||
           this.is_beneficial_owner ||
           this.is_ultimate_beneficial_owner ||
           this.is_key_management_personnel;
  }

  get control_level(): 'none' | 'minor' | 'significant' | 'controlling' | 'ultimate' {
    if (this.is_ultimate_beneficial_owner) return 'ultimate';
    
    const maxPercentage = Math.max(
      this.ownership_percentage || 0,
      this.voting_rights_percentage || 0
    );
    
    if (maxPercentage >= 50 || this.is_key_management_personnel) return 'controlling';
    if (maxPercentage >= 25 || this.is_beneficial_owner) return 'significant';
    if (maxPercentage > 0) return 'minor';
    
    return 'none';
  }

  get association_summary(): string {
    const individual = this.individual?.full_name || 'Unknown Individual';
    const organization = this.organization?.legal_name || 'Unknown Organization';
    const type = this.association_type.replace('_', ' ');
    
    return `${individual} is ${type} of ${organization}`;
  }

  get financial_summary(): string | null {
    const parts: string[] = [];
    
    if (this.ownership_percentage) {
      parts.push(`${this.ownership_percentage}% ownership`);
    }
    
    if (this.voting_rights_percentage) {
      parts.push(`${this.voting_rights_percentage}% voting rights`);
    }
    
    if (this.number_of_shares) {
      const shareInfo = this.share_class ? 
        `${this.number_of_shares} ${this.share_class} shares` :
        `${this.number_of_shares} shares`;
      parts.push(shareInfo);
    }
    
    if (this.share_value) {
      const currency = this.share_currency || 'USD';
      parts.push(`${currency} ${this.share_value.toLocaleString()} share value`);
    }
    
    if (this.compensation_amount) {
      const currency = this.compensation_currency || 'USD';
      const frequency = this.compensation_frequency || 'annual';
      parts.push(`${currency} ${this.compensation_amount.toLocaleString()} ${frequency} compensation`);
    }
    
    return parts.length > 0 ? parts.join(', ') : null;
  }

  get compliance_flags(): string[] {
    const flags: string[] = [];
    
    if (this.is_pep) flags.push('PEP');
    if (this.is_sanctions_related) flags.push('Sanctions Related');
    if (this.requires_enhanced_due_diligence) flags.push('Enhanced Due Diligence Required');
    if (this.is_beneficial_owner) flags.push('Beneficial Owner');
    if (this.is_ultimate_beneficial_owner) flags.push('Ultimate Beneficial Owner');
    if (this.is_authorized_signatory) flags.push('Authorized Signatory');
    if (this.is_key_management_personnel) flags.push('Key Management Personnel');
    if (this.is_significant_control) flags.push('Significant Control');
    if (this.is_high_risk) flags.push('High Risk');
    if (!this.is_verified) flags.push('Unverified');
    if (this.verification_status === 'expired') flags.push('Verification Expired');
    if (this.needs_review) flags.push('Review Required');
    
    return flags;
  }

  get authority_level(): 'none' | 'limited' | 'standard' | 'broad' | 'unlimited' {
    if (!this.powers_and_authorities) return 'none';
    
    const powers = this.powers_and_authorities.toLowerCase();
    
    if (powers.includes('unlimited') || powers.includes('full authority')) return 'unlimited';
    if (powers.includes('broad') || powers.includes('general')) return 'broad';
    if (powers.includes('limited') || powers.includes('restricted')) return 'limited';
    if (powers.includes('specific') || powers.includes('defined')) return 'standard';
    
    return 'standard';
  }
}