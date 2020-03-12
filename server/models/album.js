const mongoose = require('mongoose');
module.exports = mongoose.model('Album', { 
  artistId: mongoose.ObjectId,
  name: String,
  artist: String,
  year: Number,
  image: String
});