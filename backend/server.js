import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router as transactionRoutes} from "./routes/transaction.js";

dotenv.config();
export const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
export const TEST_API = process.env.TEST_API;

//express app
const app = express();
app.use(cors());
app.use(express.json())


//routes for transaction
app.use("/api/", transactionRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`connected to db... port --> ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });