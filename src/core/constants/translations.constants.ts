// Dynamic translation key creator
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

// Common translation keys - define prefix once, then just the key names
export const COMMON_KEYS = createTranslationKeys('common', {
  SUCCESS: 'success',
  FAILED: 'failed',
  LOADING: 'loading',
  SAVE: 'save',
  CANCEL: 'cancel',
  DELETE: 'delete',
  EDIT: 'edit',
  CREATE: 'create',
  UPDATE: 'update',
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'sort',
  ACTIONS: 'actions',
  STATUS: 'status',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
});

// Error translation keys
export const ERROR_KEYS = createTranslationKeys('error', {
  INTERNAL_SERVER_ERROR: 'internal_server_error',
});

// Validation translation keys
export const VALIDATION_KEYS = createTranslationKeys('validation', {
  REQUIRED: 'required',
  EMAIL: 'email',
  PHONE: 'phone',
  DOMAIN: 'domain',
});

export const VALIDATION_PASSWORD_KEYS = createTranslationKeys(
  'validation.password',
  {
    PASSWORD_MIN_LENGTH: 'min_length',
    PASSWORD_MAX_LENGTH: 'max_length',
    PASSWORD_WEAK: 'weak',
    PASSWORD_MISMATCH: 'mismatch',
  },
);

export const VALIDATION_NAME_KEYS = createTranslationKeys('validation.name', {
  NAME_MIN_LENGTH: 'min_length',
  NAME_MAX_LENGTH: 'max_length',
});

export const VALIDATION_STORE_KEYS = createTranslationKeys('validation.store', {
  STORE_NAME_REQUIRED: 'name_required',
  STORE_DESCRIPTION_REQUIRED: 'description_required',
});

// Messages translation keys: Auth messages
export const MESSAGES_AUTH_KEYS = createTranslationKeys('messages.auth', {
  AUTH_USER_REGISTERED_SUCCESSFULLY: 'user_registered_successfully',
  AUTH_LOGIN_SUCCESSFULLY: 'login_successfully',
  AUTH_EMAIL_ALREADY_IN_USE: 'email_already_in_use',
  AUTH_PHONE_ALREADY_IN_USE: 'phone_already_in_use',
  AUTH_WRONG_EMAIL_OR_PASSWORD: 'wrong_email_or_password',
  AUTH_MISSING_AUTH_CONFIGURATION: 'missing_auth_configuration',
  AUTH_EMAIL_NOT_FOUND: 'email_not_found',
  AUTH_LOGOUT_SUCCESSFULLY: 'logout_successfully',
  AUTH_TOKEN_EXPIRED: 'token_expired',
  AUTH_INVALID_TOKEN: 'invalid_token',
  AUTH_ACCESS_DENIED: 'access_denied',
  AUTH_ACCOUNT_LOCKED: 'account_locked',
  AUTH_ACCOUNT_DISABLED: 'account_disabled',
  AUTH_USER_REGISTRATION_FAILED: 'user_registration_failed',
  AUTH_AUTHENTICATION_FAILED: 'authentication_failed',
  AUTH_PLEASE_VERIFY_OTP_SENT: 'please_verify_otp_sent',
  AUTH_SUCCESSFULLY_VERIFIED: 'successfully_verified',
  AUTH_REFRESH_TOKEN_UPDATED: 'refresh_token_updated',
  AUTH_NOT_VERIFIED: 'not_verified',
  AUTH_PASSWORD_CHANGED_SUCCESSFULLY: 'password_changed_successfully',
  AUTH_SAME_AS_OLD_PASSWORD: 'same_as_old_password',
});

// Messages translation keys: User messages
export const MESSAGES_USER_KEYS = createTranslationKeys('messages.user', {
  USER_PROFILE_UPDATED: 'profile_updated',
  USER_PASSWORD_CHANGED: 'password_changed',
  USER_NOT_FOUND: 'user_not_found',
  USER_DELETED: 'user_deleted',
  USER_ALREADY_APPROVED: 'user_already_approved',
  USER_UPDATE_FAILED: 'update_failed',
});

export const MESSAGES_SESSION_KEYS = createTranslationKeys('messages.session', {
  SESSION_DATA_NOT_VALID: 'session_data_not_valid',
  SESSION_CREATED: 'session_created',
  SESSION_NOT_FOUND: 'session_not_found',
  SESSION_UPDATED: 'session_updated',
});

