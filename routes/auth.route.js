// REQUIRED
const router = require("express").Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs');
const JokeModel = require('../models/Joke.model');
const Handlebars = require("hbs");

/*
Handlebars.registerHelper('addEx', function (string) {
  return string.charAt(string.length - 1) === "!" ? string : string+"!"
})
*/

// for adding random emoji
Handlebars.registerHelper('addEmoji', function (string) {
  const emojiArray = ["&#129299","&#128584","&#128585","&#128586", "&#128585", "&#128580", "&#128512",
   "&#128513", "&#128514", "&#128515", "&#128516", "&#128517", "&#128518", "&#128522", "&#12852", 
   "&#128518","&#128518", "&#128518"]
  const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)]
  return result = string + " " + randomEmoji
});

// function to private / public
const checkLoggedIn = (req, res, next) => {
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
    let myUserId = req.session.loggedInUser._id;
    UserModel.findById(myUserId)
    .populate("favJokes")
    .then((user) => {
    res.render('auth/profile.hbs', {user, myUserId});
  })
    .catch((err) => {
    next(err);
  })
  } else {
    next("you don't have acess");
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
      let myUserId = req.session.loggedInUser._id;
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
      next(err);
    })
  } else {
    next("you dont have acess");
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
    next(err);
  })
  } else {
    next("you don't have acess");
  }
});

// GET main / knock knock 
router.get('/main/knock-knock', checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
  let myUserId = req.session.loggedInUser._id;
  JokeModel.find()
  .then((jokes) => {
    let knock = jokes.filter(joke => joke.type.includes("knock-knock"));
    console.log(knock)
    res.render('auth/knock-knock.hbs', {knock, jokes, myUserId})
  })
  .catch((err) => {
    next(err)
  })
  } else {
  next("you dont have acess");
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
    next("you don't have acess");
  }
});

// GET profile edit
router.get('/profile/:id/edit', checkLoggedIn, (req, res, next) => {
  if (req.session.loggedInUser) {
  let myUserId = req.session.loggedInUser._id;
  UserModel.findById(myUserId)
  .then((user) => {
    res.render('auth/edit-profile.hbs', {user, myUserId});
  })
  .catch((err) => {
    next(err);
  })
  } else {
    console.log("Edit Failed");
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
            res.redirect(`/main`)  
        } else {
          res.render('auth/signin', {error: 'Invalid Password'});
        }
      }    
    })
    .catch((er) => {
      next(err)
    })
});

// POST add fav
router.post("/add-fav", checkLoggedIn, (req, res, next) => {
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
      next(err);
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

// POST profile edit
router.post('/profile/:id', checkLoggedIn, (req, res, next) => {
  const { id } = req.params
  const {username, email } = req.body
  let myUserId = req.session.loggedInUser._id;
    UserModel.findByIdAndUpdate(id, {username, email})
    .then(() => {
      console.log("Edited profile")
      res.redirect(`/profile/${id}`)  
    })
    .catch((err) => {
        next('Edit failed', err)
    })
  });
        
module.exports = router;
