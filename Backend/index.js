const express = require('express');
const app = express();

const path = require('path');
var cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require("passport");

const indexRoute = require("./routes/index");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const keys = require('./config/keys');

app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// app.use(express.static('static'));

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

// mongoose
//     .connect(
//         keys.mongoURI,
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true
//         }
//     )
//     .then(() => console.log("MongoDB successfully connected"))
//     .catch(err => console.log(err));


// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/post", postRoute);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(keys.PORT, () => {
    console.log(`Listening on ${keys.PORT}`);
});