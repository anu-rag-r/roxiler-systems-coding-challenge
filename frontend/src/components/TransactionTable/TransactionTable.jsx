import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionStatistics from "../TransactionStatistics/TransactionStatistics";
import TransactionsBarChart from "../TransactionBarchart/TransactionBarchart";
import "./TransactionTable.css"; // Import CSS file for styling

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState("March"); // Default month
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;
  const [totalPages, setTotalPages] = useState(1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/transactions",
          {
            params: { month, search, page, perPage },
          }
        );

        setTransactions(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [month, search, page]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1);
  };

  return (
    <div className="transaction-container">
      <h1>Transaction Dashboard</h1>

      {/* Month Dropdown & Search Box */}
      <div className="controls">
        <select value={month} onChange={handleMonthChange}>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by title, description, or price..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Transactions Table */}
      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{txn.id}</td>
                  <td>{txn.title}</td>
                  <td>${txn.price}</td>
                  <td>{txn.description}</td>
                  <td>{txn.category}</td>
                  <td>
                    <img src={txn.image} alt={txn.title} width="50" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <div className="pagination-info">
          Page {page} of {totalPages}
        </div>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Pass selected month as prop */}
      <TransactionStatistics month={month} />
      <TransactionsBarChart month={month} />
    </div>
  );
};

export default TransactionTable;
