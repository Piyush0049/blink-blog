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
    image: { type: String }, // optional: save Google profile pic
    isGoogleUser: { type: Boolean, default: false }, // 👈 flag to know auth type
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
