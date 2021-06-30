require('../db')
let userModel = require('../models/User.model')
const mongoose = require('mongoose')

userModel.create([
  {username: "thisIsAtest", password: "Ar!ar!1123", firstName: "Ana", lastName: "Mak"}
])
  .then(() => {
    console.log('Posts seeded')
    mongoose.connection.close()
  })
  .catch((err) => {
    console.log('ERROR: ', err)
    mongoose.connection.close()
  })