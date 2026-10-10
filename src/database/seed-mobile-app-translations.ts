import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Company } from '../modules/company/entities/company.entity';
import DynamicsSetting from '../modules/company/dynamics-settings/entities/dynamics-setting.entity';
import { License } from '../modules/company/license/entities/license.entity';
import Module from '../modules/module/entities/module.entity';
import { MobileAppSetting } from '../modules/mobile-app-settings/entities/mobile-app-setting.entity';
import { MobileAppLocale } from '../modules/mobile-app-translation/entities/mobile-app-locale.entity';
import { MobileAppTranslation } from '../modules/mobile-app-translation/entities/mobile-app-translation.entity';
import { MobileAppTranslationKey } from '../modules/mobile-app-translation/entities/mobile-app-translation-key.entity';
import { User } from '../modules/user/entities/user.entity';
import { Screen } from '../modules/screen/entities/screen.entity';
import { Feature } from 'src/modules/company/feature/entities/feature.entity';

const BATCH_SIZE = 200;

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [
    Company,
    DynamicsSetting,
    License,
    Module,
    MobileAppSetting,
    MobileAppLocale,
    MobileAppTranslationKey,
    MobileAppTranslation,
    User,
    Screen,
    Feature,
  ],
});

function loadArb(filename: string): Record<string, unknown> {
  const filePath = join(
    __dirname,
    '..',
    'modules',
    'mobile-app-translation',
    'seed',
    filename,
  );
  return JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

function parseArb(arb: Record<string, unknown>): {
  values: Map<string, string>;
  metadata: Map<string, Record<string, unknown>>;
} {
  const values = new Map<string, string>();
  const metadata = new Map<string, Record<string, unknown>>();

  for (const [rawKey, rawValue] of Object.entries(arb)) {
    if (rawKey === '@@locale' || rawKey.startsWith('@@')) {
      continue;
    }
    if (rawKey.startsWith('@')) {
      const baseKey = rawKey.slice(1);
      if (
        baseKey &&
        rawValue !== null &&
        typeof rawValue === 'object' &&
        !Array.isArray(rawValue)
      ) {
        metadata.set(baseKey, rawValue as Record<string, unknown>);
      }
      continue;
    }
    if (typeof rawValue === 'string') {
      values.set(rawKey, rawValue);
    }
  }

  return { values, metadata };
}

async function ensureLocale(
  code: string,
  name: string,
  isDefault: boolean,
): Promise<MobileAppLocale> {
  const repo = dataSource.getRepository(MobileAppLocale);
  let locale = await repo.findOne({ where: { code } });
  if (!locale) {
    if (isDefault) {
      await repo
        .createQueryBuilder()
        .update(MobileAppLocale)
        .set({ isDefault: false })
        .where('isDefault = :isDefault', { isDefault: true })
        .execute();
    }
    locale = await repo.save({
      code,
      name,
      isDefault,
      isActive: true,
    });
  }
  return locale;
}

async function upsertKeys(
  keyNames: string[],
  metadata: Map<string, Record<string, unknown>>,
): Promise<Map<string, string>> {
  const repo = dataSource.getRepository(MobileAppTranslationKey);
  const existing = await repo.find();
  const keyToId = new Map(existing.map((row) => [row.key, row.id]));

  const toInsert: Array<{
    key: string;
    metadata: Record<string, unknown> | null;
  }> = [];
  const toUpdate: MobileAppTranslationKey[] = [];

  for (const key of keyNames) {
    const meta = metadata.get(key) ?? null;
    const existingId = keyToId.get(key);
    if (existingId == null) {
      toInsert.push({ key, metadata: meta });
    } else if (meta) {
      const row = existing.find((item) => item.id === existingId);
      if (row) {
        row.metadata = meta;
        toUpdate.push(row);
      }
    }
  }

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const chunk = toInsert.slice(i, i + BATCH_SIZE);
    const saved = await repo.save(chunk);
    for (const row of saved) {
      keyToId.set(row.key, row.id);
    }
  }

  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    await repo.save(toUpdate.slice(i, i + BATCH_SIZE));
  }

  return keyToId;
}

async function upsertTranslations(
  localeId: string,
  values: Map<string, string>,
  keyToId: Map<string, string>,
): Promise<number> {
  const repo = dataSource.getRepository(MobileAppTranslation);
  const existing = await repo.find({
    where: { locale: { id: localeId } },
    relations: { translationKey: true },
  });
  const byKeyId = new Map(
    existing.map((row) => [row.translationKey.id, row]),
  );

  const toInsert: Array<{
    value: string;
    translationKey: { id: string };
    locale: { id: string };
  }> = [];
  const toUpdate: MobileAppTranslation[] = [];

  for (const [key, value] of values) {
    const keyId = keyToId.get(key);
    if (keyId == null) {
      continue;
    }
    const current = byKeyId.get(keyId);
    if (current) {
      if (current.value !== value) {
        current.value = value;
        toUpdate.push(current);
      }
    } else {
      toInsert.push({
        value,
        translationKey: { id: keyId },
        locale: { id: localeId },
      });
    }
  }

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    await repo.save(toInsert.slice(i, i + BATCH_SIZE));
  }
  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    await repo.save(toUpdate.slice(i, i + BATCH_SIZE));
  }

  return toInsert.length + toUpdate.length;
}

async function main() {
  await dataSource.initialize();
  console.log('Connected. Seeding mobile app translations...');

  const enLocale = await ensureLocale('en', 'English', true);
  const arLocale = await ensureLocale('ar', 'Arabic', false);

  const enArb = parseArb(loadArb('en.arb.json'));
  const arArb = parseArb(loadArb('ar.arb.json'));

  const allKeyNames = [
    ...new Set([...enArb.values.keys(), ...arArb.values.keys(), ...enArb.metadata.keys(), ...arArb.metadata.keys()]),
  ];

  const mergedMetadata = new Map<string, Record<string, unknown>>([
    ...arArb.metadata,
    ...enArb.metadata,
  ]);

  console.log(`Upserting ${allKeyNames.length} keys...`);
  const keyToId = await upsertKeys(allKeyNames, mergedMetadata);

  console.log('Upserting English translations...');
  const enCount = await upsertTranslations(
    enLocale.id,
    enArb.values,
    keyToId,
  );
  console.log(`en: ${enCount} translations upserted`);

  console.log('Upserting Arabic translations...');
  const arCount = await upsertTranslations(
    arLocale.id,
    arArb.values,
    keyToId,
  );
  console.log(`ar: ${arCount} translations upserted`);

  const keyCount = await dataSource
    .getRepository(MobileAppTranslationKey)
    .count();
  const translationCount = await dataSource
    .getRepository(MobileAppTranslation)
    .count();
  const localeCount = await dataSource.getRepository(MobileAppLocale).count();

  console.log(
    `Done. Totals — locales: ${localeCount}, keys: ${keyCount}, translations: ${translationCount}`,
  );

  await dataSource.destroy();
}

main().catch(async (error) => {
  console.error('Seed failed:', error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
