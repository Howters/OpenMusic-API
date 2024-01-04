exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      references: '"playlists"(id)',
      onDelete: 'cascade',
    },
    userid: {
      type: 'VARCHAR(50)',
      references: '"users"(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
