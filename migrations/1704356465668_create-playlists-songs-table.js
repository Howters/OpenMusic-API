exports.up = (pgm) => {
  pgm.createTable('playlists_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      references: '"playlists"(id)',
      onDelete: 'cascade',
    },
    songid: {
      type: 'VARCHAR(50)',
      references: '"songs"(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_songs');
};
