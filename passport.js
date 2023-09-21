const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const models = require("./models");
const passportJWT = require("passport-jwt");
const { model } = require("mongoose");

let Usernames = Models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password'
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await Usernames.findOne({ Username: username })
            .then((user) => {
                if (!user) {
                    console.log('incorrect username');
                    return callback(null, false, {
                        message: 'Incorrect username of password.'
                    });
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


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    }); 
}));