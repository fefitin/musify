const express = require('express');
const path = require('path');
const streamer = require('./modules/streamer.js')

const app = express();
const port = 8080;

app.get('/files/*', streamer);

app.listen(port, () => {
  console.log('Server started!');
});
