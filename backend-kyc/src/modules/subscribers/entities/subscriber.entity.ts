import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { SubscriberUserEntity } from '../../subscriber-users/entities/subscriber-user.entity';
import { EntityEntity } from '../../entities/entities/entity.entity';
import { LogEntity } from '../../logs/entities/log.entity';
import { ScreeningAnalysisEntity } from '../../screening-analysis/entities/screening-analysis.entity';
import { RiskAnalysisEntity } from '../../risk-analysis/entities/risk-analysis.entity';
import { DocumentEntity } from '../../documents/entities/document.entity';

@Entity('subscribers')
@Index(['company_name'])
@Index(['subscription_tier'])
@Index(['status'])
export class SubscriberEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  company_name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  company_code: string;

  @Column({ type: 'text', nullable: true })
  company_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postal_code: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ 
    type: 'enum', 
    enum: ['basic', 'premium', 'enterprise'], 
    default: 'basic' 
  })
  subscription_tier: 'basic' | 'premium' | 'enterprise';

  @Column({ type: 'timestamp', nullable: true })
  subscription_start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscription_end_date: Date;

  @Column({ 
    type: 'enum', 
    enum: ['active', 'inactive', 'suspended', 'trial'], 
    default: 'trial' 
  })
  status: 'active' | 'inactive' | 'suspended' | 'trial';

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  billing_info: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  api_key: string;

  @Column({ type: 'integer', default: 1000 })
  api_rate_limit: number;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @Column({ type: 'inet', nullable: true })
  last_login_ip: string;

  // Relationships
  @OneToMany(() => SubscriberUserEntity, user => user.subscriber)
  users: SubscriberUserEntity[];

  @OneToMany(() => EntityEntity, entity => entity.subscriber)
  entities: EntityEntity[];

  @OneToMany(() => LogEntity, log => log.subscriber)
  logs: LogEntity[];

  @OneToMany(() => ScreeningAnalysisEntity, screeningAnalysis => screeningAnalysis.subscriber)
  screeningAnalyses: ScreeningAnalysisEntity[];

  @OneToMany(() => RiskAnalysisEntity, riskAnalysis => riskAnalysis.subscriber)
  riskAnalyses: RiskAnalysisEntity[];

  @OneToMany(() => DocumentEntity, document => document.subscriber)
  documents: DocumentEntity[];
}