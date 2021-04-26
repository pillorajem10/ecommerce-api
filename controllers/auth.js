const User = require('../models/Users');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken'); //to generate signed token
const config = require ('../config');
const { body } = require('express-validator');
const { errorHandler } = require ('../helpers/dbErrorHandler');

let refreshTokens = []

function generateAccessToken(user) {
  return jwt.sign(user.toJSON(), config.accessTokenSecret, { expiresIn: config.accessTokenLife })
}

//for signup
exports.signup = ( req, res ) => {
  const user = new User(req.body);
  user.save((err, user)=> {
    if(err){
      console.log('ERROR: ', err)
      return res.status(400).json({
        error:errorHandler(err)
      })
    }
    const { _id, fname, mname, lname, email, uname, role, full_name } = user
    const token = jwt.sign({ _id: user._id }, config.secret);
    user.salt = undefined;
    user.hashed_password = undefined;
    console.log('NAMEEE', full_name);
    console.log('USER', user);
    res.json({
       token, _id, email, fname, mname, lname, uname, full_name, role
    });
  });
}

//for signin
exports.signin = ( req, res ) => {
  // find the user based on email
  const { uname, email, password } = req.body;

  // if user used his/her username to login
  if(req.body.uname && !req.body.email) {
    User.findOne({ uname }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email/username does not exist. Please signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email/Username and password dont match'
            });
        }
        // generate a signed token with user id and secret
        var token = generateAccessToken(user);
        var refreshToken = jwt.sign(user.toJSON(), config.refreshTokenSecret,{ expiresIn: config.refreshTokenLife });
        const { _id, fname, mname, lname, email, uname, full_name, role } = user;

        RefreshToken.create({ token: refreshToken }, function (err, whitelist) {
          if (err) {
            return res.status(401).json({
                error: 'Server failed'
            });
          } else {
            return res.json({ token, refreshToken, _id, email, fname, mname, lname, uname, full_name, role  });
          }
        });
        // persist the token as 't' in cookie with expiry date
        // return response with user and token to frontend client
    });
  }

  // if user used his/her email to login
  if(req.body.email && !req.body.uname) {
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email/username does not exist. Please signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email/Username and password dont match'
            });
        }
        // generate a signed token with user id and secret
        var token = generateAccessToken(user);
        var refreshToken = jwt.sign(user.toJSON(), config.refreshTokenSecret);
        const { _id, fname, mname, lname, email, uname, full_name, role } = user;

        RefreshToken.create({ token: refreshToken }, function (err, whitelist) {
          if (err) {
            return res.status(401).json({
                error: 'Server failed'
            });
          } else {
            return res.json({ token, refreshToken, _id, email, fname, mname, lname, uname, full_name, role  });
          }
        });
        // persist the token as 't' in cookie with expiry date
        // return response with user and token to frontend client
    });
  }
}

exports.logout = (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
};

exports.token = ( req, res ) => {
  const refreshToken = req.body.token

  if (refreshToken === null) return res.sendStatus(401);

  RefreshToken.find({ token: refreshToken }, function (err, usr) {
    if (err) return next(err);
    if (usr.length === 0) {
      return res.status(403).json({
        msg: 'Forbidden.',
      });
    }

    jwt.verify(refreshToken, config.refreshTokenSecret, (err, user) => {
      if (err) {
        res.status(403).json({
          msg: 'Forbidden'
        });
      } else {
        const token = jwt.sign(user, config.accessTokenSecret);
        res.json({ token });
      }
    });
  });
}
