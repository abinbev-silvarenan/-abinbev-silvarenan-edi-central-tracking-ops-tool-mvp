// Simple static file server for local prototype previews
// Usage: node .serve.cjs
// Then open: http://127.0.0.1:8765/

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.ttf':  'font/ttf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

const server = http.createServer(function(req, res) {
  var parsed   = url.parse(req.url);
  var pathname = decodeURIComponent(parsed.pathname);

  // Default to index.html for directory requests
  if (pathname.endsWith('/')) pathname += 'index.html';

  var filePath = path.join(ROOT, pathname);

  // Security: stay inside ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  // If it's a directory, redirect to add trailing slash
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    res.writeHead(301, { Location: pathname + '/' }); res.end(); return;
  }

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }
    var ext  = path.extname(filePath).toLowerCase();
    var mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type':  mime,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', function() {
  console.log('Prototype server running at http://127.0.0.1:' + PORT + '/');
  console.log('');
  console.log('  Notification Center:  http://127.0.0.1:' + PORT + '/notification-center-v1/');
  console.log('  EDI Ops Tool:         http://127.0.0.1:' + PORT + '/');
  console.log('  Dashboard:            http://127.0.0.1:' + PORT + '/shared/dashboard.html?id=notification-center-v1');
  console.log('');
  console.log('Press Ctrl+C to stop.');
});
