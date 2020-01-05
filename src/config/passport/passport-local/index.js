const LocalStrategy = require('passport-local').Strategy;
const {compare} = require('../../../utils/password');
const SuperAdminUsers = require('../../../models/superAdminUser');
const AdminUsers = require('../../../models/adminUser');
module.exports = (local) => {
  local.use( 'localSuperAdmin', new LocalStrategy(
      {
        usernameField: 'type',
      },
      (type, password, done) => {
        SuperAdminUsers.findOne({type})
            .then((user) => {
              if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
              }
              const isCorrectPassword = compare(password, user.password);
              if (!isCorrectPassword) {
                return done(null, false, {message: 'Incorrect password.'});
              }
              return done(null, user);
            })
            .catch((err) => done(err));
      },
  ),
  );

  local.use( 'localAdmin', new LocalStrategy(
      {
        usernameField: 'type',
      },
      (type, password, done) => {
        AdminUsers.findOne({type})
            .then((user) => {
              if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
              }
              const isCorrectPassword = compare(password, user.password);
              if (!isCorrectPassword) {
                return done(null, false, {message: 'Incorrect password.'});
              }
              return done(null, user);
            })
            .catch((err) => done(err));
      },
  ),
  );
};
