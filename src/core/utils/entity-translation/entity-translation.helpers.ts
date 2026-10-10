import { I18nContext } from 'nestjs-i18n';
import {
  EntityTranslationItem,
  EntityTranslationView,
  LocalizedFields,
  LocalizedMap,
  TranslationIncludeKey,
  TranslationPresentOptions,
} from './entity-translation.types';

export function toNamesMap(
  rows: Array<{ localeCode: string; name: string }>,
): Record<string, string> {
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.localeCode] = row.name;
    return acc;
  }, {});
}

export function resolveLocalizedName(
  names: Record<string, string>,
  locale: string | undefined,
  fallback = '',
): string {
  if (locale && names[locale]) {
    return names[locale];
  }
  const first = Object.values(names)[0];
  return first ?? fallback;
}

export function mapTranslationViews(
  translations:
    | Array<{ name: string; locale?: { code: string } | null }>
    | undefined,
): EntityTranslationView[] {
  if (!translations?.length) {
    return [];
  }
  return translations
    .filter((row) => row.locale?.code)
    .map((row) => ({
      localeCode: row.locale!.code,
      name: row.name,
    }));
}

export function parseInclude(
  include?: string,
): Set<TranslationIncludeKey> {
  const result = new Set<TranslationIncludeKey>();
  if (!include?.trim()) {
    return result;
  }
  for (const part of include.split(',')) {
    const key = part.trim().toLowerCase();
    if (key === 'translations' || key === 'localized') {
      result.add(key);
    }
  }
  return result;
}

/** First language tag only; `ar-SA` → `ar`. */
export function parseAcceptLanguage(header?: string): string | undefined {
  if (!header?.trim()) {
    return undefined;
  }
  const first = header.split(',')[0]?.trim();
  if (!first) {
    return undefined;
  }
  const tag = first.split(';')[0]?.trim();
  if (!tag) {
    return undefined;
  }
  return tag.split('-')[0]?.toLowerCase() || undefined;
}

export function toLocalizedMap(
  translations: EntityTranslationView[],
): LocalizedMap {
  return translations.reduce<LocalizedMap>((acc, row) => {
    acc[row.localeCode] = { name: row.name };
    return acc;
  }, {});
}

export function resolveLocalizedFields(
  translations: EntityTranslationView[],
  locale: string | undefined,
  defaultLocaleCode: string | undefined,
): LocalizedFields | null {
  if (!translations.length) {
    return null;
  }
  const byCode = new Map(
    translations.map((row) => [row.localeCode, row] as const),
  );
  const matched =
    (locale ? byCode.get(locale) : undefined) ??
    (defaultLocaleCode ? byCode.get(defaultLocaleCode) : undefined) ??
    translations[0];
  if (!matched) {
    return null;
  }
  return { name: matched.name };
}

export function presentTranslatedEntity<T extends object>(
  entity: T,
  translations:
    | Array<{ name: string; locale?: { code: string } | null }>
    | EntityTranslationView[]
    | undefined,
  options: TranslationPresentOptions = {},
) {
  const { translations: _ignored, ...rest } = entity as T & {
    translations?: unknown;
  };

  const translationViews: EntityTranslationView[] =
    Array.isArray(translations) &&
    translations.length > 0 &&
    'localeCode' in translations[0]
      ? (translations as EntityTranslationView[])
      : mapTranslationViews(
          translations as
            | Array<{ name: string; locale?: { code: string } | null }>
            | undefined,
        );

  const include = parseInclude(options.include);
  const requestedLocale = parseAcceptLanguage(I18nContext.current()?.lang);

  const result: Record<string, unknown> = { ...rest };

  if (requestedLocale) {
    const fields = resolveLocalizedFields(
      translationViews,
      requestedLocale,
      options.defaultLocaleCode,
    );
    if (fields) {
      Object.assign(result, fields);
    }
  }

  if (include.has('translations')) {
    result.translations = translationViews;
  }

  if (include.has('localized')) {
    result.localized = toLocalizedMap(translationViews);
  }

  return result;
}

/** @deprecated Use presentTranslatedEntity */
export function withLocalizedNames<T extends object>(
  entity: T,
  translations:
    | Array<{ name: string; locale?: { code: string } | null }>
    | undefined,
) {
  return presentTranslatedEntity(entity, translations, {
    include: 'translations,localized',
  });
}

export function isEntityTranslationItem(
  value: unknown,
): value is EntityTranslationItem {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as EntityTranslationItem;
  return typeof item.localeCode === 'string' && typeof item.name === 'string';
}
