const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');
const JokeModel = require('../models/Joke.model')

// GET for the about
router.get("/about", (req, res, next) => {
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
            res.redirect('/signin')
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
const {email, password} = req.body;
    UserModel.findOne({email})
    .then((user) => {
        if(user){
          
            let isValid = bcrypt.compareSync(password, user.password);
            if(isValid){
                  req.session.loggedInUser = user;
                  req.app.locals.isLoggedIn = true;
                  res.redirect('/profile')
                
            }if(isValid == true){
                res.redirect(`/profile/${user._id}`)
            }

            else {
                res.render('auth/signin', {error: 'Invalid Password'})
            }
        }
        
    })

  
  
    

    })

    function checkLoggedIn(req, res, next){
      if ( req.session.loggedInUser) {
          next()
      }
      else{
        res.redirect('/signin')
      }
    }
    
    router.get('/profile', checkLoggedIn, (req, res, next) => {
          res.render('auth/profile.hbs', {name:  req.session.loggedInUser.username})
    })
    router.get('/main', checkLoggedIn, (req, res, next) => {
      res.render('auth/main.hbs', {name:  req.session.loggedInUser.username})
  })
    
    router.get('/logout', (req, res, next) => {
        req.session.destroy()
          req.app.locals.isLoggedIn = false;
        res.redirect('/')
    })
  

    


// GET to profile

router.get('/profile/:id', (req, res, next) => {
  const userId = req.params.id
  UserModel.find()
  .populate("favJokes")
  .then((users) => {
    let myUser = users.find(user => user._id == userId)
    console.log(myUser)
    res.render('auth/profile.hbs', {myUser, users})
  })
})

/*
router.get("/profile", (req, res, next) => {
  UserModel.findById(req.user._id)
  populate("favJokes")
  .then((user) => {
    res.render('auth/profile.hbs', {myUser, users, jokes: favJokes})
  })
})
.then(result => {
  res.status(200).render('profile/profile', {user: result, layout: layout, fav: anyFavorites})
})
.catch(error => {
  res.status(400).render('error', {error: error})
})
*/
// GET main
router.get("/main", (req, res, next) => {
  JokeModel.find()
  .then((jokes) => {
    let general = jokes.filter(joke => joke.type.includes("general"))
    let programming = jokes.filter(joke => joke.type.includes("programming"))
    let knock = jokes.filter(joke => joke.type.includes("knock-knock"))
    res.render('auth/main.hbs', {general, programming, knock, jokes})
  })
  .catch((err) => {
    console.log(err)
  })
  })
 
// POST add joke
router.post("/add-joke", (req, res, next) => {
  console.log(req.body)
  console.log(req.body.id)
  console.log(req.body.mongoDBid)

  if (req.user) {
    JokeModel.findOne({mongoDBid: req.body.mongoDBid})
    .then((joke) => {
      if (!joke) {
        JokeModel.create(req.body)
        .then((newJoke) => {
          UserModel.findByIdAndUpdate(req.user._id, {$push: {favJokes: newJoke._id}})
          .then(() => {
            console.log("joke created")
          })
        })
      } else {
        UserModel.findById(req.user._id)
        .then((user) => {
          if (user.favJokes.includes(joke._id)) {
            console.log("joke already exits in favJokes")
          } else {
            UserModel.findByIdAndUpdate(req.user._id, {$push: {favJokes: joke.id}})
            .then(() => {
              console.log("added to favJokes")
            })
          }
        })
      }

    })
    .catch((err) => {
      console.log(err)
    })
  }
})           
// GET for the general jokes
router.get('/main/general', (req, res, next) => {
  JokeModel.find()
  .then((jokes) => {
    let general = jokes.filter(joke => joke.type.includes("general"))
    res.render('auth/general.hbs', {general, jokes})
  })
  .catch((err) => {
    console.log(err)
  })
})

// GET for knock knock
router.get('/main/knock-knock', (req, res, next) => {
  JokeModel.find()
  .then((jokes) => {
    let knock = jokes.filter(joke => joke.type.includes("knock-knock"))
    res.render('auth/knock-knock.hbs', {knock, jokes})
  })
  .catch((err) => {
    console.log(err)
  })})

// GET for the programming jokes
router.get('/main/programming', (req, res, next) => {
  JokeModel.find()
  .then((jokes) => {
    let programming = jokes.filter(joke => joke.type.includes("programming"))
    res.render('auth/programming.hbs', {programming, jokes})
  })
  .catch((err) => {
    console.log(err)
  })})

  module.exports = router;
