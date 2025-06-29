import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import { validateReview } from "../utils/validation.js";
import { Campground } from "../models/campground.js";
import { Review } from "../models/review.js";

export const routerReview = express.Router({mergeParams: true});
routerReview.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const review = await new Review(req.body.review).save();
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

routerReview.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    console.log(campground._id);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
