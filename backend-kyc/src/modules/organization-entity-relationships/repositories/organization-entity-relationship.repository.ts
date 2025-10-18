import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , IsNull} from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
import { OrganizationEntityRelationship } from '../entities/organization-entity-relationship.entity';
import { OrganizationRelationshipType } from '../../../utils/constants/enums';

@Injectable()
export class OrganizationEntityRelationshipRepository extends BaseRepository<OrganizationEntityRelationship> {
  constructor(
    @InjectRepository(OrganizationEntityRelationship)
    repository: Repository<OrganizationEntityRelationship>,
  ) {
    super(repository);
  }

  async findByFromEntity(fromEntityId: string): Promise<OrganizationEntityRelationship[]> {
    return this.repository.find({
      where: { 
        from_entity_id: fromEntityId,
        is_active: true,
        deleted_at: IsNull() 
      },
      relations: ['to_entity'],
      order: { created_at: 'DESC' },
    });
  }

  async findByToEntity(toEntityId: string): Promise<OrganizationEntityRelationship[]> {
    return this.repository.find({
      where: { 
        to_entity_id: toEntityId,
        is_active: true,
        deleted_at: IsNull() 
      },
      relations: ['from_entity'],
      order: { created_at: 'DESC' },
    });
  }

  async findByRelationshipType(
    relationshipType: OrganizationRelationshipType,
  ): Promise<OrganizationEntityRelationship[]> {
    return this.repository.find({
      where: { 
        relationship_type: relationshipType,
        is_active: true,
        deleted_at: IsNull() 
      },
      relations: ['from_entity', 'to_entity'],
      order: { created_at: 'DESC' },
    });
  }

  async findRelationshipBetweenEntities(
    fromEntityId: string,
    toEntityId: string,
  ): Promise<OrganizationEntityRelationship[]> {
    return this.repository.find({
      where: [
        { 
          from_entity_id: fromEntityId, 
          to_entity_id: toEntityId,
          is_active: true,
          deleted_at: IsNull() 
        },
        { 
          from_entity_id: toEntityId, 
          to_entity_id: fromEntityId,
          is_active: true,
          deleted_at: IsNull() 
        },
      ],
      relations: ['from_entity', 'to_entity'],
      order: { created_at: 'DESC' },
    });
  }

  async findOwnershipRelationships(entityId: string): Promise<OrganizationEntityRelationship[]> {
    return this.repository.find({
      where: [
        { 
          from_entity_id: entityId,
          relationship_type: OrganizationRelationshipType.OWNS,
          is_active: true,
          deleted_at: IsNull() 
        },
        { 
          to_entity_id: entityId,
          relationship_type: OrganizationRelationshipType.OWNED_BY,
          is_active: true,
          deleted_at: IsNull() 
        },
      ],
      relations: ['from_entity', 'to_entity'],
      order: { ownership_percentage: 'DESC' },
    });
  }
}