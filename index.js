const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

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

const users = [];

//middleware logs request
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());


//Welcome message
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

//route to allow new users to register
app.post('/users', (req, res) => {
  const { name, password, email, birth_date } = req.body;
  if (!name || !password || !email) {
    return res.status(400).send('Name, password, and email are required fields');
  }
  const newUser = {
    id: uuid.v4(),
    name: name,
    password: password,
    email: email,
    birth_date: birth_date,
    favoriteMovies: [],
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

//route to allow users to update their username
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name } = req.body;
  
  console.log('User ID from URL:', userId);
  
  const user = users.find((user) => user.id === userId);
  console.log('Found User:', user);
  
  if (!user) {
    return res.status(404).send('User not found');
  }
  
  user.name = name;
  console.log('Updated User:', user);
  
  res.json(user);
});

//route to allow users to add a movie to their favorites
app.post('/users/:id/favorites', (req, res) => {
  const userId = req.params.id;
  const { movieId } = req.body;
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  user.favoriteMovies.push(movieId);
  res.send('Movie added to user favorites successfully');
});

//route to allow users to remove a movie from their list of favorites
app.delete('/users/:id/favorites/:movieId', (req, res) => {
  const userId = req.params.id;
  const movieId = req.params.movieId;
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  const index = user.favoriteMovies.indexOf(movieId);
  if (index !== -1) {
    user.favoriteMovies.splice(index, 1);
  }
  res.send('Movie removed from user favorites successfully');
});

//route to allow existing users to deregister
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    res.send(`User with ID ${userId} unregistered successfully`);
  } else {
    res.status(404).send('User not found');
  }
});

//error-handling middleware
app.use((err, req, res, next) => {
  console.error('APPLICATION ERROR:', err.stack);
  res.status(500).send("Something went wrong.");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});