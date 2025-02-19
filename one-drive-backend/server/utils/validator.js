const Ajv = require('ajv').default;
const Helper = require('./helper');

const ajv = new Ajv({
  verbose: true,
  allErrors: true,
  $data: true,
  trim: true,
});

require('ajv-formats')(ajv);
require('ajv-errors')(ajv, { singleError: true });
require('ajv-keywords')(ajv);

ajv.addKeyword({
  keyword: 'vaildate-email',
  type: 'string',
  schemaType: 'boolean',
  $data: true,
  validate: (schema, data) => {
    // Java, JavaScript, and Ruby do not support conditionals regular expression
    if (data && /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.]+(com|in|org|co|net|edu|me|uk)+$/.test(data)) {
      const domain = data.split('@').reverse()[0];

      if (/^(gmail|yahoo|hotmail|outlook|ymail)[.]+(com|in|org|co|net|edu|me|uk)+$/.test(domain)) {
        if (domain === 'gmail.com' || domain === 'yahoo.com'
        || domain === 'yahoo.co.in' || domain === 'hotmail.com'
        || domain === 'ymail.com' || domain === ' yahoo.in'
        || domain === 'outlook.com') {
          return true;
        }

        return false;
      }

      return true;
    }

    return false;
  },
});

const isValidUuid = (uuid) => {
  /**
   * The Following RegExp Expression is used to ensure provided public-id is valid uuid
   * Please refers the following link for better understanding.
   * link:- https://www.npmjs.com/package/is-uuid
   * https://github.com/afram/is-uuid
   */
  const expression = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  return expression.test(uuid);
};

const isSchemaValid = ({ schema, data }) => {
  const validator = ajv.compile(schema);
  const isValid = validator(data);
  const errors = [];

  if (!isValid) {
    validator.errors.forEach((error) => {
      const {
        message,
        params: { errors: paramErrors },
      } = error;

      let errorDetails;

      let errorParams;

      if (paramErrors && paramErrors.length) {
        errorParams = { ...paramErrors[0] };
      } else {
        errorParams = error;
      }
      const {
        params: { missingProperty: name, additionalProperty }, dataPath, keyword, instancePath,
      } = errorParams;

      if (name) {
        errorDetails = {
          name,
          message,
        };
      } else {
        errorDetails = {
          name: Helper.sanitizeStr(/[#_.'"/\\]/g, (instancePath || dataPath || additionalProperty || keyword || 'type'), ''),
          message,
        };
      }

      errors.push(errorDetails);
    });

    return { errors };
  }

  return { data };
};

module.exports = {
  isValidUuid,
  isSchemaValid,
};
