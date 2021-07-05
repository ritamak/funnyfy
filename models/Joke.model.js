const { Schema, model } = require("mongoose");

const jokeSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  setup: {
    type: String,
    require: true,
  },
  punchline: {
    type: String,
    require: true,
  },
});

const Joke = model("Joke", jokeSchema);
module.exports = Joke;