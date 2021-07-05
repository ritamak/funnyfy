// REQUIRED
const router = require("express").Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs');
const JokeModel = require('../models/Joke.model');

// function to private / public
function checkLoggedIn(req, res, next){
  if ( req.session.loggedInUser) {
      next();
  } else {
    res.redirect('/signin');
  }
};

// ------------------------------- GET -----------------------------------

// GET about
router.get("/about", (req, res, next) => {
  res.render('auth/about.hbs');
});

// GET singUp
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs');
});

// GET SignIn
router.get("/signin", (req, res, next) => {
  res.render('auth/signin.hbs');
});

// GET logOut
router.get('/logout', (req, res, next) => {
  req.session.destroy();
    req.app.locals.isLoggedIn = false;
  res.redirect('/');
});

// GET profile
router.get('/profile/:id', checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
  const userId = req.session.loggedInUser._id;
  UserModel.findById(userId)
  .populate("favJokes")
  .then((user) => {
    //let myUser = user.find(user => user._id == userId)
    /*
  console.log(favs)
  let punchlines = user.favJokes.map((joke) => {
     let jokestoprint = [`${joke.setup}, ${joke.punchline}`]
    return jokestoprint
  });
  console.log(punchlines)
  */
    res.render('auth/profile.hbs', {user});
  })
  .catch((err) => {
    console.log(err);
  })
  } else {
    console.log("you don't have acess");
  }
});

// GET main
router.get("/main", checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
    JokeModel.find()
    .then((jokes) => {
      let general = jokes.filter(joke => joke.type.includes("general"));
      let programming = jokes.filter(joke => joke.type.includes("programming"));
      let knock = jokes.filter(joke => joke.type.includes("knock-knock"));
      let myUserId = req.session.loggedInUser._id
      const randomJoke = () => {
        return jokes[Math.floor(Math.random() * jokes.length)];
      };
      const jokeProgramming = (type, n) => {
        return randomJoke(jokes.filter(joke => joke.type === "programming"), 1);
      };
      const jokeGeneral = (type, n) => {
        return randomJoke(jokes.filter(joke => joke.type === "general"), 1);
      };
      const jokeKnock = (type, n) => {
        return randomJoke(jokes.filter(joke => joke.type === "knock-knock"), 1);
      };
      res.render('auth/main.hbs', {general, programming, knock, jokes, myUserId, randomJoke, jokeProgramming, jokeGeneral, jokeKnock})
    })
    .catch((err) => {
      console.log(err);
    })
  } else {
    console.log("you dont have acess");
  }
});

// GET main / general
router.get('/main/general', checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
  let myUserId = req.session.loggedInUser._id;
  JokeModel.find()
  .then((jokes) => {
    let general = jokes.filter(joke => joke.type.includes("general"));
    res.render('auth/general.hbs', {general, jokes, myUserId});
  })
  .catch((err) => {
    console.log(err);
  })
  } else {
    console.log("you don't have acess");
  }
});

// GET main / knock knock 
router.get('/main/knock-knock', checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
  let myUserId = req.session.loggedInUser._id;
  JokeModel.find()
  .then((jokes) => {
    let knock = jokes.filter(joke => joke.type.includes("knock-knock"));
    res.render('auth/knock-knock.hbs', {knock, jokes, myUserId})
  })
  .catch((err) => {
    console.log(err)
  })
  } else {
  console.log("you dont have acess");
  }
});

// GET main / programming
router.get('/main/programming', checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
  let myUserId = req.session.loggedInUser._id;
  JokeModel.find()
  .then((jokes) => {
    let programming = jokes.filter(joke => joke.type.includes("programming"));
    res.render('auth/programming.hbs', {programming, jokes, myUserId})
  })
  .catch((err) => {
    console.log(err);
  })
  } else {
    console.log("you don't have acess");
  }
});

// -------------- POST ------------

// POST signUp  
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
        res.redirect('/signin');
        })
      .catch((err) => {
        next(err);
      })
});

// POST signIn
router.post('/signin', (req, res, next) => {
const {email, password} = req.body;
    UserModel.findOne({email})
    .then((user) => {
        if(user){          
          let isValid = bcrypt.compareSync(password, user.password);
          if(isValid) {
            req.session.loggedInUser = user;
            req.app.locals.isLoggedIn = true;
            res.redirect(`/profile/${user._id}`)  
        } else {
          res.render('auth/signin', {error: 'Invalid Password'});
        }
      }    
    })
});

// POST add joke
router.post("/add-joke", checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
    JokeModel.findOne({_id: req.body._id})
    .then((joke) => {
      if (!joke) {
        JokeModel.create(req.body)
        .then((newJoke) => {
          UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {favJokes: newJoke._id}})
          .then(() => {
            console.log("joke created");
          })
        })
      } else {
        UserModel.findById(req.session.loggedInUser._id)
        .then((user) => {
          if (user.favJokes.includes(joke._id)) {
            console.log("joke already exits in favJokes");
          } else {
            UserModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {favJokes: joke._id}})
            .then(() => {
              console.log("added to favJokes");
            })
          }
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }
})   

router.get('/profile/:id/edit', checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
  const userId = req.session.loggedInUser._id;
  UserModel.findById(userId)
  
  .then((user) => {
  
    res.render('auth/edit-profile.hbs', {user});
  })
  .catch((err) => {
    console.log(err);
  })
  } else {
    console.log("Edit Failed");
  }
});
  
router.post('/profile/:id', checkLoggedIn, (req, res, next) => {
    if(req.session.loggedInUser) {
  const { id } = req.params
  const {username, email } = req.body
  console.log(username, email, id)
    UserModel.findByIdAndUpdate(id, {username, email})
    .then(() => {
      console.log("Edited profile")
      res.redirect(`/profile/${id}`)  
    })
    .catch((err) => {  
      console.log('Edit failed')
      next(err)
    })
  }
});
        



// POST delete favorites
router.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;
  let myUserId = req.session.loggedInUser._id;
  console.log(myUserId)
  JokeModel.findByIdAndDelete(id)
  .then(() => res.redirect(`/profile/${myUserId}`)) 
  .catch((err) => console.log(err));
});

module.exports = router;
