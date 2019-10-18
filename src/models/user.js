const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
}, {timestamps: {createdAt: 'created_at'}});

userSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('User', userSchema);
