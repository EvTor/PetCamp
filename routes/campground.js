import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import { validateCamp } from "../utils/validation.js";
import { Campground } from "../models/campground.js";
import { AppError } from "../utils/AppError.js";
import { isLoggedIn } from "../middleware/isLogggedIn.js";
import { isAuthor } from "../middleware/isAuthor.js";

export const routerCamp = express.Router({ mergeParams: true });

routerCamp.get(
  "/",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
    return;
  })
);

routerCamp.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

routerCamp.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find campground");
      return res.redirect("/campgrounds");
      //return next(new AppError("Camp not found", 404));
    }
    res.render("campgrounds/show", {
      campground,
    });
  })
);

routerCamp.post(
  "/",
  isLoggedIn,
  validateCamp,
  wrapAsync(async (req, res) => {
    const newCampground = await new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully created new camp!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

routerCamp.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCamp,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, {
      new: true,
      runValidators: true,
    });
    req.flash("success", "Successfully updated Camp");
    res.redirect(`/campgrounds/${id}`);
  })
);

routerCamp.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Camp");
    res.redirect("/campgrounds");
  })
);

routerCamp.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find campground");
      return res.redirect("/campgrounds");
      //return next(new AppError("Camp not found", 404));
    }
    res.render("campgrounds/edit", { campground });
  })
);
