import { Entity, Column, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { SubscriberEntity } from '../../subscribers/entities/subscriber.entity';
import { LogEntity } from '../../logs/entities/log.entity';
import { EntityCustomFieldEntity } from '../../entity-custom-fields/entities/entity-custom-field.entity';
import { EntityHistoryEntity } from '../../entity-history/entities/entity-history.entity';
import { ScreeningAnalysisEntity } from '../../screening-analysis/entities/screening-analysis.entity';
import { RiskAnalysisEntity } from '../../risk-analysis/entities/risk-analysis.entity';
import { DocumentEntity } from '../../documents/entities/document.entity';

@Entity('entities')
export class EntityEntity extends BaseEntity {
  @Index('idx_entities_subscriber_id')
  @Column({ type: 'uuid' })
  subscriber_id!: string;

  @ManyToOne(() => SubscriberEntity, subscriber => subscriber.entities)
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: SubscriberEntity;

  @Index('idx_entities_entity_type')
  @Column({ type: 'text' })
  entity_type!: string;

  @Index('idx_entities_name')
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', unique: true })
  reference_number!: string;

  @Index('idx_entities_status')
  @Column({ type: 'text', default: 'PENDING' })
  status!: string;

  @Column({ type: 'uuid' })
  created_by!: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'text', nullable: true })
  risk_level?: string;

  @Column({ type: 'text', nullable: true })
  screening_status?: string;

  @Column({ type: 'boolean', default: false })
  onboarding_completed!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  onboarded_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_screened_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_risk_assessed_at?: Date;

  // Relationships
  @OneToMany(() => LogEntity, log => log.entity)
  logs: LogEntity[];

  @OneToMany(() => EntityCustomFieldEntity, customField => customField.entity)
  custom_fields: EntityCustomFieldEntity[];

  @OneToMany(() => EntityHistoryEntity, history => history.entity)
  history: EntityHistoryEntity[];

  @OneToMany(() => ScreeningAnalysisEntity, screeningAnalysis => screeningAnalysis.entity)
  screeningAnalyses: ScreeningAnalysisEntity[];

  @OneToMany(() => RiskAnalysisEntity, riskAnalysis => riskAnalysis.entity)
  riskAnalyses: RiskAnalysisEntity[];

  @OneToMany(() => DocumentEntity, document => document.entity)
  documents: DocumentEntity[];
}