import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EntityEntity } from '../../entities/entities/entity.entity';
import { OrganizationRelationshipType } from '../../../utils/constants/enums';

@Entity('organization_entity_relationships')
@Index(['from_entity_id', 'to_entity_id', 'relationship_type'], { unique: true })
export class OrganizationEntityRelationship extends BaseEntity {
  @Column({ type: 'uuid' })
  from_entity_id: string;

  @Column({ type: 'uuid' })
  to_entity_id: string;

  @Column({
    type: 'enum',
    enum: OrganizationRelationshipType,
  })
  relationship_type: OrganizationRelationshipType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ownership_percentage: number;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'jsonb', nullable: true })
  additional_details: Record<string, any>;

  // Relationships
  @ManyToOne(() => EntityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_entity_id' })
  from_entity: EntityEntity;

  @ManyToOne(() => EntityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_entity_id' })
  to_entity: EntityEntity;
}