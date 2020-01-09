const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const toUseModel = require('../../../utils/jwt/model');
module.exports = (passport) => {
  passport.use(
      new JwtStrategy(
          {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
            secretOrKey: process.env.JWT_SECRET,
          },
          (payload, done) => {
            toUseModel(payload.userType).findOne({_id: payload.sub})
                .then((user) => {
                  if (!user) {
                    return done(null, false);
                  }
                  return done(null, user);
                })
                .catch((err) => done(err, false));
          },
      ),
  );
};
