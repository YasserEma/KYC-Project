import { DataSource } from 'typeorm';

export async function seedDocuments(dataSource: DataSource): Promise<void> {
  console.log('🔄 Seeding documents...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Check if documents already exist
    const existingDocuments = await queryRunner.query('SELECT COUNT(*) as count FROM documents');
    if (parseInt(existingDocuments[0].count) > 0) {
      console.log('📋 Documents already exist, skipping seeding');
      return;
    }

    // Get existing entities and users
    const entities = await queryRunner.query(`
      SELECT e.id, e.entity_type, e.name,
             CASE 
               WHEN e.entity_type = 'ORGANIZATION' THEN oe.legal_name
               ELSE e.name
             END as full_name
      FROM entities e
      LEFT JOIN organization_entities oe ON e.id = oe.entity_id
    `);
    
    const users = await queryRunner.query('SELECT id FROM subscriber_users');

    if (entities.length === 0 || users.length === 0) {
      console.log('⚠️ Need entities and users, skipping documents seeding');
      return;
    }

    // Document types by entity type
    const documentTypes: Record<string, string[]> = {
      INDIVIDUAL: [
        'PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'BIRTH_CERTIFICATE',
        'PROOF_OF_ADDRESS', 'BANK_STATEMENT', 'UTILITY_BILL', 'TAX_RETURN',
        'EMPLOYMENT_LETTER', 'SALARY_CERTIFICATE', 'VISA', 'RESIDENCE_PERMIT',
        'SOCIAL_SECURITY_CARD', 'VOTER_ID', 'MARRIAGE_CERTIFICATE'
      ],
      ORGANIZATION: [
        'CERTIFICATE_OF_INCORPORATION', 'MEMORANDUM_OF_ASSOCIATION', 'ARTICLES_OF_ASSOCIATION',
        'BUSINESS_LICENSE', 'TAX_REGISTRATION', 'VAT_CERTIFICATE', 'BOARD_RESOLUTION',
        'SHAREHOLDER_AGREEMENT', 'FINANCIAL_STATEMENTS', 'AUDIT_REPORT', 'BANK_REFERENCE',
        'TRADE_LICENSE', 'REGULATORY_LICENSE', 'POWER_OF_ATTORNEY', 'CORPORATE_STRUCTURE',
        'UBO_DECLARATION', 'COMPLIANCE_CERTIFICATE', 'INSURANCE_CERTIFICATE'
      ]
    };

    const documentStatuses = ['NEW', 'PENDING_REVIEW', 'VALID', 'REJECTED', 'ABOUT_TO_EXPIRE', 'EXPIRED'];
    
    // File extensions and MIME types
    const fileTypes = [
      { extension: 'pdf', mimeType: 'application/pdf', weight: 60 },
      { extension: 'jpg', mimeType: 'image/jpeg', weight: 20 },
      { extension: 'png', mimeType: 'image/png', weight: 15 },
      { extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', weight: 5 }
    ];

    const documents = [];
    const now = new Date();

    // Generate documents for each entity
    for (const entity of entities) {
      const entityDocTypes = documentTypes[entity.entity_type] || documentTypes.INDIVIDUAL;
      
      // Each entity gets 2-8 documents
      const numDocuments = Math.floor(Math.random() * 7) + 2;
      const usedDocTypes = new Set();
      
      for (let i = 0; i < numDocuments; i++) {
        // Select a unique document type for this entity
        let selectedDocType;
        let attempts = 0;
        do {
          selectedDocType = entityDocTypes[Math.floor(Math.random() * entityDocTypes.length)];
          attempts++;
        } while (usedDocTypes.has(selectedDocType) && attempts < 20);
        
        if (usedDocTypes.has(selectedDocType) && entityDocTypes.length <= usedDocTypes.size) {
          break; // No more unique document types available
        }
        usedDocTypes.add(selectedDocType);

        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Select file type based on weights
        const randomWeight = Math.random() * 100;
        let cumulativeWeight = 0;
        let selectedFileType = fileTypes[0];
        for (const fileType of fileTypes) {
          cumulativeWeight += fileType.weight;
          if (randomWeight <= cumulativeWeight) {
            selectedFileType = fileType;
            break;
          }
        }

        // Generate file details
        const fileName = `${selectedDocType.toLowerCase().replace(/_/g, '-')}-${entity.id.substring(0, 8)}.${selectedFileType.extension}`;
        const filePath = `/documents/${entity.entity_type.toLowerCase()}/${entity.id}/${fileName}`;
        const fileSize = Math.floor(Math.random() * 5000000) + 100000; // 100KB to 5MB

        // Generate status
        const status = documentStatuses[Math.floor(Math.random() * documentStatuses.length)];
        
        // Generate dates
        const uploadedAt = new Date(now.getTime() - Math.floor(Math.random() * 365 * 2) * 24 * 60 * 60 * 1000); // Up to 2 years ago
        
        let expiryDate = null;
        if (['PASSPORT', 'DRIVERS_LICENSE', 'VISA', 'BUSINESS_LICENSE', 'REGULATORY_LICENSE'].includes(selectedDocType)) {
          // These documents typically have expiry dates
          expiryDate = new Date(uploadedAt.getTime() + Math.floor(Math.random() * 365 * 10) * 24 * 60 * 60 * 1000); // Up to 10 years from upload
        }

        let verifiedAt = null;
        let verifiedBy = null;
        if (status === 'VALID' && Math.random() > 0.3) { // 70% chance of verification for valid documents
          verifiedAt = new Date(uploadedAt.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000); // Within 30 days of upload
          verifiedBy = users[Math.floor(Math.random() * users.length)].id;
        }

        // Generate notes
        const notes = [
          'Document uploaded for verification',
          'Required for compliance check',
          'Updated version of previous document',
          'Additional documentation requested',
          'Backup document for verification',
          null, null, null // Higher chance of no notes
        ];
        const selectedNote = notes[Math.floor(Math.random() * notes.length)];

        // Generate document number for certain types
        let documentNumber = null;
        if (['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE'].includes(selectedDocType)) {
          documentNumber = Math.random().toString(36).substring(2, 15).toUpperCase();
        }

        // Generate issuing authority and country
        const issuingCountry = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'SG'][Math.floor(Math.random() * 8)];
        const issuingAuthority = selectedDocType === 'PASSPORT' ? `${issuingCountry} Department of State` : 
                                selectedDocType === 'NATIONAL_ID' ? `${issuingCountry} National Registry` :
                                selectedDocType === 'DRIVERS_LICENSE' ? `${issuingCountry} DMV` : null;

        documents.push({
          entity_id: entity.id,
          document_type: selectedDocType,
          document_subtype: null,
          file_name: fileName,
          file_path: filePath,
          file_hash: Math.random().toString(36).substring(2, 66), // SHA-256 hash simulation
          mime_type: selectedFileType.mimeType,
          storage_provider: 'LOCAL',
          issued_by: issuingAuthority,
          issued_date: uploadedAt.toISOString().split('T')[0],
          expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
          country: issuingCountry,
          status: status,
          review_notes: selectedNote,
          uploaded_by: randomUser.id,
          uploaded_at: uploadedAt.toISOString(),
          verified_by: verifiedBy,
          verified_at: verifiedAt ? verifiedAt.toISOString() : null
        });
      }
    }

    // Insert documents in batches
    const batchSize = 50;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const values = batch.map(doc => {
        const documentSubtypeValue = doc.document_subtype ? `'${doc.document_subtype}'` : 'NULL';
        const fileHashValue = doc.file_hash ? `'${doc.file_hash}'` : 'NULL';
        const mimeTypeValue = doc.mime_type ? `'${doc.mime_type}'` : 'NULL';
        const storageProviderValue = doc.storage_provider ? `'${doc.storage_provider}'` : 'NULL';
        const issuedByValue = doc.issued_by ? `'${doc.issued_by.replace(/'/g, "''")}'` : 'NULL';
        const issuedDateValue = doc.issued_date ? `'${doc.issued_date}'` : 'NULL';
        const expiryDateValue = doc.expiry_date ? `'${doc.expiry_date}'` : 'NULL';
        const countryValue = doc.country ? `'${doc.country}'` : 'NULL';
        const reviewNotesValue = doc.review_notes ? `'${doc.review_notes.replace(/'/g, "''")}'` : 'NULL';
        const verifiedByValue = doc.verified_by ? `'${doc.verified_by}'` : 'NULL';
        const verifiedAtValue = doc.verified_at ? `'${doc.verified_at}'` : 'NULL';
        
        return `(gen_random_uuid(), '${doc.entity_id}', '${doc.document_type}', ${documentSubtypeValue}, '${doc.file_name}', '${doc.file_path}', ${fileHashValue}, ${mimeTypeValue}, ${storageProviderValue}, ${issuedByValue}, ${issuedDateValue}, ${expiryDateValue}, ${countryValue}, '${doc.status}', ${reviewNotesValue}, '${doc.uploaded_by}', '${doc.uploaded_at}', ${verifiedByValue}, ${verifiedAtValue})`;
      }).join(', ');

      await queryRunner.query(`
        INSERT INTO documents (id, entity_id, document_type, document_subtype, file_name, file_path, file_hash, mime_type, storage_provider, issued_by, issued_date, expiry_date, country, status, review_notes, uploaded_by, uploaded_at, verified_by, verified_at)
        VALUES ${values}
      `);
    }

    console.log(`✅ Successfully seeded ${documents.length} documents`);

  } catch (error) {
    console.error('❌ Error seeding documents:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}