import jwt from "jsonwebtoken";
import { promisify } from "util";
import Account from "../models/account/account.model.js";
import UserProfile from "../models/user/user.model.js";
import AdminProfile from "../models/admin/admin.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await Account.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // 5) Fetch Profile based on Role (Optional but helpful)
  let profile = null;
  if (currentUser.role === "USER") {
    profile = await UserProfile.findOne({ accountId: currentUser._id });
  } else if (["ADMIN", "SUPER_ADMIN", "SUPPORT"].includes(currentUser.role)) {
    profile = await AdminProfile.findOne({ accountId: currentUser._id });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  req.profile = profile;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

export const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    // If Super Admin, bypass permission check
    if (req.user.role === "SUPER_ADMIN") return next();

    // If User is not Admin-like, deny (should be caught by restrictTo, but extra safety)
    if (!req.profile || !req.profile.permissions) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    const hasPermission = requiredPermissions.every((perm) =>
      req.profile.permissions.some((p) => p.type === perm)
    );

    if (!hasPermission) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
