// Quick test to verify MySQL connection and users table
import 'dotenv/config';
import { pool } from './db.js';

async function testDB() {
  try {
    console.log('Testing MySQL connection...');
    const [rows] = await pool.query('SELECT 1 as ok');
    console.log('✓ MySQL connection successful:', rows[0]);
    
    const [tables] = await pool.query('SHOW TABLES LIKE "users"');
    if (tables.length === 0) {
      console.log('✗ users table does not exist!');
      console.log('Creating users table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(100) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('✓ users table created');
    } else {
      console.log('✓ users table exists');
    }
    
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`✓ Users in database: ${users[0].count}`);
    
    await pool.end();
    console.log('\n✓ All checks passed! Database is ready.');
  } catch (err) {
    console.error('✗ Database test failed:', err.message);
    process.exit(1);
  }
}

testDB();
