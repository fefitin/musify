const mongoose = require('mongoose');
module.exports = mongoose.model('Track', { 
  artistId: mongoose.ObjectId,
  albumId: mongoose.ObjectId,
  title: String,
  artist: String,
  album: String,
  year: Number,
  lyrics: String
});