import API from './API';
import TrackModel from './TrackModel';

const AlbumModel = {
  preprocess(album) {
    if(!album.image)
      album.image = `${API.url()}albums/${album._id}/image`;
      
    album.url = `/albums/${album._id}`;
    album.artist = {
      name: album.artist,
      url: `/artists/${album.artistId}`
    };
    album.tracks = album.tracks.map(TrackModel.preprocess);
    return album;
  },

  list(skip = null, limit = null) {
    return API.get('albums', { skip, limit }).then(res => {
      res.albums = res.albums.map(AlbumModel.preprocess);
      return res;
    });
  },

  listForArtist(artistId, skip = null, limit = null) {
    return API.get(`artists/${artistId}/albums`, { skip, limit }).then(res => {
      res.albums = res.albums.map(AlbumModel.preprocess);
      return res;
    });
  },

  get(id) {
    return API.get(`albums/${id}`).then(res => {
      return AlbumModel.preprocess(res);
    });
  }
};

export default AlbumModel;