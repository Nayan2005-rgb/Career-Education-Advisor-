const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runSchema() {
  let connection;

  try {
    connection = await pool.getConnection();

    const schemaPath = path.join(
      __dirname,
      '..',
      'data',
      'aishe',
      'aishe_schema_2023_24.sql'
    );

    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Remove SQL comments
    const cleanSql = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanSql
      .split(';')
      .map(statement => statement.trim())
      .filter(Boolean);

    console.log(`Found ${statements.length} SQL statements.`);

    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log('');
    console.log('======================================');
    console.log('AISHE schema created successfully!');
    console.log('======================================');

  } catch (error) {
    console.error('Error running AISHE schema:');
    console.error(error.message);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

runSchema();