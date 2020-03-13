const path = require('path');
const fs = require('fs');
const jsmediatags = require("jsmediatags");
const { getAudioDurationInSeconds } = require('get-audio-duration')
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
        .setTagsToRead(['title', 'artist', 'album', 'year', 'lyrics', 'track'])
        .read({
          onSuccess: (tag) => {
            if(tag.tags.artist && tag.tags.album && tag.tags.title) {
              getAudioDurationInSeconds(file).then(length => {
                tag.tags.length = length;

                Scanner.store(file, tag.tags).then(track => {
                  console.log(`Indexed track ${track._id} titled ${track.title} (${track.album} - ${track.artist})`);
                }).finally(() => {
                  resolve();
                });

              }).catch(reject);
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
      before saving track.

      tags.track can be a single number or
      the track number plus the total number of tracks
      in the album (eg: 1/12)
    */
    let trackNo = null;

    if(typeof tags.track === 'string') {
      let trackData = tags.track.split('/');
      trackNo = trackData[0];
    } else {
      trackNo = tags.track;
    }

    /* tags.year can be a date */
    if(isNaN(tags.year)) {
      let year = new Date(tags.year);
      if(!isNaN(year.getFullYear())) {
        tags.year = year.getFullYear();
      } else {
        tags.year = null;
      }
    }

    return Artist.findOneAndUpdate({ name: tags.artist }, { $set: { name: tags.artist }}, { upsert: true, new: true }).then(artist => {
      const album = {
        artistId: artist._id,
        name: tags.album
      };

      const newAlbum = {
        ...album,
        artist: artist.name,
        year: tags.year
      };

      return Album.findOneAndUpdate(album, { $set: newAlbum }, { upsert: true, new: true });
    }).then(album => {
      const track = { 
        artistId: album.artistId,
        albumId: album._id,
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        year: tags.year,
        lyrics: (tags.lyrics ? tags.lyrics.lyrics : null),
        track: trackNo,
        length: tags.length,
        file: file
      };

      return Track.findOneAndUpdate(track, { $set: track }, { upsert: true, new: true });
    });

  }

}

module.exports = Scanner;