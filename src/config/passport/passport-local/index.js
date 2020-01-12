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
        AdminUsers.find({type})
            .then((users) => {
              if (users) {
                let userIndex = null;
                let isPasswordMatch = false;
                for (let i = 0; i < users.length; i++) {
                  if (compare(password, users[i].password)) {
                    isPasswordMatch = true;
                    userIndex = i;
                    break;
                  }
                }
                if (isPasswordMatch) {
                  return done(null, users[userIndex]);
                } else {
                  return done(null, false, {message: 'Incorrect password.'});
                }
              } else {
                return done(null, false, {message: 'Incorrect username.'});
              }
            })
            .catch((err) => done(err));
      },
  ),
  );
};
