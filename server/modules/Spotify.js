const axios = require('axios');
const btoa = require('btoa');
const querystring = require('querystring');

const Spotify = {
  accessToken: null,
  expires: 0,
  clientId: process.env.MUSIFY_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.MUSIFY_SPOTIFY_CLIENT_SERVER,

  url: 'https://api.spotify.com/v1/',

  getAccessToken: function() {
    return new Promise((resolve, reject) => {
      if(Spotify.accessToken && new Date().getTime() > Spotify.expires) {
        resolve(Spotify.accessToken);
      } else {
        const data = querystring.stringify({ grant_type: 'client_credentials' });

        axios.post('https://accounts.spotify.com/api/token', data, {
          headers: {
            'Authorization': `Basic ${btoa(Spotify.clientId+':'+Spotify.clientSecret)}`,
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(data => {
          Spotify.accessToken = data.data.access_token;
          Spotify.expires = new Date().getTime() + data.data.expires*1000;
          resolve(Spotify.accessToken);
        }).catch(reject);
      }
    });
  },

  get: function(endpoint, params) {
    return new Promise((resolve, reject) => {
      
      Spotify.getAccessToken().then(token => {
        return axios.get(Spotify.url + endpoint, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: params
        })
      }).then(data => {
        resolve(data.data);
      }).catch(reject);

    });
  },

  artist: function(name) {
    return new Promise((resolve, reject) => {
      Spotify.get('search', {
        q: name,
        type: 'artist'
      }).then(data => {
        if(data.artists.items.length && data.artists.items[0].images.length) {
          resolve(data.artists.items[0].images[0].url);
        } else {
          reject();
        }
      }).catch(reject);
    });
  }
}

module.exports = Spotify;