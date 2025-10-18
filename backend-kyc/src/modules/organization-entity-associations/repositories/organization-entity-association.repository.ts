import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, IsNull } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
import { OrganizationEntityAssociationEntity } from '../entities/organization-entity-association.entity';
import { PaginationOptions, PaginationResult } from '../../common/interfaces/pagination.interface';
import { BaseFilter } from '../../common/interfaces/filter.interface';
import { QueryHelper } from '../../../utils/database/query.helper';

export interface OrganizationEntityAssociationFilter extends BaseFilter {
  organization_id?: string;
  individual_id?: string;
  association_type?: string;
  association_status?: string;
  is_beneficial_owner?: boolean;
  is_authorized_signatory?: boolean;
  is_key_management_personnel?: boolean;
  is_ultimate_beneficial_owner?: boolean;
  is_pep?: boolean;
  is_sanctions_related?: boolean;
  requires_enhanced_due_diligence?: boolean;
  risk_level?: string;
  is_verified?: boolean;
  verification_status?: 'verified' | 'pending' | 'expired';
  needs_review?: boolean;
  is_current?: boolean;
  is_expired?: boolean;
  is_future?: boolean;
  is_significant_control?: boolean;
  control_level?: 'none' | 'minor' | 'significant' | 'controlling' | 'ultimate';
  search?: string;
  created_by?: string;
  updated_by?: string;
  association_types?: string[];
  risk_levels?: string[];
  organization_ids?: string[];
  individual_ids?: string[];
  start_date_from?: Date;
  start_date_to?: Date;
  end_date_from?: Date;
  end_date_to?: Date;
  ownership_percentage_min?: number;
  ownership_percentage_max?: number;
  voting_rights_percentage_min?: number;
  voting_rights_percentage_max?: number;
}

@Injectable()
export class OrganizationEntityAssociationRepository extends BaseRepository<OrganizationEntityAssociationEntity> {
  constructor(
    @InjectRepository(OrganizationEntityAssociationEntity)
    repository: Repository<OrganizationEntityAssociationEntity>,
  ) {
    super(repository);
  }

