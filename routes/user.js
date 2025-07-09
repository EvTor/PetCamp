import { User } from "../models/user.js";
import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import passport from "passport";
import { returnTo } from "../middleware/isLogggedIn.js";
export const routerUser = express.Router();

routerUser.get("/register", async (req, res) => {
  res.render("users/register");
});

routerUser.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Wellcome to PetCamp!");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("register");
    }
  })
);

routerUser.get(
  "/login",
  wrapAsync(async (req, res) => {
    res.render("users/login");
  })
);

routerUser.post(
  "/login",
  returnTo, // use the storeReturnTo middleware to save the returnTo value from session to res.locals
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login",
  }),
  wrapAsync(async (req, res) => {
    //passport.authenticate() is a passport middleware
    req.flash("success", "Wellcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
  })
);

routerUser.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});
