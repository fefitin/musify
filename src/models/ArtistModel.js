import API from './API';

const ArtistModel = {
  preprocess(artist) {
    if(!artist.image)
      artist.image = `${API.url()}artists/${artist._id}/image`;
    artist.url = `/artists/${artist._id}`;
    return artist;
  },

  list(skip = null, limit = null) {
    return API.get('artists', { skip, limit }).then(res => {
      res.artists = res.artists.map(ArtistModel.preprocess);
      return res;
    });
  }
};

export default ArtistModel;