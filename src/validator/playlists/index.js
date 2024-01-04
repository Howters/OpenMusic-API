const InvariantError = require('../../exceptions/InvariantError');
const {
  PlaylistsPayloadScheme,
  SongsPlaylistPayloadScheme,
} = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongPlaylistPayload: (payload) => {
    const validationResult = SongsPlaylistPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
