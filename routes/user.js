import { User } from "../models/user.js";
import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import passport from "passport";
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
      console.log(registeredUser);
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("register");
    }
    req.flash("success", "Wellcome to PetCamp!");
    res.redirect("/campgrounds");
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
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "users/login",
  }),
  wrapAsync(async (req, res) => {
    //passport.authenticate() is a passport middleware
    req.flash("success", "Wellcome back!");
    res.redirect("/campgrounds");
  })
);
