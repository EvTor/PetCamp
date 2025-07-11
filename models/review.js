import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  body: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Review = mongoose.model("Review", reviewSchema);
