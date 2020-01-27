const {UserTypes} = require('../../core/enums/userType');
const SuperAdminUser = require('../../models/superAdminUser');
const AdminUser = require('../../models/adminUser');
/**
 *
 * @param {string} userType The login user
 * @return {model}
 */
function toUseModel(userType) {
  return userType === UserTypes.SUPERADMIN ? SuperAdminUser : AdminUser;
};
module.exports = toUseModel;
