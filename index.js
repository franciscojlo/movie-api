const express = require('express');
const app = express();

const top10Movies = [
  {
    title: 'Star Wars: Episode III',
    year: 2005,
  },
  {
    title: 'Se7en',
    year: 1995,
  },
  {
    title: 'Kill Bill',
    year: 2003,
  },
  {
    title: 'The Big Short',
    year: 2015,
  },
  {
    title: 'Once Upon a Time... in Hollywood',
    year: 2019,
  },
  {
    title: 'Click',
    year: 2006,
  },
  {
    title: 'Gattaca',
    year: 1997,
  },
  {
    title: 'Get Out',
    year: 2017,
  },
  {
    title: 'One Flew Over the Cuckoos Nest',
    year: 1975,
  },
  {
    title: 'Semi-Pro',
    year: 2008,
  },
];

// GET request
app.get('/', (req, res) => {
  res.send('Welcome to my TopFlicks');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: movie-api });
});

app.get('/top10Movies', (req, res) => {
  res.json(top10Movies);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
