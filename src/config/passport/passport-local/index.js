const LocalStrategy = require('passport-local').Strategy;
const {compare} = require('../../../utils/password');
const Users = require('../../../models/user');

module.exports = (local) => {
  local.use( new LocalStrategy(
      {
        usernameField: 'email',
      },
      (email, password, done) => {
        Users.findOne({email})
            .select('+password')
            .then((user) => {
              if (!user) {
                return done(null, false, {
                  message: 'Cannot find any user with email',
                });
              }
              const isCorrectPassword = compare(password, user.password);
              if (isCorrectPassword) {
                return done(null, user, {message: 'Correct Password'});
              }
              return done(null, null, {message: 'Incorrect Password'});
            })
            .catch((err) => done(err));
      },
  ),
  );
};
