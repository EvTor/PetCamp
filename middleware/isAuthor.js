import { Campground } from "../models/campground.js";
import { Review } from "../models/review.js";

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (camp.author._id.toString() !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; //the endpoint is /campgrounds/:id/reviews/:reviewId"
  const review = await Review.findById(reviewId);
  if (review.author._id.toString() !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
