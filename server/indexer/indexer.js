/*
  This program indexes a directory looking for mp3/mp4 files
  and stores them in a Media Library in Mongo
*/
const mongoose = require('mongoose');
const Scanner = require('./modules/scanner');
mongoose.connect(process.env.MUSIFY_MONGODB_SERVER, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

if(process.argv.length !== 3) {
  console.error('Directory missing.');
  process.exit();
}

const dir = process.argv[2];
Scanner.start(dir).then(() => {
  mongoose.disconnect();
});