/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: `SELECT pl.id, pl.name, usr.username
        FROM playlists pl
        INNER JOIN users usr ON pl.owner = usr.id
        WHERE pl.owner = $1
        UNION
        SELECT pl.id, pl.name, usr.username
        FROM collaborations coll
        INNER JOIN playlists pl ON coll.playlistid = pl.id
        INNER JOIN users usr ON pl.owner = usr.id
        WHERE coll.userid = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return {
      playlists: result.rows,
    };
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist tidak ditemukan');
    }
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `record-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Musik gagal ditambahkan');
    }
  }

  async getPlaylistSongsById(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const queryGetPlaylist = {
      text: 'SELECT pl.id, pl.name, usr.username FROM playlists pl JOIN users usr ON pl.owner = usr.id WHERE pl.id = $1',
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(queryGetPlaylist);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const queryGetSongs = {
      text: `SELECT s.id, s.title, s.performer
        FROM songs s
        JOIN playlists_songs pl
        ON pl.songid = s.id
        WHERE pl.playlistid = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(queryGetSongs);

    const playlist = playlistResult.rows[0];
    const result = {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songsResult.rows,
    };

    return result;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlists_songs 
        WHERE playlistid = $1 AND songid = $2
        RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Musik gagal dihapus!');
    }
  }

  async getPlaylistActivitiesById(playlistId) {
    await this.getPlaylistById(playlistId);

    const query = {
      text: `SELECT usr.username, s.title, a.action, a.time
        FROM playlist_activities a
        INNER JOIN songs s
        ON a.songid = s.id
        INNER JOIN users usr
        ON a.userid = usr.id
        WHERE playlistid = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: `INSERT INTO playlist_activities
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Activity gagal ditambahkan');
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
