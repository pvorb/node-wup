#!/usr/bin/env node

var st = require('st')
var http = require('http')

var port = 8080;
if (process.argv.length > 2) {
    port = parseInt(process.argv[2]);
}

http.createServer(st({
  index: 'index.html',
  path: process.cwd(),
  cache: false
})).listen(port);

console.log('Server running at http://localhost:' + port + '/.');
