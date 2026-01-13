// src/modules/admin/admin.model.js
import mongoose from "mongoose";

const adminProfileSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true,
    },

    avatar: String,

    permissions: [
      {
        type: String,
        // "PACKAGE_CREATE", "BLOG_EDIT", "USER_BLOCK"
      },
    ],

    department: String, // e.g. "Operations", "Content", "Support"
  },
  { timestamps: true }
);

export default mongoose.model("AdminProfile", adminProfileSchema);
