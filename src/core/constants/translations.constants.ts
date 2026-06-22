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
});
