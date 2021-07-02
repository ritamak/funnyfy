const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');
const JokeModel = require('../models/Joke.model')
// GET for the about
router.get("/aboutus", (req, res, next) => {
  res.render('auth/about.hbs')
  })
// GET for the singUp
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
  })
// POST for the signUp  
router.post('/signup', (req, res, next) => {
    const {username, email, password} = req.body
    if (!username || !email || !password) {
        res.render('auth/signup.hbs', {error: 'Whithout entering all fields you cannot get all jokes'})
        return;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( !re.test(email)) {
      res.render('auth/signup.hbs', {error: 'Your email format is a joke right?'})
      return;
    }
    let passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    if (!passRegEx.test(password)) {
      res.render('auth/signup.hbs', {error: 'Password needs to have a special character a number and be 6-16 characters'})
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    UserModel.create({username, email, password: hash})
      .then(() => {
          res.redirect('/profile')
      })
      .catch((err) => {
          next(err)
      })
})
// GET for the SignIn
router.get("/signin", (req, res, next) => {
  res.render('auth/signin.hbs');
});
// POST for the SignIn
router.post('/signin', (req, res, next) => {
  const {email, password} = req.body  
  UserModel.findOne({email})
    .then((user) => {
      if (user) {
        let isValid = bcrypt.compareSync( password, user.password);
        if (isValid) {
          req.session.loggedInUser = user
          req.app.locals.isLoggedIn = true;
          res.redirect('/profile')
        } else {
          res.render('auth/signin', {error: 'Invalid password'})
        }
      } else {
        res.render('auth/signin', {error: 'Email does not exists'})
      }
    })
      .catch((err) => {
        next(err)
      })
})
// check if the user is logged in
function checkLoggedIn(req, res, next) {
    if ( req.session.loggedInUser) {
      next()
    } else {
      res.redirect('/signin')
    }
}
// GET for the profile
router.get('/profile', (req, res, next) => {
  res.render('auth/profile.hbs')
})
//get for the main
router.get("/main", (req, res, next) => {
  JokeModel.find()
  .then((jokes) => {
    res.render('auth/main.hbs', {jokes})
  })
  })

module.exports = router;
