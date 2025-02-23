import express from 'express';
import {createTransaction, listTransaction, getStatistics, getBarChart, getPieChart, getAllData} from '../controllers/transactionController.js';


export const router = express.Router()

//list of all transactions
router.get("/initialize", createTransaction );

router.get("/transactions", listTransaction);

router.get("/statistics", getStatistics);

router.get("/barchart", getBarChart);

router.get("/piechart", getPieChart);

router.get("/all-data", getAllData);


