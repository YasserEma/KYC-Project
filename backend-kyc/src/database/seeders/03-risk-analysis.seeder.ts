import { DataSource } from 'typeorm';
import { RiskAnalysisEntity } from '../../modules/risk-analysis/entities/risk-analysis.entity';

export async function seedRiskAnalysis(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  
  try {
    // Check if data already exists
    const existingCount = await queryRunner.query('SELECT COUNT(*) FROM risk_analysis');
    if (parseInt(existingCount[0].count) > 0) {
      console.log('Risk analysis data already exists, skipping seeding');
      return;
    }

    const riskAnalysisData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        entity_id: '550e8400-e29b-41d4-a716-446655440001',
        analysis_date: '2024-01-15',
        risk_level: 'medium',
        risk_score: 65.5,
        risk_factors: { comprehensive_risk: true, customer_type: 'individual' },
        mitigation_actions: { review_required: false, escalation_needed: false },
        analyst_id: '550e8400-e29b-41d4-a716-446655440001',
        notes: 'Comprehensive risk analysis completed for individual entity',
        created_by: '550e8400-e29b-41d4-a716-446655440001',
        created_at: '2024-01-15'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        entity_id: '550e8400-e29b-41d4-a716-446655440002',
        analysis_date: '2024-01-20',
        risk_level: 'low',
        risk_score: 25.0,
        risk_factors: { customer_risk: true, entity_type: 'corporate' },
        mitigation_actions: { periodic_review: true, monitoring_required: false },
        analyst_id: '550e8400-e29b-41d4-a716-446655440001',
        notes: 'Periodic customer risk analysis for corporate entity',
        created_by: '550e8400-e29b-41d4-a716-446655440001',
        created_at: '2024-01-20'
      }
    ];

    for (const data of riskAnalysisData) {
      await queryRunner.query(
        `
        INSERT INTO risk_analysis (
          id, entity_id, analysis_date, risk_level, risk_score, 
          risk_factors, mitigation_actions, analyst_id, notes, created_by, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
        `,
        [
          data.id, data.entity_id, data.analysis_date, data.risk_level, data.risk_score,
          JSON.stringify(data.risk_factors), JSON.stringify(data.mitigation_actions), 
          data.analyst_id, data.notes, data.created_by, data.created_at
        ],
      );
    }
    
    console.log(`Seeded ${riskAnalysisData.length} risk analysis records`);
  } finally {
    await queryRunner.release();
  }
}