const convertCamelCase = require('lodash.camelcase');
const convertSnakeCase = require('lodash.snakecase');
const axios = require('axios');
const moment = require('moment');
const generator = require('generate-password');
const crypto = require('crypto');

const { DEMO_ACCOUNT_MOBILE_NUMBER, DEMO_ACCOUNT_OTP } = require('../config');

const convertCamelObjectToSnake = (payload) => {
  const obj = { ...payload };
  const response = {};
  const objectKeys = Object.keys(obj);

  objectKeys.map((key) => {
    const convertedKey = convertSnakeCase(key);

    response[convertedKey] = obj[key];

    return true;
  });

  return response;
};

const convertCamelToSnake = (payload) => {
  const payloadDataType = typeof payload;

  switch (payloadDataType) {
    case 'string':
      return convertSnakeCase(payload);

    case 'object':
      return convertCamelObjectToSnake(payload);

    default:
      return payload;
  }
};

const convertSnakeObjectToCamel = (payload) => {
  const obj = {
    ...payload,
  };
  const response = {};
  const objectKeys = Object.keys(obj);

  objectKeys.map((key) => {
    const convertedKey = convertCamelCase(key);

    if (obj[key] && Object.prototype.toString.call(obj[key]) === '[object Object]' && !(obj[key] instanceof Date)) {
      const {
        dataValues,
      } = obj[key];

      let result;

      if (dataValues) {
        result = convertSnakeObjectToCamel(dataValues);
      } else {
        result = convertSnakeObjectToCamel(obj[key]);
      }

      response[convertedKey] = result;
    } else if (obj[key] && Object.prototype.toString.call(obj[key]) === '[object Array]' && !(obj[key] instanceof Date)) {
      const rows = [];

      obj[key].forEach((element) => {
        const {
          dataValues: dataValues2,
        } = element;

        let result;

        if (dataValues2) {
          if (Object.prototype.toString.call(dataValues2) === '[object Object]') {
            result = convertSnakeObjectToCamel(dataValues2);
          } else {
            result = dataValues2;
          }
        } else if (Object.prototype.toString.call(element) === '[object Object]') {
          result = convertSnakeObjectToCamel(element);
        } else {
          result = element;
        }
        rows.push(result);
      });

      response[convertedKey] = rows;
    } else {
      response[convertedKey] = obj[key];
    }

    return true;
  });

  return response;
};

const convertSnakeToCamel = (payload) => {
  const payloadDataType = typeof payload;

  switch (payloadDataType) {
    case 'string':
      return convertCamelCase(payload);

    case 'object':
      return convertSnakeObjectToCamel(payload);

    default:
      return payload;
  }
};

const convertKababToNormal = (payload) => {
  const payloadDataType = typeof payload;

  switch (payloadDataType) {
    case 'string':
      return convertCamelCase(payload);

    case 'object':
      return convertSnakeObjectToCamel(payload);

    default:
      return payload;
  }
};

const sanitizeStr = (regex, str, data) => {
  const sanitizedStr = str.replace(regex, data);

  return sanitizedStr;
};

