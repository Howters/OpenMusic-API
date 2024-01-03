exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    albumid: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
