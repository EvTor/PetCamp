import { Campground } from "../models/campground.js";

export const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
  return;
};

export const renderNewForm = async (req, res) => {
  res.render("campgrounds/new");
};

export const renderUpdateForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find campground");
    return res.redirect("/campgrounds");
    //return next(new AppError("Camp not found", 404));
  }
  res.render("campgrounds/edit", { campground });
};

export const getCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find campground");
    return res.redirect("/campgrounds");
    //return next(new AppError("Camp not found", 404));
  }
  res.render("campgrounds/show", {
    campground,
  });
};

export const createNewCampground = async (req, res) => {
  const newCampground = await new Campground(req.body.campground);
  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash("success", "Successfully created new camp!");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

export const updateCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body.campground, {
    new: true,
    runValidators: true,
  });
  req.flash("success", "Successfully updated Camp");
  res.redirect(`/campgrounds/${id}`);
};

export const deleteCampground = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Camp");
  res.redirect("/campgrounds");
};
