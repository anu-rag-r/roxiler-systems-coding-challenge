import React, { useEffect, useState } from "react";
import "./TransactionStatistics.css";

const TransactionStatistics = ({ month }) => {
  const [stats, setStats] = useState({
    totalAmount: 0,
    itemsSold: 0,
    itemsNotSold: 0,
  });

  useEffect(() => {
    fetchStatistics(month);
  }, [month]);

  const fetchStatistics = async (selectedMonth) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/statistics?month=${selectedMonth}`
      );
      const data = await response.json();

      setStats({
        totalAmount: data.totalAmount || 0,
        itemsSold: data.itemsSold || 0,
        itemsNotSold: data.itemsNotSold || 0,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <div className="statistics-card">
      <div className="statistics-content">
        <div className="statistics-title">Statistics for {month}</div>
        <div className="statistics-price">${stats.totalAmount.toFixed(2)}</div>
        <div className="statistics-description">
          📦 Items Sold: {stats.itemsSold}
        </div>
        <div className="statistics-description">
          ❌ Items Not Sold: {stats.itemsNotSold}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;
