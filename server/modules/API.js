const Artist = require('./../models/artist');
const Album = require('./../models/album');
const Track = require('./../models/track');
const Spotify = require('./Spotify');
const mongoose = require('mongoose');
const path = require('path');
const streamer = require('./streamer.js')

const API = {
  paging: 10,

  artists: async function(req, res) {
    const skip = (!isNaN(req.query.skip) ? parseInt(req.query.skip) : 0);
    const limit = (!isNaN(req.query.limit) ? parseInt(req.query.limit) : API.paging);

    const artists = await Artist.find(null, { __v: 0 }, { skip, limit }).sort({ name: 1 });
    const total = await Artist.countDocuments();

    res.json({ artists, total });
  },

  artist: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const artist = await Artist.findOne({ _id: req.params.id }, { __v: 0 });
    res.json(artist);
  },

  artistAlbums: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const skip = (!isNaN(req.query.skip) ? parseInt(req.query.skip) : 0);
    const limit = (!isNaN(req.query.limit) ? parseInt(req.query.limit) : API.paging);
    
    const albums = await Album.find({ artistId: req.params.id }, { __v: 0 }, { skip, limit }).sort({ year: -1, name: 1 });
    const total = await Album.countDocuments({ artistId: req.params.id });

    res.json({ albums, total });
  },

  artistTracks: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const skip = (!isNaN(req.query.skip) ? parseInt(req.query.skip) : 0);
    const limit = (!isNaN(req.query.limit) ? parseInt(req.query.limit) : API.paging);
    
    const tracks = await Track.find({ artistId: req.params.id }, { __v: 0, lyrics: 0 }, { skip, limit }).sort({ track: 1 });
    const total = await Track.countDocuments({ artistId: req.params.id });

    res.json({ tracks, total });
  },

  artistImage: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const artist = await Artist.findOne({ _id: req.params.id }, { __v: 0 });
    Spotify.artist(artist.name).then(url => {
      artist.image = url;
      artist.save();
      
      res.redirect(url);
    }).catch(() => {
      res.sendFile(path.join(__dirname, '../public/icon.svg'));
    });
  },

  albums: async function(req, res) {
    const skip = (!isNaN(req.query.skip) ? parseInt(req.query.skip) : 0);
    const limit = (!isNaN(req.query.limit) ? parseInt(req.query.limit) : API.paging);

    const albums = await Album.find(null, { __v: 0 }, { skip, limit }).sort({ year: -1, name: 1 });
    const total = await Album.countDocuments();

    res.json({ albums, total });
  },

  album: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const album = await Album.findOne({ _id: req.params.id }, { __v: 0 });
    const tracks = await Track.find({ albumId: req.params.id }, { __v: 0, lyrics: 0 });
    album.tracks = tracks;
    res.json(album);
  },

  albumTracks: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }
    const tracks = await Track.find({ albumId: req.params.id }, { __v: 0, lyrics: 0 }).sort({ track: 1 });
    const total = await Track.countDocuments({ albumId: req.params.id });

    res.json({ tracks, total });
  },

  albumImage: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const album = await Album.findOne({ _id: req.params.id }, { __v: 0 });
    Spotify.album(album.name, album.artist).then(url => {
      album.image = url;
      album.save();
      
      res.redirect(url);
    }).catch(() => {
      res.sendFile(path.join(__dirname, '../public/icon.svg'));
    });
  },

  tracks: async function(req, res) {
    const skip = (!isNaN(req.query.skip) ? parseInt(req.query.skip) : 0);
    const limit = (!isNaN(req.query.limit) ? parseInt(req.query.limit) : API.paging);

    const tracks = await Track.find(null, { __v: 0, lyrics: 0 }, { skip, limit }).sort({ artist: 1, album: 1, track: 1 });
    const total = await Track.countDocuments();

    res.json({ tracks, total });
  },

  track: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const track = await Track.findOne({ _id: req.params.id }, { __v: 0 });
    res.json(track);
  },

  stream: async function(req, res) {
    if(!mongoose.isValidObjectId(req.params.id)) {
      return res.json({ error: "Invalid ID" });
    }

    const track = await Track.findOne({ _id: req.params.id }, { __v: 0 });
    streamer(track.file, req, res);
  },

};

module.exports = API;