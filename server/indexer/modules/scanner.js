const path = require('path');
const fs = require('fs');
const jsmediatags = require("jsmediatags");
const Artist = require("./../../models/artist");
const Album = require("./../../models/album");
const Track = require("./../../models/track");

const Scanner = {

  supported: ['.mp3', '.mp4'],
  queue: [],

  start: function(dir) {
    return Scanner.scan(dir);
  },

  scan: async function(dir) {
    console.log(`Scanning ${dir}`);

    const files = fs.readdirSync(dir);
    if(!files) {
      return console.error(`Cannot access ${dir}`);
    }

    const promises = [];

    for(let i = 0; i < files.length; i++) {
      const file = path.join(dir, files[i]);

      const stats = fs.statSync(file);
      const ext = path.extname(file);        

      if(stats.isDirectory()) {
        promises.push(await Scanner.scan(file));
      } else if(Scanner.supported.indexOf(ext) !== -1) {
        promises.push(await Scanner.index(file));
      }
    };

    return Promise.all(promises);
  },

  index: function(file) {
    //Get file data from ID3 tags
    return new Promise((resolve, reject) => {
      new jsmediatags.Reader(file)
        .setTagsToRead(['title', 'artist', 'album', 'year', 'lyrics'])
        .read({
          onSuccess: (tag) => {
            if(tag.tags.artist && tag.tags.album && tag.tags.title) {
              Scanner.store(file, tag.tags).then(track => {
                console.log(`Indexed track ${track._id} titled ${track.title} (${track.album} - ${track.artist})`);
              }).finally(() => {
                resolve();
              });
            } else {
              resolve();
            }
          },
          onError: (error) => {
            console.error(`Cannot read ${file}: ${error.info}`);
            reject();
          }
        });
    });
  },

  store: function(file, tags) {
    /*
      Use stored artist and album or create new
      before saving track
    */
    return Artist.findOneAndUpdate({ name: tags.artist }, { $set: { name: tags.artist }}, { upsert: true, new: true }).then(artist => {
      const album = {
        artistId: artist._id,
        name: tags.album,
        artist: artist.name,
        year: tags.year
      };

      return Album.findOneAndUpdate(album, { $set: album }, { upsert: true, new: true });
    }).then(album => {
      const track = { 
        artistId: album.artistId,
        albumId: album._id,
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        year: tags.year,
        lyrics: (tags.lyrics ? tags.lyrics.lyrics : null),
        file: file
      };

      return Track.findOneAndUpdate(track, { $set: track }, { upsert: true, new: true });
    });

  }

}

module.exports = Scanner;