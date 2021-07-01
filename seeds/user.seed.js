require('../db')
let userModel = require('../models/User.model')
const mongoose = require('mongoose')

userModel.create([
  {username: "thisIsAtest", password: "Ar!ar!1123", email: "rita@rita.com"}
])
  .then(() => {
    console.log('Posts seeded')
    mongoose.connection.close()
  })
  .catch((err) => {
    console.log('ERROR: ', err)
    mongoose.connection.close()
  })