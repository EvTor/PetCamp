import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import { validateReview } from "../utils/validation.js";
import { Campground } from "../models/campground.js";
import { Review } from "../models/review.js";
import { isLoggedIn } from "../middleware/isLogggedIn.js";
import { isReviewAuthor } from "../middleware/isAuthor.js";
import { createReview, deleteReview } from "../controllers/review.js";

export const routerReview = express.Router({ mergeParams: true });
routerReview.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(createReview)
);

routerReview.delete(
  "/:reviewId",
  isLoggedIn, isReviewAuthor,
  wrapAsync(deleteReview)
);
