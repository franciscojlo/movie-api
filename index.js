const express = require('express');
const app = express();
const morgan = require('morgan');

const top10Movies = [
  {
    title: 'Star Wars: Episode III',
    year: 2005,
    genre: 'sci-fi',
    director: 'George Lucas'
  },
  {
    title: 'Se7en',
    year: 1995,
    genre: 'thriller',
    director: 'David Fincher',
  },
  {
    title: 'Kill Bill',
    year: 2003,
    genre: 'action',
    director: 'Quentin Tarantino'
  },
  {
    title: 'The Big Short',
    year: 2015,
    genre: 'drama',
    director: 'Adam McKay',
  },
  {
    title: 'Once Upon a Time... in Hollywood',
    year: 2019,
    genre: 'drama',
    director: 'Quentin Tarantino',
  },
  {
    title: 'Click',
    year: 2006,
    genre: 'comedy',
    director: 'Frank Coraci',
  },
  {
    title: 'Gattaca',
    year: 1997,
    genre: 'sci-fi',
    director: 'Andrew Nicol',
  },
  {
    title: 'Get Out',
    year: 2017,
    genre: 'thriller',
    director: 'Jordan Peele,'
  },
  {
    title: 'One Flew Over the Cuckoos Nest',
    year: 1975,
    genre: 'drama',
    director: 'Ken Kesey',
  },
  {
    title: 'Semi-Pro',
    year: 2008,
    genre: 'comedy',
    director: 'Kent Alterman',
  },
];

//morgan middleware logs request
app.use(morgan('dev'));

//serve static files from the "public" directory
app.use(express.static('public'));

//GET request
app.get('/', (req, res) => {
  res.send('Welcome to my TopFlicks');
});

//route to get all movies
app.get('/movies', (req, res) => {
  res.send('Successful GET request returning data on all the movies');
});

//route to get a single movie by title
app.get('/movies/:title', (req, res) => {
  const movieTitle = req.params.title;
  res.send(`Successful GET request returning data on the movie with title: ${movieTitle}`);
});

//route to get genre data by name
app.get('/genres/:name', (req, res) => {
  const genreName = req.params.name;
  res.send(`Successful GET request returning data on the genre with name: ${genreName}`);
});

//route to get director data by name
app.get('/directors/:name', (req, res) => {
  const directorName = req.params.name;
  res.send(`Successful GET request returning data on the director with name: ${directorName}`);
});
``
//error-handling middleware
app.use((err, req, res, next) =>{
  console.error('APPLICATION ERROR:', err.stack);
  res.status(500).send("Something went wrong.");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});