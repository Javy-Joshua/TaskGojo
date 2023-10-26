const mongoose = require("mongoose");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectID;

const UserSchema = new Schema ({
    _id: {
        type: String,
        default: uuid.v4(),
        required: true
    },
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    contact: {type: String, required: true},
    created_at: { type: Date, default: new Date }
})

// before save
UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
})

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

// after save

// before update

// after update

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;