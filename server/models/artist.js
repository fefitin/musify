const mongoose = require('mongoose');
module.exports = mongoose.model('Artist', { 
  name: String
});