const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname.toLowerCase();

  const containsDocumentation = pathname.includes('documentation');

  response.writeHead(200, { 'Content-Type': 'text/plain' })

  if (containsDocumentation) {
    response.end('This URL contains the word "documentation".\n');
  } else {
    response.end(`Hello Node!.\n`);
  }

  const logData = `URL: ${request.url}\nTimestamp: ${new Date().toLocaleString()}\n\n`;
  fs.appendFile('log.txt', logData, (err) => {
    if (err) {
      console.error('Error writing to log.txt:', err);
    } else {
      console.log('Request logged successfully.');
    }
  });
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');