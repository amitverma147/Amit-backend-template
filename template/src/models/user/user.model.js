// src/modules/user/user.model.js
import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true,
    },

    phone: String,
    avatar: String,

    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
    ],

    previousPackages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    ],

    address: String,
    city: String,
    country: String,
  },
  { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);
