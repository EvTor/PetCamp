import mongoose from "mongoose";
import { Review } from "./review.js";
//reference to schema
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  price: {
    type: Number,
    required: true,
    min: 5,
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
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.post("findOneAndDelete", async (camp) => {
  await Review.deleteMany({ _id: { $in: camp.reviews } });
});

export const Campground = mongoose.model("Campground", CampgroundSchema);
