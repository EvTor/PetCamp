import express from "express";
import { wrapAsync } from "../utils/catchAsync.js";
import { validateCamp } from "../utils/validation.js";
import { isLoggedIn } from "../middleware/isLogggedIn.js";
import { isAuthor } from "../middleware/isAuthor.js";
import {
  createNewCampground,
  deleteCampground,
  getCampground,
  index,
  renderNewForm,
  renderUpdateForm,
  updateCampground,
} from "../controllers/campground.js";

export const routerCamp = express.Router({ mergeParams: true });

routerCamp.get("/new", isLoggedIn, wrapAsync(renderNewForm));

routerCamp
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, validateCamp, wrapAsync(createNewCampground));

routerCamp
  .route("/:id")
  .get(wrapAsync(getCampground))
  .put(isLoggedIn, isAuthor, validateCamp, wrapAsync(updateCampground))
  .delete(isLoggedIn, isAuthor, wrapAsync(deleteCampground));

routerCamp.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(renderUpdateForm));
