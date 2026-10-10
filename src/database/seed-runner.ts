/**
 * Fresh environments: run `npm run migration:run` then `npm run seed`.
 *
 * Optional env:
 *   SEED_ADMIN_EMAIL=admin@example.com
 *   SEED_ADMIN_PASSWORD=ChangeMe123!
 *   SEED_ADMIN_NAME=Admin
 */
import 'reflect-metadata';
import { runSeeders } from 'typeorm-extension';
import dataSource from './data-source';

export async function runDatabaseSeeders(): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  console.log('Running seeders...');
  await runSeeders(dataSource);
  console.log('Seeders finished.');
}

async function main() {
  try {
    await runDatabaseSeeders();
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
}
