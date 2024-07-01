/* eslint-disable max-lines */
module.exports = {

  // Limit is 2 hrs. will block the IP for two hrs.
  API_RATE_LIMIT: { outerLimit: 5, outerTimeLimit: 2 * 60 * 60 * 1000, innerLimit: 10 },
  //
  ALLOWED_IP_LIST: [ '127.0.0.1', '::ffff:127.0.0.1' ],
  EXPOSED_HEADERS: [ 'token', 'slug', 'message', 'set-password', 'password', 'is-password-already-set', 'public-id', 'x-coreplatform-paging-limit',
    'x-coreplatform-total-records', 'x-coreplatform-concurrencystamp',
    'redirection-url', 'reference-id', 'vua-id', 'refresh-token', 'expires-in', 'image-url',
    'File-Name', 'file-name', 'file-size', 'content-disposition', 'Content-disposition', 'Content-Type', 'content-type', 'admin-password' ],
  IGNORE_PATH: [ '/ping', '/healthcheck', '.well-known/jwks', '/refresh-token' ],
  ISSUER: 'DEVCARTEL TECHNOLOGY PRIVATE LIMITED',
  MERCHANT_ADMIN_IGNORE_PATH: [ '/v1/merchant/admin/login' ],
  MERCHANT_SUPER_IGNORE_PATH: [ '/v1/merchant/super/auth' ],
  CUSTOMER_IGNORE_PATH: [ '/v1/customer/register', '/v1/customer/verification', '/v1/customer/device',
    '/v1/01/customer/payment/checkout' ],
  ADMIN_IGNORE_PATH: [ '/v1/admin/login', '/v1/admin/client/auth' ],
  PLATFORM: {
    AN: 'AN',
    IOS: 'IOS',
    WEB: 'WEB',
    POS: 'POS',
  },
  LOGIN_TYPE: {
    MOBILE_NUMBER_OTP: 'MOBILE_NUMBER_OTP',
    GOOGLE: 'GOOGLE',
    APPLE: 'APPLE',
    USER_NAME_PASSWORD: 'USER_NAME_PASSWORD',
    CLIENT_ID_SECRET: 'CLIENT_ID_SECRET',
  },
  OTP_TYPE: {
    USER_REGISTRAION: 'USER_REGISTRAION',
    E_SIGNED_REQUESTED: 'E_SIGNED_REQUESTED',
  },
  USER_STATUS: {
    BLOCKED: 'BLOCKED',
    DELETED: 'DELETED',
    IN_ACTIVE: 'IN_ACTIVE',
    ACTIVE: 'ACTIVE',
  },
  SALUTATION: {
    MR: 'Mr.',
    MS: 'Ms.',
    MRS: 'Mrs.',
    MISS: 'Miss',
    DR: 'Dr.',
  },
  GENDER: {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHERS: 'OTHERS',
    male: 'male',
    female: 'female',
    other: 'other',
  },
  ALGORITHM: {
    RS256: 'RS256',
  },
  PAYMENT_MODE: {
    CASH: 'CASH',
    CHEQUE: 'CHEQUE',
    UPI: 'UPI',
    CREDIT_CARD: 'CREDIT_CARD',
    DEBIT_CARD: 'DEBIT_CARD',
    ENACH: 'ENACH',
    NETBANKING: 'NETBANKING',
  },
  USER_TYPE: {
    // platform admin user
    PLATFORM: 'PLATFORM',
    // merchant admin user
    MERCHANT: 'MERCHANT',
    // customer of platform
    CUSTOMER: 'CUSTOMER',
  },
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  ROLE_TYPE: {
    SYSTEM_OWNER: 'system-owner',
    SYSTEM_ADMIN: 'system-admin',
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    ACCOUNTANT: 'accountant',
    OPERATION: 'operation',
    ANALYST: 'analyst',
  },
  GENDER_MAPPER: {
    m: 'MALE',
    f: 'FEMALE',
    o: 'OTHERS',
    M: 'MALE',
    F: 'FEMALE',
    O: 'OTHERS',
  },
  AUDIENCE_TYPE: {
    PLATFORM: 'PLATFORM',
    CUSTOMER: 'CUSTOMER',
    MERCHANT_ADMIN: 'MERCHANT_ADMIN',
    MERCHANT_SUPER: 'MERCHANT_SUPER',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    LAON_ELIGIBILITY: 'LAON_ELIGIBILITY',
  },
};
