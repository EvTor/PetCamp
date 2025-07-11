import { User } from "../models/user.js";
import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import passport from "passport";
import { returnTo } from "../middleware/isLogggedIn.js";
import {
  createNewUser,
  loginUser,
  logoutUser,
  renderLoginForm,
  renderRegisterForm,
} from "../controllers/user.js";
export const routerUser = express.Router();

routerUser
  .route("/register")
  .get(wrapAsync(renderRegisterForm))
  .post(wrapAsync(createNewUser));

routerUser.get("/login", wrapAsync(renderLoginForm));

routerUser.post(
  "/login",
  returnTo, // use the storeReturnTo middleware to save the returnTo value from session to res.locals
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login",
  }),
  wrapAsync(loginUser)
);

routerUser.get("/logout", wrapAsync(logoutUser));
