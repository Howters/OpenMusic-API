const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  // id: Joi.string(),
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
});

module.exports = { AlbumPayloadSchema };
