import API from './API';

const AlbumModel = {
  preprocess(album) {
    if(!album.image)
      album.image = `${API.url()}albums/${album._id}/image`;
    album.url = `/albums/${album._id}`;
    return album;
  },

  list(skip = null, limit = null) {
    return API.get('albums', { skip, limit }).then(res => {
      res.albums = res.albums.map(AlbumModel.preprocess);
      return res;
    });
  }
};

export default AlbumModel;