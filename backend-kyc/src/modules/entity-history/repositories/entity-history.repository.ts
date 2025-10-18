import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder , IsNull} from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
import { EntityHistoryEntity } from '../entities/entity-history.entity';
import { PaginationOptions, PaginationResult } from '../../common/interfaces/pagination.interface';
import { BaseFilter, FilterOptions } from '../../common/interfaces/filter.interface';
import { QueryHelper } from '../../../utils/database/query.helper';

export interface EntityHistoryFilter extends BaseFilter {
  entity_id?: string;
  changed_by?: string;
  change_type?: 'created' | 'updated' | 'deleted' | 'restored' | 'status_changed' | 'risk_updated' | 'screening_updated';
  is_system_change?: boolean;
  is_major_change?: boolean;
  batch_id?: string;
  correlation_id?: string;
  session_id?: string;
  changed_fields?: string[];
  has_validation_errors?: boolean;
  is_reversible?: boolean;
}

@Injectable()
export class EntityHistoryRepository extends BaseRepository<EntityHistoryEntity> {
  constructor(
    @InjectRepository(EntityHistoryEntity)
    private readonly entityHistoryRepository: Repository<EntityHistoryEntity>,
  ) {
    super(entityHistoryRepository);
  }

  /**
   * Find entity history with advanced filtering and pagination
   */
  async findWithFilters(
    filters: EntityHistoryFilter = {},
    options: FilterOptions = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginationResult<EntityHistoryEntity>> {
    const queryBuilder = this.createFilteredQuery(filters, options);
    return QueryHelper.buildPaginationResult(queryBuilder, pagination);
  }

  /**
   * Find history for a specific entity
   */
  async findByEntityId(
    entityId: string,
    limit: number = 50
  ): Promise<EntityHistoryEntity[]> {
    return this.entityHistoryRepository.find({
      where: { 
        entity_id: entityId,
        is_active: true,
        deleted_at: IsNull()
      },
      order: { created_at: 'DESC' },
      take: limit,
      relations: ['user']
    });
  }

  /**
   * Find history by correlation ID (related changes)
   */
  async findByCorrelationId(correlationId: string): Promise<EntityHistoryEntity[]> {
    return this.entityHistoryRepository.find({
      where: { 
        correlation_id: correlationId,
        is_active: true,
        deleted_at: IsNull()
      },
      order: { created_at: 'ASC' },
      relations: ['entity', 'user']
    });
  }

  /**
   * Find history by batch ID (bulk operations)
   */
  async findByBatchId(batchId: string): Promise<EntityHistoryEntity[]> {
    return this.entityHistoryRepository.find({
      where: { 
        batch_id: batchId,
        is_active: true,
        deleted_at: IsNull()
      },
      order: { created_at: 'ASC' },
      relations: ['entity', 'user']
    });
  }

  /**
   * Find recent changes by user
   */
  async findRecentChangesByUser(
    userId: string,
    hours: number = 24,
    limit: number = 50
  ): Promise<EntityHistoryEntity[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    return this.entityHistoryRepository.find({
      where: {
        changed_by: userId,
        created_at: { $gte: since } as any,
        is_active: true,
        deleted_at: IsNull()
      },
      order: { created_at: 'DESC' },
      take: limit,
      relations: ['entity']
    });
  }

  /**
   * Find major changes (created, deleted, status changes, etc.)
   */
  async findMajorChanges(
    entityId?: string,
    limit: number = 100
  ): Promise<EntityHistoryEntity[]> {
    const majorChangeTypes = ['created', 'deleted', 'status_changed', 'risk_updated'];
    
    const queryBuilder = this.entityHistoryRepository
      .createQueryBuilder('history')
      .where('history.change_type IN (:...changeTypes)', { changeTypes: majorChangeTypes })
      .andWhere('history.is_active = :isActive', { isActive: true })
      .andWhere('history.deleted_at IS NULL')
      .orderBy('history.created_at', 'DESC')
      .limit(limit);

    if (entityId) {
      queryBuilder.andWhere('history.entity_id = :entityId', { entityId });
    }

    return queryBuilder.getMany();
  }

  /**
   * Create history entry
   */
  async createHistoryEntry(data: {
    entity_id: string;
    changed_by?: string;
    change_type: 'created' | 'updated' | 'deleted' | 'restored' | 'status_changed' | 'risk_updated' | 'screening_updated';
    change_description?: string;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    changed_fields?: string[];
    change_reason?: string;
    metadata?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    session_id?: string;
    correlation_id?: string;
    api_version?: string;
    is_system_change?: boolean;
    batch_id?: string;
    version_number?: number;
    validation_errors?: Record<string, any>;
    is_reversible?: boolean;
    reversal_instructions?: string;
  }): Promise<EntityHistoryEntity> {
    const history = this.entityHistoryRepository.create(data);
    return this.entityHistoryRepository.save(history);
  }

  /**
   * Get entity version history
   */
  async getEntityVersions(entityId: string): Promise<EntityHistoryEntity[]> {
    return this.entityHistoryRepository.find({
      where: { 
        entity_id: entityId,
        version_number: { $ne: null } as any,
        is_active: true,
        deleted_at: IsNull()
      },
      order: { version_number: 'DESC' },
      relations: ['user']
    });
  }

  /**
   * Get change statistics
   */
  async getChangeStats(
    entityId?: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<{
    total: number;
    byChangeType: Record<string, number>;
    byUser: Record<string, number>;
    systemChanges: number;
    userChanges: number;
    majorChanges: number;
    minorChanges: number;
  }> {
    const queryBuilder = this.entityHistoryRepository.createQueryBuilder('history');
    
    queryBuilder.where('history.is_active = :isActive', { isActive: true });
    queryBuilder.andWhere('history.deleted_at IS NULL');

    if (entityId) {
      queryBuilder.andWhere('history.entity_id = :entityId', { entityId });
    }

    if (fromDate) {
      queryBuilder.andWhere('history.created_at >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('history.created_at <= :toDate', { toDate });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get stats by change type
    const changeTypeStats = await queryBuilder
      .clone()
      .select('history.change_type', 'change_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('history.change_type')
      .getRawMany();

    // Get stats by user
    const userStats = await queryBuilder
      .clone()
      .select('history.changed_by', 'changed_by')
      .addSelect('COUNT(*)', 'count')
      .where('history.changed_by IS NOT NULL')
      .groupBy('history.changed_by')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Get system vs user changes
    const systemChanges = await queryBuilder
      .clone()
      .where('history.is_system_change = :isSystemChange', { isSystemChange: true })
      .getCount();

    const userChanges = total - systemChanges;

    // Get major vs minor changes
    const majorChangeTypes = ['created', 'deleted', 'status_changed', 'risk_updated'];
    const majorChanges = await queryBuilder
      .clone()
      .where('history.change_type IN (:...changeTypes)', { changeTypes: majorChangeTypes })
      .getCount();

    const minorChanges = total - majorChanges;

    const byChangeType = changeTypeStats.reduce((acc, stat) => {
      acc[stat.change_type] = parseInt(stat.count);
      return acc;
    }, {});

    const byUser = userStats.reduce((acc, stat) => {
      acc[stat.changed_by] = parseInt(stat.count);
      return acc;
    }, {});

    return {
      total,
      byChangeType,
      byUser,
      systemChanges,
      userChanges,
      majorChanges,
      minorChanges
    };
  }

  /**
   * Cleanup old history entries
   */
  async cleanupOldHistory(retentionDays: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.entityHistoryRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :cutoffDate', { cutoffDate })
      .andWhere('change_type NOT IN (:...protectedTypes)', { 
        protectedTypes: ['created', 'deleted'] // Keep creation and deletion records
      })
      .execute();

    return result.affected || 0;
  }

  /**
   * Create filtered query builder
   */
  private createFilteredQuery(
    filters: EntityHistoryFilter,
    options: FilterOptions
  ): SelectQueryBuilder<EntityHistoryEntity> {
    const queryBuilder = this.entityHistoryRepository.createQueryBuilder('history');

    // Apply base filters
    QueryHelper.applyBaseFilters(queryBuilder, filters, 'history');
    QueryHelper.applySoftDeleteFilter(queryBuilder, 'history');

    // Apply specific filters
    if (filters.entity_id) {
      queryBuilder.andWhere('history.entity_id = :entityId', { entityId: filters.entity_id });
    }

    if (filters.changed_by) {
      queryBuilder.andWhere('history.changed_by = :changedBy', { changedBy: filters.changed_by });
    }

    if (filters.change_type) {
      queryBuilder.andWhere('history.change_type = :changeType', { changeType: filters.change_type });
    }

    if (filters.is_system_change !== undefined) {
      queryBuilder.andWhere('history.is_system_change = :isSystemChange', { 
        isSystemChange: filters.is_system_change 
      });
    }

    if (filters.batch_id) {
      queryBuilder.andWhere('history.batch_id = :batchId', { batchId: filters.batch_id });
    }

    if (filters.correlation_id) {
      queryBuilder.andWhere('history.correlation_id = :correlationId', { 
        correlationId: filters.correlation_id 
      });
    }

    if (filters.session_id) {
      queryBuilder.andWhere('history.session_id = :sessionId', { sessionId: filters.session_id });
    }

    if (filters.changed_fields && filters.changed_fields.length > 0) {
      queryBuilder.andWhere('history.changed_fields && :changedFields', { 
        changedFields: filters.changed_fields 
      });
    }

    if (filters.has_validation_errors !== undefined) {
      if (filters.has_validation_errors) {
        queryBuilder.andWhere('history.validation_errors IS NOT NULL');
      } else {
        queryBuilder.andWhere('history.validation_errors IS NULL');
      }
    }

    if (filters.is_reversible !== undefined) {
      queryBuilder.andWhere('history.is_reversible = :isReversible', { 
        isReversible: filters.is_reversible 
      });
    }

    if (filters.is_major_change !== undefined) {
      const majorChangeTypes = ['created', 'deleted', 'status_changed', 'risk_updated'];
      if (filters.is_major_change) {
        queryBuilder.andWhere('history.change_type IN (:...majorTypes)', { majorTypes: majorChangeTypes });
      } else {
        queryBuilder.andWhere('history.change_type NOT IN (:...majorTypes)', { majorTypes: majorChangeTypes });
      }
    }

    // Apply search
    if (options.search) {
      QueryHelper.applySearch(
        queryBuilder,
        options.search,
        ['change_description', 'change_reason', 'change_type'],
        'history'
      );
    }

    // Apply sorting
    QueryHelper.applySorting(
      queryBuilder,
      options,
      'history',
      ['created_at', 'change_type', 'version_number']
    );

    return queryBuilder;
  }
}