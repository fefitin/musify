import API from './API';

const TrackModel = {
  preprocess(track) {
    track.url = `${API.url()}tracks/${track._id}/stream`;
    return track;
  },

  list(skip = null, limit = null) {
    return API.get('tracks', { skip, limit }).then(res => {
      res.tracks = res.tracks.map(TrackModel.preprocess);
      return res;
    });
  },

  listForAlbum(albumId, skip = null, limit = null) {
    return API.get(`albums/${albumId}/tracks`, { skip, limit }).then(res => {
      res.tracks = res.tracks.map(TrackModel.preprocess);
      return res;
    });
  }
};

export default TrackModel;