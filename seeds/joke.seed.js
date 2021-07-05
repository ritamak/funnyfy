require('../db');
let jokeModel = require('../models/Joke.model');
const mongoose = require('mongoose');

jokeModel.create([
    {id: 379, type: "test", setup: "hi", punchline:"hey"}
])
  .then(() => {
    console.log('Posts seeded')
    mongoose.connection.close()
  })
  .catch((err) => {
    console.log('ERROR: ', err)
    mongoose.connection.close()
  })
