const express = require('express');
const app = express();
const morgan = require('morgan');

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

//Morgan middleware logs request
app.use(morgan('dev'));

//serve static files from the "public" directory
app.use(express.static('public'));

//GET request
app.get('/', (req, res) => {
  res.send('Welcome to my TopFlicks');
});

app.get('/movies', (req, res) => {
  res.json(top10Movies);
});

//error-handling middleware
app.use((err, req, res, next) =>{
  console.error('APPLICATION ERROR:', err.stack);
  res.status(500).send("Something went wrong.");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});