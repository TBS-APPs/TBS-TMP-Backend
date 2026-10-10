export type EntityTranslationItem = {
  localeCode: string;
  name: string;
};

export type EntityTranslationView = {
  localeCode: string;
  name: string;
};

export type LocalizedFields = {
  name: string;
};

export type LocalizedMap = Record<string, LocalizedFields>;

export type TranslationIncludeKey = 'translations' | 'localized';

export type TranslationPresentOptions = {
  include?: string;
  defaultLocaleCode?: string;
};
