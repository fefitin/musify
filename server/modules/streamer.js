
/*
  This function is used to serve files using
  HTTP 206 Partial Content.
  Based on https://www.codeproject.com/Articles/813480/HTTP-Partial-Content-In-Node-js
*/
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

module.exports = async (file, req, res) => {
  if (!fs.existsSync(file)) {
    return res.status(404).send(`Not found ${req.path}`);
  }

  res.header('Content-Type', getMimeNameFromExt(path.extname(file)));
  res.header('Accept-Ranges', 'bytes');

  const stat = fs.statSync(file);
  const range = readRangeHeader(req.header('Range'), stat.size);
  let stream;

  if(range === null) {
    //Send full file
    res.header('Content-Length', stat.size);
    stream = fs.createReadStream(file);
  } else {
    //Send requested byte range
    const { start, end } = range;

    //Verify if requested range is valid
    if(start >= stat.size || end >= stat.size) {
      res.header('Content-Range', `bytes */${stat.size}`);
      return res.status(416).end();
    }

    res.header('Content-Range', `bytes ${start}-${end}/${stat.size}`);
    res.header('Content-Length', start == end ? 0 : (end - start + 1));
    res.header('Cache-Control', 'no-cache');
    res.status(206);
    
    stream = fs.createReadStream(file, { start, end });
  }

  stream.pipe(res);
}

function readRangeHeader(range, totalLength) {
  /*
   * Example of the method 'split' with regular expression.
   * 
   * Input: bytes=100-200
   * Output: [null, 100, 200, null]
   * 
   * Input: bytes=-200
   * Output: [null, null, 200, null]
   */

  if (range == null || range.length === 0)
    return null;

  const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
  const start = parseInt(array[1]);
  const end = parseInt(array[2]);
  const size = 1024 * 1000;

  const result = {
    start: isNaN(start) ? 0 : start,
    end: isNaN(end) ? null : end
  };

  //If range is open ended, send fixed size range
  if(!isNaN(start) && isNaN(end)) {
    result.start = parseInt(start);
    result.end = result.start + size;

    if(result.end > totalLength - 1)
      result.end = totalLength - 1;
  }

  return result;
}

function getMimeNameFromExt(ext) {
  const mimeNames = {
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.ogg': 'application/ogg', 
    '.ogv': 'video/ogg', 
    '.oga': 'audio/ogg',
    '.wav': 'audio/x-wav',
    '.webm': 'video/webm'
  };

  ext = ext.toLowerCase();

  if(typeof mimeNames[ext] === 'undefined')
    return 'application/octet-stream';

  return mimeNames[ext];
}
