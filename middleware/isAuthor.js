import { Campground } from "../models/campground.js";

export const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (camp.author._id.toString() !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
