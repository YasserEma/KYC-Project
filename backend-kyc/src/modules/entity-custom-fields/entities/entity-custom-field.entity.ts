import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EntityEntity } from '../../entities/entities/entity.entity';

@Entity('entity_custom_fields')
@Index(['entity_id'])
@Index(['field_name'])
@Index(['field_type'])
@Index(['is_required'])
@Index(['is_searchable'])
export class EntityCustomFieldEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  entity_id: string;

  @Column({ type: 'varchar', length: 100 })
  field_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  field_label: string;

  @Column({ 
    type: 'enum', 
    enum: ['text', 'number', 'boolean', 'date', 'datetime', 'email', 'url', 'phone', 'json', 'array'], 
    default: 'text' 
  })
  field_type: 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'email' | 'url' | 'phone' | 'json' | 'array';

  @Column({ type: 'text', nullable: true })
  field_value: string;

  @Column({ type: 'jsonb', nullable: true })
  field_value_json: any;

  @Column({ type: 'text', nullable: true })
  field_description: string;

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  @Column({ type: 'boolean', default: true })
  is_searchable: boolean;

  @Column({ type: 'boolean', default: true })
  is_editable: boolean;

  @Column({ type: 'boolean', default: true })
  is_visible: boolean;

  @Column({ type: 'integer', default: 0 })
  display_order: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  field_group: string;

  @Column({ type: 'jsonb', nullable: true })
  validation_rules: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  field_options: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  default_value: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  placeholder_text: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  help_text: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  data_source: string;

  @Column({ type: 'jsonb', nullable: true })
  conditional_logic: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  is_encrypted: boolean;

  @Column({ type: 'boolean', default: false })
  is_pii: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => EntityEntity, entity => entity.custom_fields)
  @JoinColumn({ name: 'entity_id' })
  entity: EntityEntity;

  // Virtual properties
  get parsed_value(): any {
    if (this.field_value_json !== null && this.field_value_json !== undefined) {
      return this.field_value_json;
    }

    if (!this.field_value) {
      return null;
    }

    switch (this.field_type) {
      case 'number':
        return parseFloat(this.field_value);
      case 'boolean':
        return this.field_value.toLowerCase() === 'true';
      case 'date':
      case 'datetime':
        return new Date(this.field_value);
      case 'json':
        try {
          return JSON.parse(this.field_value);
        } catch {
          return this.field_value;
        }
      case 'array':
        try {
          return JSON.parse(this.field_value);
        } catch {
          return [this.field_value];
        }
      default:
        return this.field_value;
    }
  }

  get is_empty(): boolean {
    return !this.field_value && !this.field_value_json;
  }

  get display_value(): string {
    const value = this.parsed_value;
    
    if (value === null || value === undefined) {
      return '';
    }

    switch (this.field_type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : String(value);
      case 'datetime':
        return value instanceof Date ? value.toLocaleString() : String(value);
      case 'json':
      case 'array':
        return JSON.stringify(value);
      default:
        return String(value);
    }
  }

  get validation_errors(): string[] {
    const errors: string[] = [];
    
    if (this.is_required && this.is_empty) {
      errors.push(`${this.field_label || this.field_name} is required`);
    }

    if (!this.is_empty && this.validation_rules) {
      // Add custom validation logic here based on validation_rules
      if (this.validation_rules.min_length && this.field_value && this.field_value.length < this.validation_rules.min_length) {
        errors.push(`${this.field_label || this.field_name} must be at least ${this.validation_rules.min_length} characters`);
      }
      
      if (this.validation_rules.max_length && this.field_value && this.field_value.length > this.validation_rules.max_length) {
        errors.push(`${this.field_label || this.field_name} must be no more than ${this.validation_rules.max_length} characters`);
      }
      
      if (this.validation_rules.pattern && this.field_value) {
        const regex = new RegExp(this.validation_rules.pattern);
        if (!regex.test(this.field_value)) {
          errors.push(`${this.field_label || this.field_name} format is invalid`);
        }
      }
    }

    return errors;
  }

  get is_valid(): boolean {
    return this.validation_errors.length === 0;
  }
}