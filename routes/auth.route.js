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
<<<<<<< HEAD
<<<<<<< HEAD
  UserModel.findOne({email})
  .then((user) => {
      if(user){         
        let isValid = bcrypt.compareSync(password, user.password);
        if(isValid) {
          req.session.loggedInUser = user;
          req.app.locals.isLoggedIn = true;
          res.redirect('/profile')            
        } else {
          res.render('auth/signin', {error: 'Invalid Password'})
        }
    }
  })
})
=======
    UserModel.findOne({email})
    .then((user) => {
        if(user){
          
            let isValid = bcrypt.compareSync(password, user.password);
            if(isValid){
                  req.session.loggedInUser = user;
                  req.app.locals.isLoggedIn = true;
                  res.redirect(`/profile/${user._id}`)
                
            }if(isValid == true){
                res.redirect(`/profile/${user._id}`)
            }

            else {
                res.render('auth/signin', {error: 'Invalid Password'})
            }
        }
        
    })
    .catch((err) => {
      next(err)
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
    

    
    router.get('/logout', (req, res, next) => {
        req.session.destroy()
          req.app.locals.isLoggedIn = false;
        res.redirect('/')
    })
  

    

>>>>>>> f584c25edf5c67aab88ca1d38e4ce8ac34ca88ce

=======
    UserModel.findOne({email})
    .then((user) => {
        if(user){          
          let isValid = bcrypt.compareSync(password, user.password);
          if(isValid){
            req.session.loggedInUser = user;
            req.app.locals.isLoggedIn = true;
            res.redirect(`/profile/${user._id}`)  
        } else {
          res.render('auth/signin', {error: 'Invalid Password'})
        }
      }    
    })
})
>>>>>>> 68504c5c3a162b04fd4f370a7828d0c7de112884
function checkLoggedIn(req, res, next){
  if ( req.session.loggedInUser) {
      next()
  } else {
    res.redirect('/signin')
  }
}
<<<<<<< HEAD
      
router.get('/logout', (req, res, next) => {
    req.session.destroy()
    req.app.locals.isLoggedIn = false;
=======

router.get('/logout', (req, res, next) => {
    req.session.destroy()
      req.app.locals.isLoggedIn = false;
>>>>>>> 68504c5c3a162b04fd4f370a7828d0c7de112884
    res.redirect('/')
})
  
// GET to profile
router.get('/profile/:id', checkLoggedIn, (req, res, next) => {
  const userId = req.params.id
  UserModel.find()
  .populate("favJokes")
  .then((users) => {
    let myUser = users.find(user => user._id == userId)
    console.log(myUser)
    res.render('auth/profile.hbs', {myUser, users})
  })
})

// GET main
router.get("/main", checkLoggedIn, (req, res, next) => {
  if(req.session.loggedInUser = true){
    
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
<<<<<<< HEAD
})
 
// POST add joke
router.post("/add-joke", checkLoggedIn, (req, res, next) => {
=======
  }
})

// POST add joke
router.post("/add-joke", checkLoggedIn, (req, res, next) => {


>>>>>>> f584c25edf5c67aab88ca1d38e4ce8ac34ca88ce
  if (req.session.loggedInUser) {
    JokeModel.findOne({_id: req.body._id})
    .then((joke) => {
      if (!joke) {
        JokeModel.create(req.body)
        .then((newJoke) => {
          UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {favJokes: newJoke._id}})
          .then(() => {
            console.log("joke created")
          })
        })
      } else {
        UserModel.findById(req.session.loggedInUser._id)
        .then((user) => {
          if (user.favJokes.includes(joke._id)) {
            console.log("joke already exits in favJokes")
          } else {
            UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {favJokes: joke._id}})
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
<<<<<<< HEAD
})           

=======
})   
        
>>>>>>> 68504c5c3a162b04fd4f370a7828d0c7de112884
// GET for the general jokes
router.get('/main/general', checkLoggedIn, (req, res, next) => {
  let myUserId = req.session.loggedInUser._id
  JokeModel.find()
  .then((jokes) => {
    let general = jokes.filter(joke => joke.type.includes("general"))
    res.render('auth/general.hbs', {general, jokes, myUserId})
  })
  .catch((err) => {
    console.log(err)
  })
})

// GET for knock knock
router.get('/main/knock-knock', checkLoggedIn, (req, res, next) => {
  let myUserId = req.session.loggedInUser._id
  JokeModel.find()
  .then((jokes) => {
    let knock = jokes.filter(joke => joke.type.includes("knock-knock"))
    res.render('auth/knock-knock.hbs', {knock, jokes, myUserId})
  })
  .catch((err) => {
    console.log(err)
  })})

// GET for the programming jokes
router.get('/main/programming', checkLoggedIn, (req, res, next) => {
  let myUserId = req.session.loggedInUser._id
  JokeModel.find()
  .then((jokes) => {
    let programming = jokes.filter(joke => joke.type.includes("programming"))
    res.render('auth/programming.hbs', {programming, jokes, myUserId})
  })
  .catch((err) => {
    console.log(err)
  })})

  module.exports = router;