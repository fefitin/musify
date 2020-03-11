const express = require('express');
const path = require('path');
const streamer = require('./modules/streamer.js')
const mongoose = require('mongoose');
const API = require('./modules/API.js')

mongoose.connect(process.env.MUSIFY_MONGODB_SERVER, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 8080;

app.get('/files/*', streamer);

app.get('/api/artists', API.artists);
app.get('/api/artists/:id', API.artist);
app.get('/api/artists/:id/albums', API.artistAlbums);
app.get('/api/artists/:id/tracks', API.artistTracks);
app.get('/api/albums', API.albums);
app.get('/api/albums/:id', API.album);
app.get('/api/albums/:id/tracks', API.albumTracks);
app.get('/api/tracks', API.tracks);
app.get('/api/tracks/:id', API.track);

app.listen(port, () => {
  console.log('Server started!');
});