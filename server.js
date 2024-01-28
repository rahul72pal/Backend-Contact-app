const express = require('express')
const app = express()
// const dotenv = require("dotenv");
const cors = require('cors');
const session = require('express-session')
const passport = require('passport')
const User = require('./models/User')
const OAuthStatergy = require('passport-google-oauth2').Strategy
const google = require('googleapis')
require('dotenv').config()

// console.log(process.env.GOOGLE_CLIENT_ID)


//set Up Session
app.use(session({
  secret: "rahulpal123",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60000, // 1 minute in milliseconds
  },
}));

//set up passport
app.use(passport.initialize())
app.use(passport.session());

passport.use(
  new OAuthStatergy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id })

        console.log("Profile Here", profile)
        console.log(" Here", profile)
        console.log(" accessToken", accessToken)

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          })

          await user.save();
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))

app.get('/auth/google/callback', passport.authenticate("google", {
  successRedirect: "http://localhost:5173",
  failureRedirect: "http://localhost:5173/login"
}))
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200
};

passport.serializeUser((user, done) => {
  done(null, user);
})
passport.deserializeUser((user, done) => {
  done(null, user);
})

//adding middleware for json request
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// const corsOptions = {
//   origin: '*', // Replace with your frontend's URL
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow credentials like cookies
//   optionsSuccessStatus: 204, // Return a 204 status code for preflight requests
// };

// Enable CORS with the configured options
app.use(cors(corsOptions));

require('dotenv').config();
const PORT = process.env.PORT;
// const port = 3000
const path = require('path');
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


const route = require("./routes/contact")
app.use("/api/v1", route);


// Render Html File
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

const dbconnect = require("./config/dbconnect");
dbconnect();

const cloudinaryconnect = require("./config/cloudinary")
cloudinaryconnect();

// const fileuplaod = require("./routes/fileupload");
// app.use("/ap/v1", fileuplaod);

app.get('/login/sucess', async (req, res) => {
  // console.log("Request ", req);

  if (req.user) {
    res.status(200).json({
      message: "User Login",
      data: req.user
    })
  }
  else {
    res.status(400).json({
      message: "User Not Authorized",
    })
  }
})

app.use('/logout', function (req, res) {
  // console.log("Request in logout = ",req);
  req.logOut(function (err) {
    if (err) {
      return err
    }
    else {
      req.sessionID = null
      req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.redirect('http://localhost:5173');
      });
    }
  });

});

app.listen(PORT, () => {
  // Code.....
  console.log(`app is running in successfully  ${PORT}`)
})

