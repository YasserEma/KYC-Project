import { DataSource } from 'typeorm';
import { EntityEntity } from '../../modules/entities/entities/entity.entity';

export async function seedEntities(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(EntityEntity);

  // Check if entities already exist
  const existingCount = await repository.count();
  if (existingCount > 0) {
    console.log('Entities already seeded, skipping...');
    return;
  }

  const entitiesData: Partial<EntityEntity>[] = [
    // Individual Entities
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001', // Assuming first subscriber
      name: 'John Smith',
      reference_number: 'ENT-IND-001',
      entity_type: 'individual',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440001', // First subscriber user
      onboarding_completed: true,
      risk_level: 'low',
      screening_status: 'completed',
      last_screened_at: new Date('2024-01-15'),
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Jane Doe',
      reference_number: 'ENT-IND-002',
      entity_type: 'individual',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'medium',
      screening_status: 'completed',
      last_screened_at: new Date('2024-01-20'),
      created_at: new Date('2024-01-05'),
      updated_at: new Date('2024-01-05'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Michael Johnson',
      reference_number: 'ENT-IND-003',
      entity_type: 'individual',
      status: 'pending',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: false,
      risk_level: 'high',
      screening_status: 'pending',
      last_screened_at: undefined,
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-02-01'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Sarah Wilson',
      reference_number: 'ENT-IND-004',
      entity_type: 'individual',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'critical',
      screening_status: 'flagged',
      last_screened_at: new Date('2024-02-10'),
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-02-10'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Robert Brown',
      reference_number: 'ENT-IND-005',
      entity_type: 'individual',
      status: 'inactive',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'low',
      screening_status: 'completed',
      last_screened_at: new Date('2023-12-01'),
      created_at: new Date('2023-06-01'),
      updated_at: new Date('2024-01-15'),
      is_active: false
    },

    // Organization Entities
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Acme Corporation',
      reference_number: 'ENT-ORG-001',
      entity_type: 'organization',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'low',
      screening_status: 'completed',
      last_screened_at: new Date('2024-01-10'),
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'TechStart Inc.',
      reference_number: 'ENT-ORG-002',
      entity_type: 'organization',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'medium',
      screening_status: 'completed',
      last_screened_at: new Date('2024-01-25'),
      created_at: new Date('2024-01-10'),
      updated_at: new Date('2024-01-10'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440013',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Global Finance Ltd.',
      reference_number: 'ENT-ORG-003',
      entity_type: 'organization',
      status: 'pending',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: false,
      risk_level: 'high',
      screening_status: 'in_progress',
      last_screened_at: undefined,
      created_at: new Date('2024-02-15'),
      updated_at: new Date('2024-02-15'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440014',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Offshore Holdings',
      reference_number: 'ENT-ORG-004',
      entity_type: 'organization',
      status: 'suspended',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'critical',
      screening_status: 'flagged',
      last_screened_at: new Date('2024-02-20'),
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-02-25'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440015',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Legacy Systems Corp.',
      reference_number: 'ENT-ORG-005',
      entity_type: 'organization',
      status: 'archived',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'medium',
      screening_status: 'completed',
      last_screened_at: new Date('2023-11-01'),
      created_at: new Date('2023-05-01'),
      updated_at: new Date('2024-01-01'),
      is_active: false
    },

    // Additional entities for second subscriber (if exists)
    {
      id: '550e8400-e29b-41d4-a716-446655440021',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440002', // Assuming second subscriber
      name: 'David Miller',
      reference_number: 'ENT-IND-101',
      entity_type: 'individual',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440002',
      onboarding_completed: true,
      risk_level: 'low',
      screening_status: 'completed',
      last_screened_at: new Date('2024-02-01'),
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-01-15'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440022',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Innovation Labs',
      reference_number: 'ENT-ORG-101',
      entity_type: 'organization',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440002',
      onboarding_completed: true,
      risk_level: 'medium',
      screening_status: 'completed',
      last_screened_at: new Date('2024-02-05'),
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-20'),
      is_active: true
    },

    // Test entities with various statuses and risk levels
    {
      id: '550e8400-e29b-41d4-a716-446655440031',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Emma Thompson',
      reference_number: 'ENT-IND-006',
      entity_type: 'individual',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: false,
      risk_level: 'low',
      screening_status: 'not_started',
      last_screened_at: undefined,
      created_at: new Date('2024-03-01'),
      updated_at: new Date('2024-03-01'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440032',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Risk Capital Partners',
      reference_number: 'ENT-ORG-006',
      entity_type: 'organization',
      status: 'active',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: true,
      risk_level: 'high',
      screening_status: 'requires_review',
      last_screened_at: new Date('2024-03-01'),
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-03-05'),
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440033',
      subscriber_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Alex Rodriguez',
      reference_number: 'ENT-IND-007',
      entity_type: 'individual',
      status: 'pending',
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      onboarding_completed: false,
      risk_level: 'medium',
      screening_status: 'in_progress',
      last_screened_at: undefined,
      created_at: new Date('2024-03-15'),
      updated_at: new Date('2024-03-15'),
      is_active: true
    }
  ];

  console.log(`Seeding ${entitiesData.length} entities...`);
  await repository.save(entitiesData);
  console.log('Entities seeded successfully');
}