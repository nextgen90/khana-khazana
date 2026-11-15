import 'dotenv/config';
import { getDbPool, seedDemoDataInDb } from './neon';

async function main() {
  const result = await seedDemoDataInDb();
  console.log('NeonDB demo seed result:', JSON.stringify(result));
  const pool = getDbPool();
  if (pool) {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Demo seed failed:', err);
  process.exit(1);
});
