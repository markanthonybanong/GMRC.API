const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const Users = require('../../../models/adminUser');

module.exports = (passport) => {
  passport.use(
      new JwtStrategy(
          {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
            secretOrKey: process.env.JWT_SECRET,
          },
          (payload, done) => {
            Users.findOne({_id: payload.sub})
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
