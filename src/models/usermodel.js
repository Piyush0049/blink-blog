import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    interests: {
      type: [String],
      required: true,
      default: [],
    },
    image: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    bio: { type: String, default: "" }, // optional: user bio
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
