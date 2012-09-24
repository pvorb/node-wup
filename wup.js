#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var filed = require('filed');

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

  var reqPath = url.parse(req.url).pathname.replace(/\/$/, '/index.html');
  var file = path.resolve(root, '.'+reqPath);
  var ext = path.extname(file);

  fs.stat(file, function (err, stats) {
    if (err) {
      console.error(err.message);
      resp.writeHead(404);
      return resp.end();
    }

    if (!stats.isFile()) {
      console.info('file "'+file+'" doesn\'t exist');
      resp.writeHead(404);
      return resp.end();
    }

    console.log('GET '+req.url);

    resp.statusCode = 200;
    if (contentTypes[ext])
      resp.setHeader('Content-Type', contentTypes[ext]);
    else
      resp.setHeader('Content-Type', 'application/octet-stream');

    // pipe file over http
    filed(file).pipe(resp);
  });
});

server.listen(8080, '127.0.0.1');

console.log('Server running at http://localhost:8080/');
