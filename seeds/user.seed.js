require('../db')
let userModel = require('../models/User.model')
const mongoose = require('mongoose')

userModel.create([
  {email:'donaire@gmail.com', password: "123abcdf$$"}
])
  .then(() => {
    console.log('Posts seeded')
    mongoose.connection.close()
  })
  .catch((err) => {
    console.log('ERROR: ', err)
    mongoose.connection.close()
  })