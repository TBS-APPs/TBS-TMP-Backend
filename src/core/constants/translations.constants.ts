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
});
