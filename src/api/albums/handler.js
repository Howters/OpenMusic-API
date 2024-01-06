/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(service, validator, storageService) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.addCoverHandler = this.addCoverHandler.bind(this);
    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbaharui',
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async addCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateCover(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._service.addCover(id, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.getAlbumById(albumId);
    await this._service.addLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Operasi berhasil dilakukan',
    });
    response.code(201);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.getAlbumById(albumId);
    await this._service.deleteLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Operasi berhasil dilakukan',
    });
    response.code(200);
    return response;
  }

  async getLikesHandler(request, h) {
    const { id } = request.params;
    const { cache, likes } = await this._service.getLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    if (cache) response.header('X-Data-Source', 'cache');

    return response;
  }
}

module.exports = AlbumsHandler;