const postRequest = async ({
  url, data, headers, httpsAgent,
}) => {
  try {
    const response = await axios({
      url: `${url}`,
      method: 'post',
      data,
      headers: headers || {
        'cache-control': 'no-cache',
      },
      httpsAgent,
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line max-len
    const { response: { status, statusText, data: responseData } } = error.response ? error : { response: { status: 500, statusText: error.message, data: error.stack } };

    // eslint-disable-next-line no-console
    console.log({ meta: { details: { status, statusText, response: responseData } } });

    return { status, errors: [ { name: 'server', message: 'There is some issue, Please try after some time' } ] };
  }
};

const getRequest = async ({ url, headers }) => {
  try {
    const response = await axios({
      url: `${url}`,
      method: 'get',
      headers,
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line max-len
    const { response: { status, statusText, data: responseData } } = error.response ? error : { response: { status: 500, statusText: error.message, data: error.stack } };

    // eslint-disable-next-line no-console
    console.log({ meta: { details: { status, statusText, response: responseData } } });

    return { status, errors: [ { name: 'server', message: 'There is some issue, Please try after some time' } ] };
  }
};

const convertToSlug = (string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string.toString().toLowerCase()
  // Replace spaces with -
    .replace(/\s+/g, '-')
    // Replace special characters
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    // Replace & with 'and'
    .replace(/&/g, '-and-')
    // Remove all non-word characters
    .replace(/[^\w\-\\]+/g, '')
  // Replace multiple - with single -
    // .replace(/\-\-+/g, '-')
    // Trim - from start of text
    .replace(/^-+/, '')
    // Trim - from end of text
    .replace(/-+$/, '');
};

const generateOTP = (mobileNumber) => {
  const digits = '0123456789';

  let otp = '';

  [ 0, 1, 2, 3, 4, 6 ].forEach(() => {
    otp += digits[Math.floor(Math.random() * 10)];
  });

  const now = new Date();
  const validity = moment(now).add(15, 'minutes');
  const validityInMinutes = 15;
  const currentDate = moment().utcOffset('+03:00').format('YYYY-MM-DD HH:mm:ss');

  if (mobileNumber === DEMO_ACCOUNT_MOBILE_NUMBER) {
    return {
      otp: DEMO_ACCOUNT_OTP,
      validity,
      validityInMinutes,
      currentDate,
    };
  }

  return {
    otp,
    validity,
    validityInMinutes,
    currentDate,
  };
};

const generatePassword = () => {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  return password;
};

const getFile = async ({ url, headers }) => {
  try {
    const response = await axios({
      url: `${url}`,
      method: 'get',
      headers: headers || { 'cache-control': 'no-cache' },
      responseType: 'stream',
    });

    return response;
  } catch (error) {
    return { errors: [ { name: 'server', message: 'There is some issue, Please try after some time' } ] };
  }
};

const encryptToken = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);

  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([ encrypted, cipher.final() ]);

  return `${encrypted.toString('hex')}|${iv.toString('hex')}`;
};

const decryptToken = (text, key, salt) => {
  const iv = Buffer.from(salt, 'hex');
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([ decrypted, decipher.final() ]);

  return decrypted.toString();
};

const getSalutation = (gender = 'other', maritalStatus = '', dob = new Date()) => {
  if (maritalStatus.toLowerCase() === 'married' && gender.toLowerCase() === 'female') {
    return 'Mrs.';
  }
  const a = moment();
  const b = moment(dob);

  if (a.diff(b, 'year') <= 30 && gender.toLowerCase() === 'female') {
    return 'Miss.';
  }
  if (gender.toLowerCase() === 'female') {
    return 'Ms.';
  }

  if (maritalStatus.toLowerCase() === 'married' && gender.toLowerCase() === 'female') {
    return 'Mrs.';
  }

  if (gender.toLowerCase() === 'male') {
    return 'Mr.';
  }

  return 'Mr.';
};

const compareJsonObject = (firstObject, secondObject) => {
  const keys = Object.keys(firstObject);

  const is = keys.every((key) => {
    const value = firstObject[key];

    if (Object.prototype.toString.call(value) === '[object Object]') {
      const iis = compareJsonObject(value, secondObject[key]);

      return iis;
    }
    if (Object.prototype.toString.call(value) === '[object Date]') {
      const iis = moment(secondObject[key]).format('YYYY-MM-DD') === moment(firstObject[key]).format('YYYY-MM-DD');

      return iis;
    }
    if (Object.prototype.toString.call(value) === '[object Array]') {
      const iss = value.every((elm, index) => {
        const iis = compareJsonObject(elm, secondObject[key][index]);

        return iis;
      });

      return iss;
    }
    const isTrue = secondObject[key] === firstObject[key];

    if (isTrue) {
      return isTrue;
    }

    return secondObject[key] === firstObject[key];
  });

  return is;
};

const sanitizeName = (name) => name.trim().replace(/\s{2,}/g, ' ').replace(/^(S\/O:|S\/O|D\/O:|D\/O|C\/O:|C\/O|Mr|Mrs|Ms|Miss|Shree)\.?\s/i, '').trim();

const convertObjectToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  return Array.isArray(obj)
    ? obj.map(convertObjectToCamelCase)
    : Object.entries(obj).reduce((camelCaseObj, [ key, value ]) => {
      const camelCaseKey = key.replace(/_([a-zA-Z])/g, (_, letter) => letter.toLowerCase());

      // eslint-disable-next-line no-param-reassign
      camelCaseObj[camelCaseKey.toLowerCase()] = convertObjectToCamelCase(value);

      return camelCaseObj;
    }, {});
};

const removeDuplicateKeys = (obj) => {
  const seenKeys = new Set();

  const traverse = (source) => {
    if (source && typeof source === 'object') {
      const result = Array.isArray(source) ? [] : {};

      Object.entries(source).forEach(([ key, value ]) => {
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          if (value && value[key]) {
            result[key.toLowerCase()] = value[key];

            return true;
          }

          result[key.toLowerCase()] = null;

          return true;
        }

        return true;
      });

      return result;
    }

    return source;
  };

  return traverse(obj);
};

