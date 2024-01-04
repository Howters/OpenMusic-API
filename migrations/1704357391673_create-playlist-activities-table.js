exports.up = (pgm) => {
  pgm.createTable('playlist_activities', {
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
      notNull: true,
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_activities');
};
