import { User } from "../models/user.js";

export const renderRegisterForm = async (req, res) => {
  res.render("users/register");
};

export const createNewUser = async (req, res) => {
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
};

export const renderLoginForm = async (req, res) => {
  res.render("users/login");
};

export const loginUser = async (req, res) => {
  //passport.authenticate() is a passport middleware
  req.flash("success", "Wellcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

export const logoutUser = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
