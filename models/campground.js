import mongoose from "mongoose";
//reference to schema
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

export const Campground = mongoose.model("Campground", CampgroundSchema);
