import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

//Set path in ES module
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config({ path: path.join(__dirname, '.env') });

const DB_PATH = process.env.DB_PATH;
//Mongoose integration

export const connectMDB = async () => {
  try {
    await mongoose.connect(DB_PATH);
    console.log("Connected to Mongo");
  } catch (err) {
    console.log("Mongo connection error");
    console.log(err);
  }
};
