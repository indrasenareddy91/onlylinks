import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, select: false },
  image: { type: String  , required: false},
  authProviderId: { type: String },
  username: { 
    type: String, 
    unique: true, 
    required: false, // Not required initially, but will be set later
    index: true // For faster queries
  },
  isUsernameSet: { type: Boolean, default: false },
  socialLinks: {
    type: [{
      platform: { type: String, required: true },
      link: { type: String, required: true },
      _id: { type: String, required: true }
    }],
    default: [],
    required: false
  },
  profilePic: { type: String, required: false , default:null},
  profileDisplayName: { type: String, required: false, default:null},
  profileBio: { type: String, required: false, default:null},
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);