const calculateLoanDetail = ({
  balancePrincipalAmount, balanceInterestAmount,
  balanceLatePaymentChargesAccrued,
  balancePenalInterestAmount, balanceBounceChargesAmount,
}, totalAmount) => {
  let amount = totalAmount;

  amount = (amount > 0 ? amount : 0);
  const bounceChargesAmount = parseFloat(balanceBounceChargesAmount) - (amount > 0 ? amount : 0) > 0 ? amount : parseFloat(balanceBounceChargesAmount);

  amount -= bounceChargesAmount;
  amount = (amount > 0 ? amount : 0);
  const penalInterestAmount = parseFloat(balancePenalInterestAmount) - (amount > 0 ? amount : 0) > 0 ? amount : parseFloat(balancePenalInterestAmount);

  amount -= penalInterestAmount;
  amount = (amount > 0 ? amount : 0);
  const latePaymentChargesAccrued = parseFloat(balanceLatePaymentChargesAccrued) - (amount > 0 ? amount : 0) > 0
    ? amount : parseFloat(balanceLatePaymentChargesAccrued);

  amount -= latePaymentChargesAccrued;
  amount = (amount > 0 ? amount : 0);
  const interestAmount = parseFloat(balanceInterestAmount) - (amount > 0 ? amount : 0) > 0 ? amount : parseFloat(balanceInterestAmount);

  amount -= interestAmount;
  amount = (amount > 0 ? amount : 0);

  const principalAmount = parseFloat(balancePrincipalAmount) - (amount > 0 ? amount : 0) > 0 ? amount : parseFloat(balancePrincipalAmount);

  amount -= principalAmount;
  amount = (amount > 0 ? amount : 0);

  return {
    principalAmount,
    interestAmount,
    latePaymentChargesAccrued,
    penalInterestAmount,
    bounceChargesAmount,
    balanceAmt: Math.round(amount * 100) / 100,
  };
};

const splitFullName = (name = '') => {
  const [ firstName, ...middleNamesAndLastName ] = name.split(' ').filter(Boolean);
  const lastName = middleNamesAndLastName.pop() || '';
  const middleName = middleNamesAndLastName.join(' ');

  return { firstName, middleName, lastName };
};

module.exports = {
  convertCamelObjectToSnake,
  convertCamelToSnake,
  convertSnakeObjectToCamel,
  convertSnakeToCamel,
  convertKababToNormal,
  sanitizeStr,
  postRequest,
  getRequest,
  convertToSlug,
  generateOTP,
  generatePassword,
  getFile,
  encryptToken,
  decryptToken,
  getSalutation,
  sanitizeName,
  compareJsonObject,
  convertObjectToCamelCase,
  removeDuplicateKeys,
  calculateLoanDetail,
  splitFullName,
};
