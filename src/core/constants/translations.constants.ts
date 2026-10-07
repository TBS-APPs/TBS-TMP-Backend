const createTranslationKeys = (
  prefix: string,
  keys: Record<string, string>,
) => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(keys)) {
    result[key] = `${prefix}.${value}`;
  }
  return result;
};

export const COMMON_KEYS = createTranslationKeys('common', {
  SUCCESS: 'success',
  FAILED: 'failed',
});

export const ERROR_KEYS = createTranslationKeys('error', {
  INTERNAL_SERVER_ERROR: 'internal_server_error',
  PROVIDE_EXACTLY_ONE_OF_ID_OR_ALIAS: 'provide_exactly_one_of_id_or_alias',
  PROVIDE_EMAIL_OR_ID: 'provide_email_or_id',
  USER_NOT_FOUND: 'user_not_found',
  INVALID_CREDENTIALS: 'invalid_credentials',
  EMAIL_ALREADY_REGISTERED: 'email_already_registered',
  MOBILE_APP_SETTING_NOT_FOUND: 'mobile_app_setting_not_found',
  PLATFORM_ALREADY_EXISTS: 'platform_already_exists',
  MOBILE_APP_LOCALE_NOT_FOUND: 'mobile_app_locale_not_found',
  MOBILE_APP_TRANSLATION_KEY_NOT_FOUND: 'mobile_app_translation_key_not_found',
  MOBILE_APP_TRANSLATION_NOT_FOUND: 'mobile_app_translation_not_found',
  LOCALE_CODE_ALREADY_EXISTS: 'locale_code_already_exists',
  TRANSLATION_KEY_ALREADY_EXISTS: 'translation_key_already_exists',
  TRANSLATION_ALREADY_EXISTS: 'translation_already_exists',
  MOBILE_APP_THEME_PALETTE_NOT_FOUND: 'mobile_app_theme_palette_not_found',
  THEME_PALETTE_CODE_ALREADY_EXISTS: 'theme_palette_code_already_exists',
  CANNOT_DELETE_DEFAULT_THEME_PALETTE: 'cannot_delete_default_theme_palette',
});

