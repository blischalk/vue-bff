const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const config = {
    name: 'sample-express-app', port: 3000,
    host: '0.0.0.0',
};

const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});

passport.use(new OAuth2Strategy({
    authorizationURL: `https://${process.env.OKTA_DOMAIN}/oauth2/v1/authorize`,
    tokenURL: `https://${process.env.OKTA_DOMAIN}/oauth2/v1/token`,
    clientID: process.env.OKTA_CLIENT_ID,
    clientSecret: process.env.OKTA_CLIENT_SECRET,
    callbackURL: "http://localhost:7000/backend/callback",
    scope: 'openid profile',
    state: true
  },
  function(accessToken, refreshToken, profile, cb) {
    logger.info(`${profile}`);
    return cb(null, {id: profile.id, email: profile.email});
  }
));

function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(401).send(JSON.stringify({ message: "User is not authenticated" }));
  }
}

app.get('/login', passport.authenticate('oauth2', {
  session: true,
  successReturnToOrRedirect: '/'
}));

app.get('/logout', function (req, res) {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);

app.get('/auth/loggedin',
  loggedIn,
  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ loggedin: true }));
});

app.get('/', (req, res) => {
  res.status(200).send('Backend is alive');
});

app.get('/auth/content',
  loggedIn,
  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message: "This is top secret authenticated content" }));
});

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1800s' });
}

app.get('/auth/proxied',
  loggedIn,
  async (req, res) => {
    const token = generateAccessToken({ some: 'data' });
    try {
      const resp = await axios.get('http://proxied:4000/auth/proxied', {
        headers: { Authorization: `Bearer ${token}` }
      });
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(resp.data));
    } catch(err) {
      res.setHeader('Content-Type', 'application/json');
      console.log(err);
      res.status(500).send(JSON.stringify({ message: "Something went wrong" }));
    }
});

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
