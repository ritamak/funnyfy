const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
});

const User = model("User", userSchema);

module.exports = User;