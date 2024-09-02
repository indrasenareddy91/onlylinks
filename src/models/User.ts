import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, select: false },
  image: { type: String },
  authProviderId: { type: String },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);