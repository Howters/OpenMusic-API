const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicsService {
  constructor() {
    this._musics = [];
  }

  addMusic({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newMusic = {
      title,
      tags,
      body,
      id,
      createdAt,
      updatedAt,
    };

    this._musics.push(newMusic);

    const isSuccess = this._musics.filter((music) => music.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return id;
  }

  getMusics() {
    return this._musics;
  }

  getMusicById(id) {
    const music = this._musics.filter((n) => n.id === id)[0];

    if (!music) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return music;
  }

  editMusicById(id, { title, body, tags }) {
    const index = this._musics.findIndex((music) => music.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this._musics[index] = {
      ...this._musics[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  deleteMusicById(id) {
    const index = this._musics.findIndex((music) => music.id === id);
    if (index === -1) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
    this._musics.splice(index, 1);
  }
}

module.exports = MusicsService;
