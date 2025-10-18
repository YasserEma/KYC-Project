import { DataSource } from 'typeorm';

export async function seedLogs(dataSource: DataSource): Promise<void> {
  console.log('🔄 Seeding logs...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Check if logs already exist
    const existingLogs = await queryRunner.query('SELECT COUNT(*) as count FROM logs');
    if (parseInt(existingLogs[0].count) > 0) {
      console.log('📋 Logs already exist, skipping seeding');
      return;
    }

    // Get some existing data for realistic logs
    const subscribers = await queryRunner.query('SELECT id FROM subscribers LIMIT 3');
    const users = await queryRunner.query('SELECT id, subscriber_id FROM subscriber_users LIMIT 10');
    const entities = await queryRunner.query('SELECT id FROM entities LIMIT 20');

    if (subscribers.length === 0 || users.length === 0) {
      console.log('⚠️ No subscribers or users found, skipping logs seeding');
      return;
    }

    const logTypes = ['LOGIN', 'LOGOUT', 'ENTITY_CREATE', 'ENTITY_UPDATE', 'DOCUMENT_UPLOAD', 'SCREENING_RUN', 'RISK_ASSESSMENT', 'CONFIG_CHANGE', 'USER_CREATE', 'SYSTEM_ERROR'];
    const logLevels = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
    const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.45', '198.51.100.78'];
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    ];

    const logs = [];
    const now = new Date();

    // Generate logs for the past 30 days
    for (let i = 0; i < 500; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
      let logLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
      
      // Create timestamp within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const logTimestamp = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));

      let message = '';
      let details = {};

      switch (logType) {
        case 'LOGIN':
          message = `User logged in successfully`;
          details = { login_method: 'email_password', session_id: `sess_${Math.random().toString(36).substr(2, 9)}` };
          break;
        case 'LOGOUT':
          message = `User logged out`;
          details = { session_duration: Math.floor(Math.random() * 7200) + 300 }; // 5 minutes to 2 hours
          break;
        case 'ENTITY_CREATE':
          message = `New entity created`;
          if (entities.length > 0) {
            const randomEntity = entities[Math.floor(Math.random() * entities.length)];
            details = { entity_id: randomEntity.id, entity_type: Math.random() > 0.5 ? 'INDIVIDUAL' : 'ORGANIZATION' };
          }
          break;
        case 'ENTITY_UPDATE':
          message = `Entity information updated`;
          if (entities.length > 0) {
            const randomEntity = entities[Math.floor(Math.random() * entities.length)];
            details = { entity_id: randomEntity.id, fields_updated: ['name', 'address', 'status'][Math.floor(Math.random() * 3)] };
          }
          break;
        case 'DOCUMENT_UPLOAD':
          message = `Document uploaded for verification`;
          details = { document_type: ['PASSPORT', 'NATIONAL_ID', 'UTILITY_BILL'][Math.floor(Math.random() * 3)], file_size: Math.floor(Math.random() * 5000000) + 100000 };
          break;
        case 'SCREENING_RUN':
          message = `Screening analysis completed`;
          details = { screening_type: ['SANCTIONS', 'PEP', 'ADVERSE_MEDIA'][Math.floor(Math.random() * 3)], matches_found: Math.floor(Math.random() * 5) };
          break;
        case 'RISK_ASSESSMENT':
          message = `Risk assessment completed`;
          details = { risk_score: Math.floor(Math.random() * 100), risk_level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] };
          break;
        case 'CONFIG_CHANGE':
          message = `Configuration updated`;
          details = { config_type: ['SCREENING', 'RISK'][Math.floor(Math.random() * 2)], version: Math.floor(Math.random() * 5) + 1 };
          break;
        case 'USER_CREATE':
          message = `New user account created`;
          details = { user_role: ['ADMIN', 'OPERATOR', 'VIEWER'][Math.floor(Math.random() * 3)] };
          break;
        case 'SYSTEM_ERROR':
          message = `System error occurred`;
          details = { error_code: `ERR_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`, component: ['DATABASE', 'API', 'SCREENING_SERVICE'][Math.floor(Math.random() * 3)] };
          logLevel = 'ERROR';
          break;
      }

      logs.push({
        id: `gen_random_uuid()`,
        subscriber_id: randomUser.subscriber_id,
        user_id: randomUser.id,
        timestamp: logTimestamp.toISOString(),
        action_type: logType,
        entity_type: (details as any).entity_type || null,
        entity_id: (details as any).entity_id || null,
        action_description: message,
        ip_address: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
        user_agent: userAgents[Math.floor(Math.random() * userAgents.length)],
        request_data: JSON.stringify(details),
        response_data: null,
        status: logLevel === 'ERROR' ? 'FAILED' : 'SUCCESS',
        error_message: logLevel === 'ERROR' ? message : null,
        session_id: (details as any).session_id || null,
        affected_fields: (details as any).fields_updated ? JSON.stringify([(details as any).fields_updated]) : null,
        severity: logLevel
      });
    }

    // Insert logs in batches
    const batchSize = 50;
    for (let i = 0; i < logs.length; i += batchSize) {
      const batch = logs.slice(i, i + batchSize);
      const values = batch.map(log => 
        `(gen_random_uuid(), '${log.subscriber_id}', ${log.user_id ? `'${log.user_id}'` : 'NULL'}, '${log.timestamp}', '${log.action_type}', ${log.entity_type ? `'${log.entity_type}'` : 'NULL'}, ${log.entity_id ? `'${log.entity_id}'` : 'NULL'}, '${log.action_description.replace(/'/g, "''")}', '${log.ip_address}', '${log.user_agent.replace(/'/g, "''")}', '${log.request_data}', ${log.response_data ? `'${log.response_data}'` : 'NULL'}, '${log.status}', ${log.error_message ? `'${log.error_message.replace(/'/g, "''")}'` : 'NULL'}, ${log.session_id ? `'${log.session_id}'` : 'NULL'}, ${log.affected_fields ? `'${log.affected_fields}'` : 'NULL'}, '${log.severity}')`
      ).join(', ');

      await queryRunner.query(`
        INSERT INTO logs (id, subscriber_id, user_id, timestamp, action_type, entity_type, entity_id, action_description, ip_address, user_agent, request_data, response_data, status, error_message, session_id, affected_fields, severity)
        VALUES ${values}
      `);
    }

    console.log(`✅ Successfully seeded ${logs.length} log entries`);

  } catch (error) {
    console.error('❌ Error seeding logs:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}