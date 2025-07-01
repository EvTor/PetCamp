import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

//For saving and verifuing password by passport
UserSchema.plugin(passportLocalMongoose);

export const User = mongoose.model("User", UserSchema);
