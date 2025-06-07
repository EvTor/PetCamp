import express from "express";
import mongoose from "mongoose";
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
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

//set ejs 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//router
app.get('/', async (req, res) => {
    res.render('home')
})

serverStart();

