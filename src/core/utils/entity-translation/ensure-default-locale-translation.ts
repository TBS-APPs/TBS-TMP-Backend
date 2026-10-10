import { Repository } from 'typeorm';
import { Locale } from 'src/modules/locale/entities/locale.entity';
import { EntityTranslationItem } from './entity-translation.types';

export async function getDefaultLocale(
  localeRepository: Repository<Locale>,
): Promise<Locale | null> {
  return localeRepository.findOne({
    where: { isDefault: true, isActive: true },
  });
}

export function hasDefaultLocaleTranslation(
  translations: EntityTranslationItem[],
  defaultLocaleCode: string,
): boolean {
  return translations.some(
    (item) => item.localeCode === defaultLocaleCode && item.name.trim() !== '',
  );
}
