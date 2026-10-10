/**
 * Truncates seeded tables then re-runs all seeders.
 * Fresh environments: run `npm run migration:run` then `npm run seed:refresh`.
 */
import 'reflect-metadata';
import dataSource from './data-source';
import { runDatabaseSeeders } from './seed-runner';

async function truncateSeededTables(): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const tableNames = new Set(
    dataSource.entityMetadatas.map((meta) => meta.tableName),
  );

  const seedsExists = (await dataSource.query(
    `
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = current_schema()
        AND table_name = 'seeds'
      LIMIT 1
    `,
  )) as unknown[];

  if (seedsExists.length) {
    tableNames.add('seeds');
  }

  const toTruncate = [...tableNames];
  if (!toTruncate.length) {
    console.log('No seed tables found to truncate.');
    return;
  }

  const quoted = toTruncate.map((name) => `"${name}"`).join(', ');
  console.log(`Truncating: ${toTruncate.join(', ')}`);
  await dataSource.query(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
}

async function main() {
  try {
    await truncateSeededTables();
    await runDatabaseSeeders();
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

main().catch((error) => {
  console.error('Seed refresh failed:', error);
  process.exit(1);
});
