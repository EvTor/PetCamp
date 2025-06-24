import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  body: String,
});

export const Review = mongoose.model("Review", reviewSchema);
