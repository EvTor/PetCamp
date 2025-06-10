import express from "express";
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { connectMDB } from "./dbConnection.js";
import { Campground } from "./models/campground.js";
import methodOverride from "method-override";

//import methodOverride from "method-override";

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

//set ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middleware parsers
app.use(express.urlencoded({ extended: true })); //=> to parse url
app.use(express.json()); //=> to parse json

//Middleware method-override to change post form => put/patch
app.use(methodOverride("_method"));

//router
app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/form");
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.post("/campgrounds", async (req, res) => {
  const newCampground = await new Campground(req.body.campground).save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body.campground);
  res.redirect(`/campgrounds/${id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

// app.get('/addFakeData', async(req, res)=>{
//     const newCamp = new Campground({title: 'TestCamp1', price: 1, description: 'Test camp test', location: 'USA'});
//     await newCamp.save();
//     console.log(newCamp);
//     res.send(newCamp)
// })
