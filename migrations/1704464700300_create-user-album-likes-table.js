exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'cascade',
    },
    albumid: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"albums"(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