  async findWithFilters(
    filter: OrganizationEntityAssociationFilter = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind');

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at', 'organization_name', 'individual_name']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findByOrganizationId(
    organizationId: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.organization_id = :organizationId', { organizationId });

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at', 'organization_name', 'individual_name']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findByIndividualId(
    individualId: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.individual_id = :individualId', { individualId });

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findBeneficialOwners(
    organizationId?: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.is_beneficial_owner = true')
      .andWhere('assoc.deleted_at IS NULL');

    if (organizationId) {
      queryBuilder.andWhere('assoc.organization_id = :organizationId', { organizationId });
    }

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findUltimateBeneficialOwners(
    organizationId?: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.is_ultimate_beneficial_owner = true')
      .andWhere('assoc.deleted_at IS NULL');

    if (organizationId) {
      queryBuilder.andWhere('assoc.organization_id = :organizationId', { organizationId });
    }

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findAuthorizedSignatories(
    organizationId: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.organization_id = :organizationId', { organizationId })
      .andWhere('assoc.is_authorized_signatory = true')
      .andWhere('assoc.deleted_at IS NULL');

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findKeyManagementPersonnel(
    organizationId: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.organization_id = :organizationId', { organizationId })
      .andWhere('assoc.is_key_management_personnel = true')
      .andWhere('assoc.deleted_at IS NULL');

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findSignificantControlPersons(
    organizationId?: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.deleted_at IS NULL')
      .andWhere('(assoc.ownership_percentage >= 25 OR assoc.voting_rights_percentage >= 25 OR assoc.is_beneficial_owner = true OR assoc.is_ultimate_beneficial_owner = true OR assoc.is_key_management_personnel = true)');

    if (organizationId) {
      queryBuilder.andWhere('assoc.organization_id = :organizationId', { organizationId });
    }

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findHighRiskAssociations(
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.deleted_at IS NULL')
      .andWhere('(assoc.is_pep = true OR assoc.is_sanctions_related = true OR assoc.requires_enhanced_due_diligence = true OR assoc.risk_level = :riskLevel)', 
        { riskLevel: 'high' });

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findPEPAssociations(
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.is_pep = true')
      .andWhere('assoc.deleted_at IS NULL');

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findUnverifiedAssociations(
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.is_verified = false')
      .andWhere('assoc.deleted_at IS NULL');

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findExpiredVerifications(
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.is_verified = true')
      .andWhere('assoc.verification_date < :sixMonthsAgo', { sixMonthsAgo })
      .andWhere('assoc.deleted_at IS NULL');

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findAssociationsNeedingReview(
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const today = new Date();

    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.deleted_at IS NULL')
      .andWhere('(assoc.next_review_date IS NULL OR assoc.next_review_date <= :today)', { today });

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findCurrentAssociations(
    organizationId?: string,
    individualId?: string,
    filter: Partial<OrganizationEntityAssociationFilter> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<OrganizationEntityAssociationEntity>> {
    const today = new Date();

    const queryBuilder = this.createQueryBuilder('assoc')
      .leftJoinAndSelect('assoc.organization', 'org')
      .leftJoinAndSelect('assoc.individual', 'ind')
      .where('assoc.association_status = :status', { status: 'active' })
      .andWhere('(assoc.association_start_date IS NULL OR assoc.association_start_date <= :today)', { today })
      .andWhere('(assoc.association_end_date IS NULL OR assoc.association_end_date >= :today)', { today })
      .andWhere('assoc.deleted_at IS NULL');

    if (organizationId) {
      queryBuilder.andWhere('assoc.organization_id = :organizationId', { organizationId });
    }

    if (individualId) {
      queryBuilder.andWhere('assoc.individual_id = :individualId', { individualId });
    }

    this.applyFilters(queryBuilder, filter);
    QueryHelper.applySorting(queryBuilder, pagination.sortBy, pagination.sortOrder, ['created_at', 'updated_at']);

    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  async findOwnershipStructure(
    organizationId: string,
    minOwnership: number = 0
  ): Promise<OrganizationEntityAssociationEntity[]> {
    return this.find({
      where: {
        organization_id: organizationId,
        ownership_percentage: minOwnership > 0 ? 
          QueryHelper.createGreaterThanOrEqualCondition(minOwnership) : 
          QueryHelper.createNotNullCondition(),
        deleted_at: IsNull()
      },
      relations: ['individual', 'organization'],
      order: {
        ownership_percentage: 'DESC'
      }
    });
  }

  async getOwnershipSummary(organizationId: string): Promise<{
    total_ownership_accounted: number;
    beneficial_owners_count: number;
    ultimate_beneficial_owners_count: number;
    significant_control_persons_count: number;
    largest_shareholder: OrganizationEntityAssociationEntity | null;
    ownership_distribution: { range: string; count: number }[];
  }> {
    const associations = await this.find({
      where: {
        organization_id: organizationId,
        deleted_at: IsNull()
      },
      relations: ['individual']
    });

    const totalOwnership = associations
      .filter(a => a.ownership_percentage)
      .reduce((sum, a) => sum + (a.ownership_percentage || 0), 0);

    const beneficialOwnersCount = associations.filter(a => a.is_beneficial_owner).length;
    const ultimateBeneficialOwnersCount = associations.filter(a => a.is_ultimate_beneficial_owner).length;
    const significantControlCount = associations.filter(a => a.is_significant_control).length;

    const largestShareholder = associations
      .filter(a => a.ownership_percentage)
      .sort((a, b) => (b.ownership_percentage || 0) - (a.ownership_percentage || 0))[0] || null;

    const ownershipRanges = [
      { range: '0-5%', min: 0, max: 5 },
      { range: '5-10%', min: 5, max: 10 },
      { range: '10-25%', min: 10, max: 25 },
      { range: '25-50%', min: 25, max: 50 },
      { range: '50%+', min: 50, max: 100 }
    ];

    const ownershipDistribution = ownershipRanges.map(range => ({
      range: range.range,
      count: associations.filter(a => {
        const ownership = a.ownership_percentage || 0;
        return ownership > range.min && ownership <= range.max;
      }).length
    }));

    return {
      total_ownership_accounted: totalOwnership,
      beneficial_owners_count: beneficialOwnersCount,
      ultimate_beneficial_owners_count: ultimateBeneficialOwnersCount,
      significant_control_persons_count: significantControlCount,
      largest_shareholder: largestShareholder,
      ownership_distribution: ownershipDistribution
    };
  }

  async updateVerificationStatus(
    associationId: string,
    isVerified: boolean,
    verifiedBy?: string,
    verificationMethod?: string
  ): Promise<boolean> {
    const updateData: Partial<OrganizationEntityAssociationEntity> = {
      is_verified: isVerified,
      verification_date: isVerified ? new Date() : null,
      verified_by: verifiedBy,
      verification_method: verificationMethod,
      updated_at: new Date()
    };

    const result = await this.update(associationId, updateData);
    return (result.affected ?? 0) > 0;
  }

  async updateReviewDate(
    associationId: string,
    reviewedBy: string,
    nextReviewDate?: Date
  ): Promise<boolean> {
    const updateData: Partial<OrganizationEntityAssociationEntity> = {
      last_reviewed_date: new Date(),
      reviewed_by: reviewedBy,
      next_review_date: nextReviewDate,
      updated_at: new Date()
    };

    const result = await this.update(associationId, updateData);
    return (result.affected ?? 0) > 0;
  }

  async updateRiskLevel(
    associationId: string,
    riskLevel: string,
    riskFactors?: string,
    updatedBy?: string
  ): Promise<boolean> {
    const updateData: Partial<OrganizationEntityAssociationEntity> = {
      risk_level: riskLevel,
      risk_factors: riskFactors,
      updated_by: updatedBy,
      updated_at: new Date()
    };

    const result = await this.update(associationId, updateData);
    return (result.affected ?? 0) > 0;
  }

  async getAssociationStatistics(organizationId?: string, individualId?: string): Promise<{
    total_associations: number;
    active_associations: number;
    expired_associations: number;
    beneficial_owners: number;
    ultimate_beneficial_owners: number;
    authorized_signatories: number;
    key_management_personnel: number;
    high_risk_associations: number;
    unverified_associations: number;
    associations_needing_review: number;
    association_types: Record<string, number>;
    risk_levels: Record<string, number>;
    control_levels: Record<string, number>;
  }> {
    const queryBuilder = this.createQueryBuilder('assoc')
      .where('assoc.deleted_at IS NULL');

    if (organizationId) {
      queryBuilder.andWhere('assoc.organization_id = :organizationId', { organizationId });
    }

    if (individualId) {
      queryBuilder.andWhere('assoc.individual_id = :individualId', { individualId });
    }

    const associations = await queryBuilder.getMany();
    const today = new Date();

    const stats = {
      total_associations: associations.length,
      active_associations: associations.filter(a => a.association_status === 'active').length,
      expired_associations: associations.filter(a => a.association_end_date && a.association_end_date < today).length,
      beneficial_owners: associations.filter(a => a.is_beneficial_owner).length,
      ultimate_beneficial_owners: associations.filter(a => a.is_ultimate_beneficial_owner).length,
      authorized_signatories: associations.filter(a => a.is_authorized_signatory).length,
      key_management_personnel: associations.filter(a => a.is_key_management_personnel).length,
      high_risk_associations: associations.filter(a => a.is_high_risk).length,
      unverified_associations: associations.filter(a => !a.is_verified).length,
      associations_needing_review: associations.filter(a => a.needs_review).length,
      association_types: {} as Record<string, number>,
      risk_levels: {} as Record<string, number>,
      control_levels: {} as Record<string, number>
    };

    // Count by association type
    associations.forEach(assoc => {
      stats.association_types[assoc.association_type] = (stats.association_types[assoc.association_type] || 0) + 1;
    });

    // Count by risk level
    associations.forEach(assoc => {
      if (assoc.risk_level) {
        stats.risk_levels[assoc.risk_level] = (stats.risk_levels[assoc.risk_level] || 0) + 1;
      }
    });

    // Count by control level
    associations.forEach(assoc => {
      const controlLevel = assoc.control_level;
      stats.control_levels[controlLevel] = (stats.control_levels[controlLevel] || 0) + 1;
    });

    return stats;
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<OrganizationEntityAssociationEntity>,
    filter: OrganizationEntityAssociationFilter
  ): void {
    QueryHelper.applyBaseFilters(queryBuilder, filter, 'assoc');

    if (filter.organization_id) {
      queryBuilder.andWhere('assoc.organization_id = :organizationId', { 
        organizationId: filter.organization_id 
      });
    }

    if (filter.individual_id) {
      queryBuilder.andWhere('assoc.individual_id = :individualId', { 
        individualId: filter.individual_id 
      });
    }

    if (filter.association_type) {
      queryBuilder.andWhere('assoc.association_type = :associationType', { 
        associationType: filter.association_type 
      });
    }

    if (filter.association_status) {
      queryBuilder.andWhere('assoc.association_status = :associationStatus', { 
        associationStatus: filter.association_status 
      });
    }

    if (filter.is_beneficial_owner !== undefined) {
      queryBuilder.andWhere('assoc.is_beneficial_owner = :isBeneficialOwner', { 
        isBeneficialOwner: filter.is_beneficial_owner 
      });
    }

    if (filter.is_authorized_signatory !== undefined) {
      queryBuilder.andWhere('assoc.is_authorized_signatory = :isAuthorizedSignatory', { 
        isAuthorizedSignatory: filter.is_authorized_signatory 
      });
    }

    if (filter.is_key_management_personnel !== undefined) {
      queryBuilder.andWhere('assoc.is_key_management_personnel = :isKeyManagement', { 
        isKeyManagement: filter.is_key_management_personnel 
      });
    }

    if (filter.is_ultimate_beneficial_owner !== undefined) {
      queryBuilder.andWhere('assoc.is_ultimate_beneficial_owner = :isUltimateBO', { 
        isUltimateBO: filter.is_ultimate_beneficial_owner 
      });
    }

    if (filter.is_pep !== undefined) {
      queryBuilder.andWhere('assoc.is_pep = :isPep', { isPep: filter.is_pep });
    }

    if (filter.is_sanctions_related !== undefined) {
      queryBuilder.andWhere('assoc.is_sanctions_related = :isSanctionsRelated', { 
        isSanctionsRelated: filter.is_sanctions_related 
      });
    }

    if (filter.requires_enhanced_due_diligence !== undefined) {
      queryBuilder.andWhere('assoc.requires_enhanced_due_diligence = :requiresEdd', { 
        requiresEdd: filter.requires_enhanced_due_diligence 
      });
    }

    if (filter.risk_level) {
      queryBuilder.andWhere('assoc.risk_level = :riskLevel', { riskLevel: filter.risk_level });
    }

    if (filter.is_verified !== undefined) {
      queryBuilder.andWhere('assoc.is_verified = :isVerified', { isVerified: filter.is_verified });
    }

    if (filter.created_by) {
      queryBuilder.andWhere('assoc.created_by = :createdBy', { createdBy: filter.created_by });
    }

    if (filter.updated_by) {
      queryBuilder.andWhere('assoc.updated_by = :updatedBy', { updatedBy: filter.updated_by });
    }

    if (filter.association_types?.length) {
      QueryHelper.applyInClause(queryBuilder, 'assoc.association_type', filter.association_types, 'associationTypes');
    }

    if (filter.risk_levels?.length) {
      QueryHelper.applyInClause(queryBuilder, 'assoc.risk_level', filter.risk_levels, 'riskLevels');
    }

    if (filter.organization_ids?.length) {
      QueryHelper.applyInClause(queryBuilder, 'assoc.organization_id', filter.organization_ids, 'organizationIds');
    }

    if (filter.individual_ids?.length) {
      QueryHelper.applyInClause(queryBuilder, 'assoc.individual_id', filter.individual_ids, 'individualIds');
    }

    if (filter.start_date_from) {
      queryBuilder.andWhere('assoc.association_start_date >= :startDateFrom', { 
        startDateFrom: filter.start_date_from 
      });
    }

    if (filter.start_date_to) {
      queryBuilder.andWhere('assoc.association_start_date <= :startDateTo', { 
        startDateTo: filter.start_date_to 
      });
    }

    if (filter.end_date_from) {
      queryBuilder.andWhere('assoc.association_end_date >= :endDateFrom', { 
        endDateFrom: filter.end_date_from 
      });
    }

    if (filter.end_date_to) {
      queryBuilder.andWhere('assoc.association_end_date <= :endDateTo', { 
        endDateTo: filter.end_date_to 
      });
    }

    if (filter.ownership_percentage_min !== undefined) {
      queryBuilder.andWhere('assoc.ownership_percentage >= :ownershipMin', { 
        ownershipMin: filter.ownership_percentage_min 
      });
    }

    if (filter.ownership_percentage_max !== undefined) {
      queryBuilder.andWhere('assoc.ownership_percentage <= :ownershipMax', { 
        ownershipMax: filter.ownership_percentage_max 
      });
    }

    if (filter.voting_rights_percentage_min !== undefined) {
      queryBuilder.andWhere('assoc.voting_rights_percentage >= :votingRightsMin', { 
        votingRightsMin: filter.voting_rights_percentage_min 
      });
    }

    if (filter.voting_rights_percentage_max !== undefined) {
      queryBuilder.andWhere('assoc.voting_rights_percentage <= :votingRightsMax', { 
        votingRightsMax: filter.voting_rights_percentage_max 
      });
    }

    if (filter.search) {
      queryBuilder.andWhere(
        '(assoc.position_title ILIKE :search OR assoc.role_description ILIKE :search OR assoc.notes ILIKE :search)',
        { search: `%${filter.search}%` }
      );
    }
  }
}