const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/movie');

const app = express();

// set the port for the server
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to the database!');
});

// add a new movie to the database
const newMovie = new Movie({
  name: 'The Shawshank Redemption',
  description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  year: 1994,
  genres: ['Drama'],
  rating: 9.3,
});

newMovie.save(function (err, movie) {
  if (err) return console.error(err);
  console.log(`${movie.name} added to the database!`);
});

// use the Movie model to create, read, update, and delete movie records
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
