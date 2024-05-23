const { UserPayloadShema } = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadShema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
