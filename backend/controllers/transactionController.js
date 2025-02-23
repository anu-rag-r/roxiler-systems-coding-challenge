import { TransactionModel } from "../models/transactionModel.js";
import { TEST_API, PORT } from "../server.js";

//get all transactions
export const createTransaction = async (req, res) => {
  try {
    const response = await fetch(TEST_API);
    const data = await response.json();

    await TransactionModel.deleteMany({});
    await TransactionModel.insertMany(data);

    res.status(200).json({ message: "Added to DB", count: data.length });
  } catch (error) {
    console.error("Error fetching : ", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const listTransaction = async (req, res) => {
  try {
    const { month, search = "", page = 1, perPage = 10 } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    //month to number
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    const searchRegex = new RegExp(search, "i");

    const query = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthIndex + 1],
      },
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { price: isNaN(search) ? undefined : Number(search) },
      ].filter(Boolean),
    };

    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    const transaction = await TransactionModel.find(query)
      .skip(skip)
      .limit(limit);

    const total = await TransactionModel.countDocuments(query);

    res.status(200).json({
      data: transaction,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    });
  } catch (error) {
    console.error("Transaction Error: ", error.message);
    res.status(500).json({ message: "Failed to fetch the transaction" });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    const transactions = await TransactionModel.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthIndex + 1],
      },
    });

    let totalAmount = 0;
    let itemsSold = 0;
    let itemsNotSold = 0;

    transactions.forEach((transaction) => {
      if (transaction.sold) {
        itemsSold += 1;
        totalAmount += Number(transaction.price);
      } else {
        itemsNotSold += 1;
      }
    });

    res.status(200).json({
      month,
      totalAmount,
      itemsSold,
      itemsNotSold,
    });
  } catch (error) {
    console.error("Error fetching the statistics details: ", error.message);
    res.status(500).json({ message: "Failed to fetch statistics data" });
  }
};

export const getBarChart = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    const transactions = await TransactionModel.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthIndex + 1],
      },
    });

    const priceRanges = [
      { range: "0-100", min: 0, max: 100, count: 0 },
      { range: "101-200", min: 101, max: 200, count: 0 },
      { range: "201-300", min: 201, max: 300, count: 0 },
      { range: "301-400", min: 301, max: 400, count: 0 },
      { range: "401-500", min: 401, max: 500, count: 0 },
      { range: "501-600", min: 501, max: 600, count: 0 },
      { range: "601-700", min: 601, max: 700, count: 0 },
      { range: "701-800", min: 701, max: 800, count: 0 },
      { range: "801-900", min: 801, max: 900, count: 0 },
      { range: "901-above", min: 901, max: Infinity, count: 0 },
    ];

    transactions.forEach((transactions) => {
      const price = transactions.price;

      for (let range of priceRanges) {
        if (price >= range.min && price <= range.max) {
          range.count += 1;
          break;
        }
      }
    });

    const barChartData = priceRanges.map(({ range, count }) => ({
      priceRange: range,
      itemCount: count,
    }));

    res.status(200).json({ month, barChartData });
  } catch (error) {
    console.error("Error generating barchart data: ", error.message);
    res.status(500).json({ message: "Failed to generate barchart data" });
  }
};

export const getPieChart = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const monthIndex = new Date(`${month} 1, 2000`).getMonth();

    const transactions = await TransactionModel.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthIndex + 1],
      },
    });

    const categoryCounts = {};

    transactions.forEach((transactions) => {
      const category = transactions.category || "uncategorized";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const pieChartData = Object.entries(categoryCounts).map(
      ([category, count]) => ({
        category,
        itemCount: count,
      })
    );

    res.status(200).json({ month, pieChartData });
  } catch (error) {
    console.error("Error generating the pie chart: ", error.message);
    res.status(500).json({ message: "Failed to generate pie chart data" });
  }
};

export const getAllData = async (req, res) => {
  try {
    const { month, search = "" } = req.query;

    if(!month){
      return res.status(400).json({message: "Month is required"});
    }

    const transactionsAPI = `http://localhost:${PORT}/api/transactions?month=${month}&search=${search}`;
    const statisticsAPI = `http://localhost:${PORT}/api/statistics?month=${month}`;
    const barChartAPI = `http://localhost:${PORT}/api/barchart?month=${month}`;
    const piechartAPI = `http://localhost:${PORT}/api/piechart?month=${month}`;

    const [transactionResponse, statsResponse, barChartResponse, pieChartResponse] = await Promise.all([
      fetch(transactionsAPI),
      fetch(statisticsAPI),
      fetch(barChartAPI),
      fetch(piechartAPI)
    ])

    const allData = {
      transactions: await transactionResponse.json(),
      statistics: await statsResponse.json(),
      barChart: await barChartResponse.json(),
      pieChart: await pieChartResponse.json()
    };

    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching all the data: ", error.message);
    res.status(500).json({ message: "Failed to fetch all the data" });
  }
};
