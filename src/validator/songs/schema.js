const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().allow(null).optional(),
  albumId: Joi.string().allow(null).optional(),
});

module.exports = { SongPayloadSchema };
