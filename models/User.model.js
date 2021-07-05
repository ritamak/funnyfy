const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    require: true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
  },
  favJokes: [{type: Schema.Types.ObjectId, ref: 'Joke'}],

});

const User = model("User", userSchema);

module.exports = User;