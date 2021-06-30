const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcryptjs = require('bcryptsjs')

router.get("/about", (req, res, next) => {
    res.render('auth/about.hbs')

})


router.get("/signin", (req, res, next) => {
    res.render('auth/signin.hbs');
});


router.post('/signin', (req, res, next) => {
    const {username, email, password} = req.body

    // check if the email is in the DB
          // verify the pass
    
    UserModel.findOne({email})
        .then((user) => {
            if (user) {
              //If the email does exist 
              //bcrypt.compareSync( PASSWORD_FROM_PAGE, PASSWORD_FROM_DB);
              //  You can destructure this as well
              //  const {password: passwordFromDB} = user
                let isValid = bcrypt.compareSync( password, user.password);
                console.log(isValid)
                if (isValid) {
      
                  req.session.loggedInUser = user
                  req.app.locals.isLoggedIn = true;
                  res.redirect('/profile')
              }  
              else {
                  // If password does not match
                  res.render('auth/signin', {error: 'Invalid password'})
            }  
        } 
            else {
              //If the email does not exist 
                res.render('auth/signin', {error: 'Email does not exists'})
        }
        })
        .catch((err) => {
            next(err)
        })      
})

function checkLoggedIn(req, res, next) {
    if ( req.session.loggedInUser) {
        next()
}
else{
    res.redirect('/signin')
}
}



module.exports = router;
