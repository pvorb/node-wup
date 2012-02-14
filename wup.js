#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var path = require('path');

var root = process.cwd();

var contentTypes = {
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.xml': 'text/xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

var server = http.createServer(function (req, resp) {
  if (req.method != 'GET') {
    console.error('non GET requests not supported');
    resp.writeHead(500);
    return resp.end();
  }

  req.url = req.url.replace(/\/$/, '/index.html');
  var file = path.resolve(root, '.'+req.url);
  var ext = path.extname(file);

  fs.readFile(file, function (err, buf) {
    if (err) {
      console.error(err);
      resp.writeHead(404);
      return resp.end();
    }

    console.log('GET '+req.url);

    resp.statusCode = 200;
    if (contentTypes[ext])
      resp.setHeader('Content-Type', contentTypes[ext]);
    else
      resp.setHeader('Content-Type', 'text/plain');

    resp.end(buf);
  });
});

server.listen(8080, '127.0.0.1');

console.log('Server running at http://localhost:8080/');
