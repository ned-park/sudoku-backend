import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: { type: String, select: false },
});

UserSchema.statics.signup = async function (username, password) {
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new Error("Username is taken.");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await this.create({
    username,
    passwordHash,
  });

  return {
    id: user._id.toString(),
    username: user.username,
  };
};

UserSchema.statics.login = async function (username, password) {
  const user = await User.findOne({ username }, "+passwordHash");

  if (!user) throw new Error("Invalid username.");

  const correctPassword = await bcrypt.compare(password, user.passwordHash);
  if (!correctPassword) throw new Error("Incorrect password.");

  return {
    username: user.username,
    id: user._id.toString(),
  };
};

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
