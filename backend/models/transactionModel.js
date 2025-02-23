import mongoose from "mongoose";

const Schema = mongoose.Schema;


//Transaction schema for the data given
const transactionSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
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
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    sold: {
      type: Boolean,
      required: true,
    },
    dateOfSale: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TransactionModel = mongoose.model("Transaction", transactionSchema); // Collection will be 'transactions'




