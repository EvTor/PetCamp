import express, { Router } from "express";
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { connectMDB } from "./dbConnection.js";
import { Campground } from "./models/campground.js";
import { Review } from "./models/review.js";
import methodOverride from "method-override";
import morgan from "morgan";
import ejsMate from "ejs-mate";
import { AppError } from "./utils/AppError.js";
import { wrapAsync } from "./utils/catchAsync.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import { routerUser } from "./routes/user.js";
import { routerCamp } from "./routes/campground.js";
import { routerReview } from "./routes/review.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "./models/user.js";

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
app.use(cookieParser("secret string")); //=> to parse cookies

//Middleware for session
const sessionConfig = {
  secret: "superSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
  },
  //store: SOME DB=> redis/ mongo...
};
app.use(session(sessionConfig)); //=> to work with sessions

//Middleware method-override to change post form => put/patch
app.use(methodOverride("_method"));

//Middleware logger morgan
//app.use(morgan("tiny"));

//Middleware for flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Middleware for static files
app.use(express.static(path.join(__dirname, "public")));

//Middleware for authentication by PASSPORT
app.use(passport.initialize());
app.use(passport.session()); //session shoud be used before passport.session
passport.use(new LocalStrategy(User.authenticate())); //use LocalStrategy for the User model => the method authenticat is automatic by PASSPORT - black magic

passport.serializeUser(User.serializeUser()); //how to store on the session
passport.deserializeUser(User.deserializeUser()); //how unstore on the session

//router
app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.cookie("test", "cookieNew", { signed: true });
    console.log(req.signedCookies);
    if (req.session.count) {
      req.session.count += 1;
    } else {
      req.session.count = 1;
    }
    const count = req.session.count;
    res.render("home", { count });
  })
);

app.use("/users", routerUser);
app.use("/campgrounds", routerCamp);
app.use("/campgrounds/:id/reviews", routerReview);

app.all(
  /(.*)/,
  wrapAsync(async (req, res, next) => {
    next(new AppError("Page not found", 404));
  })
);

//Error handling - middleware

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(statusCode).render("error", { err });
});

// app.get('/addFakeData', async(req, res)=>{
//     const newCamp = new Campground({title: 'TestCamp1', price: 1, description: 'Test camp test', location: 'USA'});
//     await newCamp.save();
//     console.log(newCamp);
//     res.send(newCamp)
// })
