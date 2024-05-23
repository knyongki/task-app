const InvariantError = require('../../exceptions/InvariantError');
const { TaskPayloadSchema } = require('./schema');

const TasksValidator = {
  validateTaskPayload: (payload) => {
    const validationResult = TaskPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = TasksValidator;
