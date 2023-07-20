const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname.toLowerCase();

  const containsDocumentation = pathname.includes('documentation');

  const logData = `URL: ${request.url}\nTimestamp: ${new Date().toLocaleString()}\n\n`;

  fs.appendFile('log.txt', logData, (err) => {
    if (err) {
      console.error('Error writing to log.txt:', err);
    } else {
      console.log('Request logged successfully.');
    }
  });

  if (containsDocumentation) {
    fs.readFile('documentation.html', (err, data) => {
      if (err) {
        console.error('Error reading documentation.html:', err);
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
      }
    });
  } else {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        console.error('Error reading index.html:', err);
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
      }
    });
  }
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');