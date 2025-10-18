import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EntityEntity } from '../../entities/entities/entity.entity';
import { SubscriberUserEntity } from '../../subscriber-users/entities/subscriber-user.entity';

@Entity('entity_history')
@Index(['entity_id'])
@Index(['changed_by'])
@Index(['change_type'])
@Index(['created_at'])
export class EntityHistoryEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  entity_id: string;

  @Column({ type: 'uuid', nullable: true })
  changed_by: string;

  @Column({ 
    type: 'enum', 
    enum: ['created', 'updated', 'deleted', 'restored', 'status_changed', 'risk_updated', 'screening_updated'], 
    default: 'updated' 
  })
  change_type: 'created' | 'updated' | 'deleted' | 'restored' | 'status_changed' | 'risk_updated' | 'screening_updated';

  @Column({ type: 'text', nullable: true })
  change_description: string;

  @Column({ type: 'jsonb', nullable: true })
  old_values: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  new_values: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  changed_fields: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  change_reason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'inet', nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_agent: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  session_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correlation_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  api_version: string;

  @Column({ type: 'boolean', default: false })
  is_system_change: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  batch_id: string;

  @Column({ type: 'integer', nullable: true })
  version_number: number;

  @Column({ type: 'jsonb', nullable: true })
  validation_errors: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  is_reversible: boolean;

  @Column({ type: 'text', nullable: true })
  reversal_instructions: string;

  // Relationships
  @ManyToOne(() => EntityEntity, entity => entity.history)
  @JoinColumn({ name: 'entity_id' })
  entity: EntityEntity;

  @ManyToOne(() => SubscriberUserEntity, user => user, { nullable: true })
  @JoinColumn({ name: 'changed_by' })
  user: SubscriberUserEntity;

  // Virtual properties
  get has_field_changes(): boolean {
    return !!(this.changed_fields && this.changed_fields.length > 0);
  }

  get change_summary(): string {
    if (!this.has_field_changes) {
      return this.change_description || `Entity ${this.change_type}`;
    }
    
    const fieldCount = this.changed_fields.length;
    const fields = fieldCount <= 3 
      ? this.changed_fields.join(', ')
      : `${this.changed_fields.slice(0, 3).join(', ')} and ${fieldCount - 3} more`;
    
    return `Changed fields: ${fields}`;
  }

  get is_major_change(): boolean {
    const majorChangeTypes = ['created', 'deleted', 'status_changed', 'risk_updated'];
    return majorChangeTypes.includes(this.change_type);
  }
}