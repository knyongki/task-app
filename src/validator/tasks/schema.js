const Joi = require('joi');

const TaskPayloadSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});

module.exports = { TaskPayloadSchema };
