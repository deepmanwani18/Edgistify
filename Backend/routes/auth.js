const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const { v4: uuidv4 } = require('uuid');


// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const { sendEmail } = require('../config/emailService');

// Load User model
const User = require("../models/User");

// @route POST /auth/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
    // Form Validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: req.body.password,
                verificationToken: uuidv4(),
            });

            // Hash password before saving in database
            bcrypt.genSalt(10)
                .then(salt => bcrypt.hash(newUser.password, salt))
                .then(hash => {
                    newUser.password = hash;
                    return newUser.save()
                })
                .then(user => {
                    sendEmail('support@edgistify.com', user.email, `Verify your Edgistify Account`, ``, `Click <a href="${req.protocol}://${req.headers.host}/auth/verify?token=${user.verificationToken}">here</a> to verify your account or copy and paste the given link in your browser.<br>${req.protocol}://${req.headers.host}/auth/verify?token=${user.verificationToken}`);
                    res.json(user);
                })
                .catch(err => console.log(err));
        }
    });
});

// @route POST auth/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // console.log(req);
    // console.log(req.body);
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);// Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;// Find user by email
    User.findOne({ email, verified: true }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found / Verfication not done" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token
                jwt.sign(payload, keys.secretOrKey, {
                    expiresIn: 31556926 // 1 year in seconds
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                });
            } else {
                return res
                    .status(400)
                    .json({ passwordIncorrect: "Password incorrect" });
            }
        });
    });
});

// Verification of account
router.get('/verify', (req, res) => {
    var token = req.query.token;
    User.findOneAndUpdate({ verificationToken: token }, { verified: true }, { new: true })
        .then(user => {
            sendEmail('support@edgistify.com', user.email, `Welcome to Edgistify`, ``, `You are now verified. Get yourself into world of awesomeness with us.`);
            return res.redirect(`/login`)
        })
        .catch(err => console.log(err));
});

// Forgot password
router.post('/forgot', (req, res) => {
    var { email } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).send({ msg: 'No user found' });
            } else {
                user.resetPasswordToken = uuidv4();
                user.resetPasswordExpires = Date.now() + (1000 * 60 * 60 * 6);
                user.save()
                    .then(() => {
                        sendEmail('support@edgistify.com', user.email, `Reset your Edgistify Account Password`, ``, `Click <a href="${req.protocol}://${req.headers.host}/auth/reset?token=${user.resetPasswordToken}">here</a> to reset your password or copy and paste the given link in your browser. This link will be valid for 6 hours. <br>${req.protocol}://${req.headers.host}/auth/reset?token=${user.resetPasswordToken}`);
                        return res.send({ msg: 'success' });
                    });
            }
        })
        .catch(err => res.status(400).send());
});

// Changing Password on email link click
router.get('/reset', (req, res) => {
    var token = req.query.token;
    User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
            return res.redirect(`/forgot`);
            }
            return res.redirect(`/reset?token=${token}`);
        })
        .catch(err => console.log(err));
});

// Setting up new password
router.post('/reset', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
    var { password, password2 } = req.body;
    var errors = [],
        token = req.query.token;
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        return res.render('resetPassword', { errors, password, password2, req, token });
    }

    var token = req.query.token;
    User.findOneAndUpdate({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, { resetPasswordExpires: undefined, resetPasswordToken: undefined }, { new: true })
        .then(user => {
            if (!user) {
            return res.status(400).send();
            }

            bcrypt.genSalt(10)
                .then(salt => bcrypt.hash(password, salt))
                .then(hash => {
                    user.password = hash;
                    return user.save()
                })
                .then((user) => {
                    return res.send(user)
                });
        })
        .catch(err => console.log(err));
});

module.exports = router;