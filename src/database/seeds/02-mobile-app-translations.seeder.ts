import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { MobileAppLocale } from '../../modules/mobile-app-translation/entities/mobile-app-locale.entity';
import { MobileAppTranslation } from '../../modules/mobile-app-translation/entities/mobile-app-translation.entity';
import { MobileAppTranslationKey } from '../../modules/mobile-app-translation/entities/mobile-app-translation-key.entity';

const BATCH_SIZE = 200;

function loadArb(filename: string): Record<string, unknown> {
  const filePath = join(
    __dirname,
    '..',
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
  dataSource: DataSource,
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
  dataSource: DataSource,
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
  dataSource: DataSource,
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

export default class MobileAppTranslationsSeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Seeding mobile app translations...');

    const enLocale = await ensureLocale(dataSource, 'en', 'English', true);
    const arLocale = await ensureLocale(dataSource, 'ar', 'Arabic', false);

    const enArb = parseArb(loadArb('en.arb.json'));
    const arArb = parseArb(loadArb('ar.arb.json'));

    const allKeyNames = [
      ...new Set([
        ...enArb.values.keys(),
        ...arArb.values.keys(),
        ...enArb.metadata.keys(),
        ...arArb.metadata.keys(),
      ]),
    ];

    const mergedMetadata = new Map<string, Record<string, unknown>>([
      ...arArb.metadata,
      ...enArb.metadata,
    ]);

    console.log(`Upserting ${allKeyNames.length} keys...`);
    const keyToId = await upsertKeys(dataSource, allKeyNames, mergedMetadata);

    const enCount = await upsertTranslations(
      dataSource,
      enLocale.id,
      enArb.values,
      keyToId,
    );
    console.log(`en: ${enCount} translations upserted`);

    const arCount = await upsertTranslations(
      dataSource,
      arLocale.id,
      arArb.values,
      keyToId,
    );
    console.log(`ar: ${arCount} translations upserted`);
  }
}
