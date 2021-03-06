const bcrypt = require('bcrypt');
exports.generate = (password, rounds = 12) => {
  const hash = bcrypt.hashSync(password, rounds);
  return hash;
};
exports.compare = (password, hash) => {
  const result = bcrypt.compareSync(password, hash);
  return result;
};
