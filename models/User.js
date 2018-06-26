const mongoose = require("../app/db");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token   : { type: String }
});
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function(password, cb) {
  console.log(password, this.password);
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("user", UserSchema);
module.exports = User;
