import { DataSource } from 'typeorm';

export async function seedScreeningAnalysis(dataSource: DataSource): Promise<void> {
  console.log('🔄 Seeding screening analysis...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Check if screening analysis already exists
    const existingAnalysis = await queryRunner.query('SELECT COUNT(*) as count FROM screening_analysis');
    if (parseInt(existingAnalysis[0].count) > 0) {
      console.log('📋 Screening analysis already exist, skipping seeding');
      return;
    }

    // Get existing entities, screening configurations, and users
    const entities = await queryRunner.query(`
      SELECT e.id, e.entity_type, e.name, e.status,
             CASE 
               WHEN e.entity_type = 'ORGANIZATION' THEN oe.legal_name
               ELSE e.name
             END as full_name
      FROM entities e
      LEFT JOIN organization_entities oe ON e.id = oe.entity_id
    `);
    
    const screeningConfigs = await queryRunner.query('SELECT id, configuration_name, entity_type FROM screening_configuration');
    const users = await queryRunner.query('SELECT id FROM subscriber_users');

    if (entities.length === 0 || screeningConfigs.length === 0 || users.length === 0) {
      console.log('⚠️ Need entities, screening configurations, and users, skipping screening analysis seeding');
      return;
    }

    // Define screening types and their characteristics
    const screeningTypes = [
      'SANCTIONS', 'PEP', 'ADVERSE_MEDIA', 'WATCHLIST', 'CRIMINAL_RECORDS',
      'REGULATORY_ENFORCEMENT', 'FINANCIAL_CRIMES', 'TERRORISM', 'MONEY_LAUNDERING',
      'FRAUD', 'CORRUPTION', 'TAX_EVASION', 'IDENTITY_VERIFICATION'
    ];

    const screeningStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED'];
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const matchTypes = ['EXACT', 'PARTIAL', 'PHONETIC', 'FUZZY', 'ALIAS'];
    
    // Define realistic screening providers
    const providers = [
      'WorldCheck', 'Dow Jones', 'LexisNexis', 'Thomson Reuters', 'Refinitiv',
      'Comply Advantage', 'ComplyAdvantage', 'ACAMS', 'OFAC', 'EU Sanctions',
      'UN Sanctions', 'HM Treasury', 'AUSTRAC', 'FINTRAC'
    ];

    const analysisResults = [];
    const now = new Date();

    // Generate screening analysis for each entity
    for (const entity of entities) {
      // Each entity gets 1-5 screening analyses (depending on risk profile)
      const baseNumAnalyses = entity.entity_type === 'ORGANIZATION' ? 3 : 2;
      const numAnalyses = Math.floor(Math.random() * 3) + baseNumAnalyses;
      
      for (let i = 0; i < numAnalyses; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomConfig = screeningConfigs[Math.floor(Math.random() * screeningConfigs.length)];
        const screeningType = screeningTypes[Math.floor(Math.random() * screeningTypes.length)];
        const provider = providers[Math.floor(Math.random() * providers.length)];

        // Generate analysis timing
        const startedAt = new Date(now.getTime() - Math.floor(Math.random() * 365 * 2) * 24 * 60 * 60 * 1000); // Up to 2 years ago
        const status = screeningStatuses[Math.floor(Math.random() * screeningStatuses.length)];
        
        let completedAt = null;
        if (['COMPLETED', 'FAILED'].includes(status)) {
          completedAt = new Date(startedAt.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)); // Within 24 hours
        }

        // Generate screening results based on status
        let totalMatches = 0;
        let exactMatches = 0;
        let partialMatches = 0;
        let riskLevel = 'LOW';
        let riskScore = Math.floor(Math.random() * 30); // Default low risk

        if (status === 'COMPLETED') {
          // Generate realistic match counts
          const hasMatches = Math.random() > 0.7; // 30% chance of having matches
          
          if (hasMatches) {
            totalMatches = Math.floor(Math.random() * 10) + 1; // 1-10 matches
            exactMatches = Math.floor(totalMatches * (Math.random() * 0.3)); // 0-30% exact matches
            partialMatches = totalMatches - exactMatches;
            
            // Higher matches = higher risk
            if (totalMatches >= 5 || exactMatches >= 2) {
              riskLevel = 'HIGH';
              riskScore = Math.floor(Math.random() * 30) + 70; // 70-100
            } else if (totalMatches >= 2 || exactMatches >= 1) {
              riskLevel = 'MEDIUM';
              riskScore = Math.floor(Math.random() * 40) + 30; // 30-70
            } else {
              riskLevel = 'LOW';
              riskScore = Math.floor(Math.random() * 40) + 10; // 10-50
            }
            
            // Critical risk for certain screening types
            if (['SANCTIONS', 'TERRORISM', 'MONEY_LAUNDERING'].includes(screeningType) && exactMatches > 0) {
              riskLevel = 'CRITICAL';
              riskScore = Math.floor(Math.random() * 20) + 80; // 80-100
            }
          }
        }

        // Generate match details for completed screenings with matches
        let matchDetails = null;
        if (status === 'COMPLETED' && totalMatches > 0) {
          const matches = [];
          for (let m = 0; m < Math.min(totalMatches, 3); m++) { // Show up to 3 matches in details
            const matchType = m < exactMatches ? 'EXACT' : matchTypes[Math.floor(Math.random() * matchTypes.length)];
            const confidence = matchType === 'EXACT' ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 60) + 20;
            
            matches.push({
              match_id: `${provider.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`,
              match_type: matchType,
              confidence_score: confidence,
              list_name: `${screeningType}_${provider}`,
              matched_name: entity.full_name + (matchType === 'EXACT' ? '' : ` (${matchType.toLowerCase()} match)`),
              match_reason: `Name similarity: ${confidence}%`,
              source: provider
            });
          }
          matchDetails = JSON.stringify(matches);
        }

        // Generate error details for failed screenings
        let errorDetails = null;
        if (status === 'FAILED') {
          const errors = [
            'API timeout - provider service unavailable',
            'Invalid entity data format',
            'Rate limit exceeded',
            'Authentication failed',
            'Network connectivity issues',
            'Provider maintenance window',
            'Insufficient data for screening'
          ];
          errorDetails = errors[Math.floor(Math.random() * errors.length)];
        }

        // Generate external reference ID
        const externalRefId = `${provider.toLowerCase()}_${startedAt.getFullYear()}_${Math.random().toString(36).substr(2, 12)}`;

        // Generate notes
        const notes = [
          'Automated screening via API',
          'Manual review required due to high risk score',
          'Scheduled periodic re-screening',
          'Triggered by entity status change',
          'Part of enhanced due diligence process',
          'Compliance team review completed',
          null, null // Some analyses have no notes
        ];
        const selectedNote = notes[Math.floor(Math.random() * notes.length)];

        // Determine if manual review is required
        const requiresManualReview = riskLevel === 'CRITICAL' || (riskLevel === 'HIGH' && exactMatches > 0) || Math.random() > 0.8;

        // Calculate best match score from match details
        let bestMatchScore = null;
        if (matchDetails) {
          const parsedMatches = JSON.parse(matchDetails);
          if (parsedMatches && parsedMatches.length > 0) {
            bestMatchScore = Math.max(...parsedMatches.map((m: any) => m.confidence_score));
          }
        }

        analysisResults.push({
          entity_id: entity.id,
          screening_date: startedAt.toISOString(),
          screening_source: provider,
          matched_records: matchDetails ? JSON.parse(matchDetails) : null,
          best_match_score: bestMatchScore,
          screening_status: status,
          reviewer_id: requiresManualReview ? randomUser.id : null,
          review_decision: completedAt && requiresManualReview ? (Math.random() > 0.5 ? 'APPROVED' : 'REJECTED') : null,
          review_notes: selectedNote,
          reviewed_at: completedAt && requiresManualReview ? completedAt.toISOString() : null,
          created_by: randomUser.id
        });
      }
    }

    // Insert screening analysis in batches
    const batchSize = 50;
    for (let i = 0; i < analysisResults.length; i += batchSize) {
      const batch = analysisResults.slice(i, i + batchSize);
      const values = batch.map(analysis => {
        const matchedRecordsValue = analysis.matched_records ? `'${JSON.stringify(analysis.matched_records).replace(/'/g, "''")}'` : 'NULL';
        const bestMatchScoreValue = analysis.best_match_score ? analysis.best_match_score : 'NULL';
        const reviewerIdValue = analysis.reviewer_id ? `'${analysis.reviewer_id}'` : 'NULL';
        const reviewDecisionValue = analysis.review_decision ? `'${analysis.review_decision}'` : 'NULL';
        const reviewNotesValue = analysis.review_notes ? `'${analysis.review_notes.replace(/'/g, "''")}'` : 'NULL';
        const reviewedAtValue = analysis.reviewed_at ? `'${analysis.reviewed_at}'` : 'NULL';
        
        return `(gen_random_uuid(), '${analysis.entity_id}', '${analysis.screening_date}', '${analysis.screening_source}', ${matchedRecordsValue}, ${bestMatchScoreValue}, '${analysis.screening_status}', ${reviewerIdValue}, ${reviewDecisionValue}, ${reviewNotesValue}, ${reviewedAtValue}, '${analysis.created_by}')`;
      }).join(', ');

      await queryRunner.query(`
        INSERT INTO screening_analysis (id, entity_id, screening_date, screening_source, matched_records, best_match_score, screening_status, reviewer_id, review_decision, review_notes, reviewed_at, created_by)
        VALUES ${values}
      `);
    }

    console.log(`✅ Successfully seeded ${analysisResults.length} screening analysis records`);

  } catch (error) {
    console.error('❌ Error seeding screening analysis:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}