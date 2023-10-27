require('dotenv').config();
const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const app = express();
const { check, validationResult } = require('express-validator');


const Movies = Models.Movie;
const Users = Models.User;

// local host connection
//mongoose.connect("mongodb://0.0.0.0:27017/cfDB", {
  //  useNewUrlParser: true,
  //  useUnifiedTopology: true,
// });


//any IP address host
mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require("./auth")(app);
const passport = require('passport');
require("./passport");


//Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to my TopFlicks');
});

//route to get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find();

    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: 'No movies found' });
    }

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'An error occurred while fetching movies.' });
  }
});

//route to get a single movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const movieTitle = req.params.title;
  try {
    const movie = await Movies.findOne({ Title: movieTitle });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie by title:', error);
    res.status(500).send('An error occurred while fetching the movie.');
  }
});

//route to get genre data by name
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const genreName = req.params.name;
  try {
    const genre = await Movies.findOne({ 'Genre.Name': genreName });

    if (!genre) {
      console.log('Genre not found');
      return res.status(404).send('Genre not found');
    }

    console.log('Genre Data:', genre);

    res.json({
      Name: genre.Genre.Name,
      Description: genre.Genre.Description,
    });
  } catch (error) {
    console.error('Error fetching genre by name:', error);
    res.status(500).send('An error occurred while fetching the genre.');
  }
});

//route to get director data by name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const directorName = req.params.name;
  try {
    const director = await Movies.findOne({ 'Director.Name': directorName }, 'Director.Name Director.Bio Director.Birth');
    if (!director) {
      return res.status(404).send('Director not found');
    }
    res.json(director.Director);
  } catch (error) {
    console.error('Error fetching director by name:', error);
    res.status(500).send('An error occurred while fetching the director.');
  }
});

//route to allow new users to register
app.post('/users', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {

  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
      //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//route to allow users to update their username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  //CONDITION TO CHECK ADDED HERE
  if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
  }
  //CONDITION ENDS
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
      }
  },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error: ' + err);
      })
});

//route to allow users to add a movie to their favorites
app.post('/users/:userId/favorites', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.params.userId;
  const { movieId } = req.body;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.FavoriteMovies.push(movieId);
    await user.save();
    res.send('Movie added to user favorites successfully');
  } catch (error) {
    console.error('Error adding a movie to user favorites:', error);
    res.status(500).send('An error occurred while adding the movie to user favorites.');
  }
});

//route to allow users to remove a movie from their list of favorites
app.delete('/users/:userId/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const index = user.FavoriteMovies.indexOf(movieId);
    if (index !== -1) {
      user.FavoriteMovies.splice(index, 1);
      await user.save();
      res.send('Movie removed from user favorites successfully');
    } else {
      res.status(404).send('Movie not found in user favorites');
    }
  } catch (error) {
    console.error('Error removing a movie from user favorites:', error);
    res.status(500).send('An error occurred while removing the movie from user favorites.');
  }
});

// Route to allow existing users to deregister
app.delete('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findByIdAndRemove(userId);
    if (!user) {
      return res.status(404).send(`User with ID ${userId} not found`);
    }
    res.send(`User with ID ${userId} unregistered successfully`);
  } catch (error) {
    console.error('Error deregistering user:', error);
    res.status(500).send('An error occurred while deregistering the user.');
  }
});

//error-handling middleware
app.use((err, req, res, next) => {
  console.error('APPLICATION ERROR:', err.stack);
  res.status(500).send('Something went wrong.');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});