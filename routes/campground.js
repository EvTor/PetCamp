import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import {validateCamp} from "../utils/validation.js";
import { Campground } from "../models/campground.js";
import { AppError } from "../utils/AppError.js";


export const routerCamp = express.Router();



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
  wrapAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

routerCamp.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      return next(new AppError("Camp not found", 404));
    }
    res.render("campgrounds/show", {
      campground,
      messages: req.flash("success"),
    });
  })
);

routerCamp.post(
  "",
  validateCamp,
  wrapAsync(async (req, res) => {
    const newCampground = await new Campground(req.body.campground).save();
    req.flash("success", "Successfully created new camp!");
    res.redirect(`/${newCampground._id}`);
  })
);

routerCamp.put(
  "/:id",
  validateCamp,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, {
      new: true,
      runValidators: true,
    });
    res.redirect(`/${id}`);
  })
);


routerCamp.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("");
  })
);


routerCamp.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
