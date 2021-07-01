const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
})

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



router.get("/signin", (req, res, next) => {
    res.render('auth/signin.hbs');
});


router.post('/signin', (req, res, next) => {
const {email, password} = req.body  
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

UserModel.create({email, password: hash})
.then(() => {
    res.redirect('auth/profile.hbs')
})
.catch((err) => {
    next(err)
})
})


router.get('/main', (req, res, next) => {
    res.render('auth/main.hbs')
})

router.get('/profile', (req, res, next) => {
    res.render('auth/profile.hbs')
})
router.get("/about", (req, res, next) => {
    res.render('auth/about.hbs')

})

module.exports = router;