// Messages translation keys: Store messages
export const MESSAGES_STORE_KEYS = createTranslationKeys('messages.store', {
  STORE_CREATED: 'store_created',
  STORE_UPDATED: 'store_updated',
  STORE_DELETED: 'store_deleted',
  STORE_NOT_FOUND: 'store_not_found',
  STORE_ALREADY_EXISTS: 'store_already_exists',
  STORE_SLUG_ALREADY_EXISTS: 'store_slug_already_exists',
  STORE_CREATION_FAILED: 'store_creation_failed',
  STORE_UPDATE_FAILED: 'store_update_failed',
  STORE_FETCHED_SUCCESSFULLY: 'store_fetched_successfully',
  FAILED_TO_FETCH_STORE: 'failed_to_fetch_store',
  STORES_FETCHED_SUCCESSFULLY: 'stores_fetched_successfully',
  FAILED_TO_FETCH_STORES: 'failed_to_fetch_stores',
  ID_IS_REQUIRED: 'id_is_required',
  STORE_INVALID: 'store_invalid',
  STORE_DELETED_SUCCESSFULLY: 'store_deleted_successfully',
  STORE_DELETION_FAILED: 'store_deletion_failed',
  VAT_NOT_ENABLED: 'vat_not_enabled',
  VAT_REGISTRATION_UPDATED: 'vat_registration_updated',
  VAT_REGISTRATION_UPDATE_FAILED: 'vat_registration_update_failed',
  VAT_STATUS_FETCHED: 'vat_status_fetched',
  VAT_STATUS_FETCH_FAILED: 'vat_status_fetch_failed',
  SUBDOMAIN_CREATION_FAILED: 'subdomain_creation_failed',
});

export const MESSAGES_EMAIL_KEYS = createTranslationKeys('messages.email', {
  EMAIL_SENT: 'email_sent',
});

export const MESSAGES_OTP_KEYS = createTranslationKeys('messages.otp', {
  OTP_NOT_FOUND: 'otp_not_found',
  OTP_CONSUMED: 'otp_consumed',
  OTP_EXPIRED: 'otp_expired',
  WRONG_OTP: 'wrong_otp',
  OTP_SENT_SUCCESSFULLY: 'otp_sent_successfully',
});

// Messages translation keys: Currency messages
export const MESSAGES_CURRENCY_KEYS = createTranslationKeys(
  'messages.currency',
  {
    CURRENCIES_FETCHED_SUCCESSFULLY: 'currencies_fetched_successfully',
    FAILED_TO_FETCH_CURRENCIES: 'failed_to_fetch_currencies',
  },
);

// Messages translation keys: Country messages
export const MESSAGES_COUNTRY_KEYS = createTranslationKeys('messages.country', {
  COUNTRIES_FETCHED_SUCCESSFULLY: 'countries_fetched_successfully',
  FAILED_TO_FETCH_COUNTRIES: 'failed_to_fetch_countries',
});

// Messages translation keys: Store Category messages
export const MESSAGES_STORE_CATEGORY_KEYS = createTranslationKeys(
  'messages.store_category',
  {
    STORE_CATEGORIES_FETCHED_SUCCESSFULLY:
      'store_categories_fetched_successfully',
    FAILED_TO_FETCH_STORE_CATEGORIES: 'failed_to_fetch_store_categories',
  },
);

export const MESSAGES_CATEGORY_KEYS = createTranslationKeys(
  'messages.category',
  {
    CATEGORY_NOT_FOUND: 'category_not_found',
    PARENT_NOT_FOUND: 'parent_not_found',
    SLUG_EXISTS: 'slug_exists',
    CATEGORY_CREATED_SUCCESSFULLY: 'category_created_successfully',
    CATEGORY_CREATION_FAILED: 'category_creation_failed',
    MAX_DEPTH: 'max_depth',
    CATEGORY_UPDATED_SUCCESSFULLY: 'category_updated_successfully',
    CATEGORY_DELETED_SUCCESSFULLY: 'category_deleted_successfully',
    CATEGORY_HAS_PRODUCTS: 'category_has_products',
    PARENT_SHOULD_BE_DIFFERENT: 'parent_should_be_different',
  },
);

export const MESSAGES_PRODUCT_KEYS = createTranslationKeys('messages.product', {
  SLUG_EXISTS: 'slug_exists',
  PRODUCT_CREATED_SUCCESSFULLY: 'product_created_successfully',
  PRODUCT_CREATION_FAILED: 'product_creation_failed',
  INVALID_PRICE: 'invalid_price',
  INVALID_SALE_PRICE: 'invalid_sale_price',
  PRODUCTS_FETCHED_SUCCESSFULLY: 'products_fetched_successfully',
  PRODUCT_NOT_FOUND: 'product_not_found',
  PRODUCT_DELETED_SUCCESSFULLY: 'product_deleted_successfully',
  PRODUCT_UPDATED_SUCCESSFULLY: 'product_updated_successfully',
});

