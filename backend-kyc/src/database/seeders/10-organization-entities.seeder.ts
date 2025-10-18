import { DataSource } from 'typeorm';
import { OrganizationEntity } from '../../modules/entities/entities/organization-entity.entity';

export async function seedOrganizationEntities(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(OrganizationEntity);

  // Check if organization entities already exist
  const existingCount = await repository.count();
  if (existingCount > 0) {
    console.log('Organization entities already seeded, skipping...');
    return;
  }

  const organizationEntitiesData: Partial<OrganizationEntity>[] = [
    {
      entity_id: '550e8400-e29b-41d4-a716-446655440011',
      legal_name: 'Acme Corporation',
      trade_name: 'Acme Corp',
      country_of_incorporation: 'US',
      date_of_incorporation: new Date('2015-06-15'),
      organization_type: 'corporation',
      legal_structure: 'private',
      tax_identification_number: '12-3456789',
      commercial_registration_number: 'US-CORP-2015-001234',
      registered_address: '100 Technology Drive, Silicon Valley, CA 94025, United States',
      operating_address: '100 Technology Drive, Silicon Valley, CA 94025, United States',
      contact_email: 'contact@acme.com',
      contact_phone: '+1-555-0123',
      industry_sector: 'Information Technology',
      number_of_employees: 250,
      annual_revenue: '15000000',
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
      is_active: true
    },
    {
      entity_id: '550e8400-e29b-41d4-a716-446655440012',
      legal_name: 'TechStart Inc.',
      trade_name: 'TechStart',
      country_of_incorporation: 'US',
      date_of_incorporation: new Date('2010-03-22'),
      organization_type: 'corporation',
      legal_structure: 'private',
      tax_identification_number: 'US123456789',
      commercial_registration_number: 'US-INC-2010-567890',
      registered_address: '200 Innovation Street, Austin, TX 78701, United States',
      operating_address: '200 Innovation Street, Austin, TX 78701, United States',
      contact_email: 'info@techstart.com',
      contact_phone: '+1-512-555-0150',
      industry_sector: 'Technology',
      number_of_employees: 150,
      annual_revenue: '25000000',
      created_at: new Date('2024-01-10'),
      updated_at: new Date('2024-01-10'),
      is_active: true
    },
    {
      entity_id: '550e8400-e29b-41d4-a716-446655440013',
      legal_name: 'Global Finance Ltd.',
      trade_name: 'Global Finance',
      country_of_incorporation: 'GB',
      date_of_incorporation: new Date('2018-09-10'),
      organization_type: 'corporation',
      legal_structure: 'private',
      tax_identification_number: 'GB12345678901',
      commercial_registration_number: 'GB-LTD-2018-123456',
      registered_address: '25 Bank Street, Canary Wharf, London E14 5JP, United Kingdom',
      operating_address: '25 Bank Street, Canary Wharf, London E14 5JP, United Kingdom',
      contact_email: 'contact@globalfinance.co.uk',
      contact_phone: '+44-20-7946-0958',
      industry_sector: 'Financial Services',
      number_of_employees: 500,
      annual_revenue: '75000000',
      created_at: new Date('2024-02-15'),
      updated_at: new Date('2024-02-15'),
      is_active: true
    },
    {
      entity_id: '550e8400-e29b-41d4-a716-446655440014',
      legal_name: 'Offshore Holdings',
      trade_name: 'Offshore Holdings',
      country_of_incorporation: 'CH',
      date_of_incorporation: new Date('2005-11-30'),
      organization_type: 'corporation',
      legal_structure: 'private',
      tax_identification_number: 'CHE-123.456.789',
      commercial_registration_number: 'CH-AG-2005-987654',
      registered_address: 'Paradeplatz 8, 8001 Zurich, Switzerland',
      operating_address: 'Paradeplatz 8, 8001 Zurich, Switzerland',
      contact_email: 'info@offshore.ch',
      contact_phone: '+41-44-123-45-67',
      industry_sector: 'Financial Holdings',
      number_of_employees: 1200,
      annual_revenue: '500000000',
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-02-25'),
      is_active: true
    },
    {
      entity_id: '550e8400-e29b-41d4-a716-446655440015',
      legal_name: 'Legacy Systems Corp.',
      trade_name: 'Legacy Systems',
      country_of_incorporation: 'CA',
      date_of_incorporation: new Date('2013-05-30'),
      organization_type: 'corporation',
      legal_structure: 'private',
      tax_identification_number: 'CA123456789',
      commercial_registration_number: 'CA-CORP-2013-567890',
      registered_address: '400 Bay Street, Toronto, ON M5H 2Y4, Canada',
      operating_address: '400 Bay Street, Toronto, ON M5H 2Y4, Canada',
      contact_email: 'contact@legacysystems.ca',
      contact_phone: '+1-416-555-0166',
      industry_sector: 'Software Development',
      number_of_employees: 420,
      annual_revenue: '35000000',
      created_at: new Date('2024-01-30'),
      updated_at: new Date('2024-01-30'),
      is_active: true
    }
  ];

  console.log(`Seeding ${organizationEntitiesData.length} organization entities...`);
  await repository.save(organizationEntitiesData);
  console.log('Organization entities seeded successfully');
}