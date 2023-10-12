const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const models = require("./models");
const passportJWT = require("passport-jwt");
const { model } = require("mongoose");

const User = models.User;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
      {
        usernameField: "Username",
        passwordField: "Password",
      },
      async (username, password, callback) => {
        console.log(`${username} ${password}`);
        await Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            console.log('incorrect username');
            return callback(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, { message: 'Incorrect password.' });
          }
          console.log('finished');
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        })
      }
    )
  );
  
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "your_jwt_secret",
      },
      async (jwtPayload, callback) => {
        try {
          const user = await User.findById(jwtPayload._id);
          if (!user) {
            return callback(null, false);
          }
          return callback(null, user);
        } catch (error) {
          console.error(error);
          return callback(error);
        }
      }
    )
  );