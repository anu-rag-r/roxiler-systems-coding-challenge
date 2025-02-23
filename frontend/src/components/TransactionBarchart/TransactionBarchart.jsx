import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`Price Range: ${payload[0].payload.priceRange}`}</p>
        <p className="tooltip-value">{`Items: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TransactionBarchart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);

  // Fetch data when the month prop changes
  useEffect(() => {
    if (!month) return;

    fetch(`http://localhost:4000/api/barchart?month=${month}`)
      .then((res) => res.json())
      .then((data) => setBarChartData(data.barChartData))
      .catch((error) => console.error("Error fetching data:", error));
  }, [month]); // Dependency on month

  return (
    <div className="chart-container">
      <h1 className="chart-title">Price Range Distribution - {month}</h1>

      {barChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="white"
            />
            <XAxis dataKey="priceRange" tick={{ fill: "white" }} />
            <YAxis allowDecimals={false} tick={{ fill: "white" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="itemCount" fill="white" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="no-data">No data available for {month}</p>
      )}
    </div>
  );
};

export default TransactionBarchart;