export const MESSAGES_PRODUCT_ATTRIBUTE_KEYS = createTranslationKeys(
  'messages.product_attribute',
  {
    CREATED_SUCCESSFULLY: 'created_successfully',
    CREATION_FAILED: 'creation_failed',
    MISSING_DATA: 'missing_data',
  },
);

export const MESSAGES_TEMPLATE_KEYS = createTranslationKeys(
  'messages.template',
  {
    NOT_FOUND: 'not_found',
    UPDATE_FAILED: 'update_failed',
    UPDATED_SUCCESSFULLY: 'updated_successfully',
  },
);

export const MESSAGES_ABOUT_KEYS = createTranslationKeys('messages.about', {
  CREATED_SUCCESSFULLY: 'created_successfully',
  CREATION_FAILED: 'creation_failed',
  UPDATED_SUCCESSFULLY: 'updated_successfully',
  UPDATE_FAILED: 'update_failed',
  DELETED_SUCCESSFULLY: 'deleted_successfully',
  DELETION_FAILED: 'deletion_failed',
  RETRIEVED_SUCCESSFULLY: 'retrieved_successfully',
  RETRIEVAL_FAILED: 'retrieval_failed',
  NOT_FOUND: 'not_found',
  MISSING_DATA: 'missing_data',
});

export const MESSAGES_BRAND_KEYS = createTranslationKeys('messages.brand', {
  BRAND_NOT_FOUND: 'brand_not_found',
  BRAND_CREATED_SUCCESSFULLY: 'brand_created_successfully',
  BRAND_CREATION_FAILED: 'brand_creation_failed',
  BRAND_UPDATED_SUCCESSFULLY: 'brand_updated_successfully',
  BRAND_UPDATE_FAILED: 'brand_update_failed',
  BRAND_DELETED_SUCCESSFULLY: 'brand_deleted_successfully',
});

export const MESSAGES_PRODUCT_VARIANT_KEYS = createTranslationKeys(
  'messages.product_variant',
  {
    PRODUCT_VARIANT_CREATED_SUCCESSFULLY:
      'product_variant_created_successfully',
    PRODUCT_VARIANT_CREATION_FAILED: 'product_variant_creation_failed',
    PRODUCT_VARIANTS_FETCHED_SUCCESSFULLY:
      'product_variants_fetched_successfully',
    PRODUCT_VARIANT_NOT_FOUND: 'product_variant_not_found',
    PRODUCT_VARIANT_DELETED_SUCCESSFULLY:
      'product_variant_deleted_successfully',
    PRODUCT_VARIANTS_DELETED_SUCCESSFULLY:
      'product_variants_deleted_successfully',
    PRODUCT_VARIANT_UPDATED_SUCCESSFULLY:
      'product_variant_updated_successfully',
    PRODUCT_VARIANT_UPDATE_FAILED: 'product_variant_update_failed',
  },
);

export const MESSAGES_PRODUCT_ATTRIBUTE_TYPE_KEYS = createTranslationKeys(
  'messages.product_attribute_type',
  {
    NOT_FOUND: 'not_found',
  },
);

export const MESSAGES_PRODUCT_DISPLAY_INFO_KEYS = createTranslationKeys(
  'messages.product_display_info',
  {
    CREATED_SUCCESSFULLY: 'created_successfully',
    CREATION_FAILED: 'creation_failed',
    UPDATED_SUCCESSFULLY: 'updated_successfully',
    UPDATE_FAILED: 'update_failed',
    DELETED_SUCCESSFULLY: 'deleted_successfully',
    DELETION_FAILED: 'deletion_failed',
    NOT_FOUND: 'not_found',
    MISSING_DATA: 'missing_data',
  },
);

export const MESSAGES_PRODUCT_DISPLAY_INFO_VALUE_KEYS = createTranslationKeys(
  'messages.product_display_info_value',
  {
    CREATED_SUCCESSFULLY: 'created_successfully',
    CREATION_FAILED: 'creation_failed',
    UPDATED_SUCCESSFULLY: 'updated_successfully',
    UPDATE_FAILED: 'update_failed',
    DELETED_SUCCESSFULLY: 'deleted_successfully',
    DELETION_FAILED: 'deletion_failed',
    NOT_FOUND: 'not_found',
    MISSING_DATA: 'missing_data',
  },
);
