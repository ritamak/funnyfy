const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');


router.get("/about", (req, res, next) => {
    res.render("auth/about.hbs");
});


router.get("/signin", (req, res, next) => {
    res.render("auth/signin.hbs")
})

router.post("/signin", (req, res, next) => {
    const {password, email} = req.body;

    UserModel.findOne({email})
        .then((user) => {
            if (user) {
            
                let isValid = bcrypt.compareSync( password, user.password);
                console.log(isValid)
                if (isValid) {

                    req.session.loggedInUser = user
                    req.app.locals.isLoggedIn = true;
                    res.redirect('/profile')
            }  
                    else {
                console.log(error)
                    res.render('auth/signin', {error: 'Invalid password'})
            }  
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
router.get('/profile', checkLoggedIn, (req, res, next) => {

    res.render('auth/profile.hbs', {name:  req.session.loggedInUser.username})



})

module.exports = router