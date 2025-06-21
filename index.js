import express from "express";
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { connectMDB } from "./dbConnection.js";
import { Campground } from "./models/campground.js";
import methodOverride from "method-override";
import morgan from "morgan";
import ejsMate from "ejs-mate";
import { AppError } from "./utils/AppError.js";
import { wrapAsync } from "./utils/catchAsync.js";
import Joi from "joi";

//Set path in ES module
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

//dotenv
dotenv.config();

//Server start
const app = express();
const serverStart = () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error dirung starting the server");
    console.log(error);
  }
};
serverStart();

//Connect to mongoDB
connectMDB();

//set ejs and ejs-mate
app.engine("ejs", ejsMate); //=> for defining layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middleware parsers
app.use(express.urlencoded({ extended: true })); //=> to parse url
app.use(express.json()); //=> to parse json

//Middleware method-override to change post form => put/patch
app.use(methodOverride("_method"));

//Middleware logger morgan
app.use(morgan("tiny"));

//Middleware for Joi validation
const validateCamp = (req, res, next) => {
  const campValidatonSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required().min(3),
      price: Joi.number().required().min(0),
      image: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
  });
  const { error } = campValidatonSchema.validate(req.body);
  if (error) {
    const msg = error.details
      .map((el) => {
        el.message;
      })
      .join(",");
    throw new AppError(msg, 400);
  } else next();
};

//router
app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.render("home");
  })
);

app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
    return;
  })
);

app.get(
  "/campgrounds/new",
  wrapAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return next(new AppError("Camp not found", 404));
    }
    res.render("campgrounds/show", { campground });
  })
);

app.post(
  "/campgrounds",
  validateCamp,
  wrapAsync(async (req, res) => {
    const newCampground = await new Campground(req.body.campground).save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

app.put(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground, {
      new: true,
      runValidators: true,
    });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.get(
  "/error",
  wrapAsync(async (req, res) => {
    chick();
  })
);

app.all(
  /(.*)/,
  wrapAsync(async (req, res, next) => {
    next(new AppError("Page not found", 404));
  })
);

//Error handling - middleware

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(status).render("error", { err });
});

// app.get('/addFakeData', async(req, res)=>{
//     const newCamp = new Campground({title: 'TestCamp1', price: 1, description: 'Test camp test', location: 'USA'});
//     await newCamp.save();
//     console.log(newCamp);
//     res.send(newCamp)
// })
