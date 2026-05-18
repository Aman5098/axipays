import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import TransactionTable from "./TransactionTable";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://payment-assignment.onrender.com/transactions?page=1&limit=100",
      );

      console.log(response.data);

      setTransactions(
        response.data.transactions ||
          response.data.data ||
          [],
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const successCount = transactions.filter(
    (t) => t.status?.toLowerCase() === "success",
  ).length;

  const failedCount = transactions.filter(
    (t) =>
      t.status?.toLowerCase() === "failed" ||
      t.status?.toLowerCase() === "pending",
  ).length;

  const totalVolume = transactions
    .filter(
      (t) => t.status?.toLowerCase() === "success",
    )
    .reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0,
    );

  const pieData = [
    {
      name: "Success",
      value: successCount,
    },
    {
      name: "Failed/Pending",
      value: failedCount,
    },
  ];

  const cards = [
    {
      title: "Total Transactions",
      value: transactions.length,
    },
    {
      title: "Success Volume",
      value: `$${totalVolume.toFixed(2)}`,
    },
    {
      title: "Success Count",
      value: successCount,
    },
    {
      title: "Failed + Pending",
      value: failedCount,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0B1120] text-white p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              AXIPAYS Dashboard
            </h1>

            <p className="text-slate-400 mt-2 text-lg">
              Monitor transactions and payment analytics
            </p>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-3xl font-semibold transition-all duration-300 shadow-xl hover:scale-105"
          >
            Open Checkout
          </button>
        </div>

        {/* SUMMARY CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 rounded-3xl bg-[#1E293B] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {cards.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#111827] border border-slate-700 rounded-3xl p-6 shadow-xl"
              >
                <p className="text-slate-400 text-sm mb-3">
                  {item.title}
                </p>

                <h2 className="text-4xl font-bold text-white">
                  {item.value}
                </h2>
              </motion.div>
            ))}
          </div>
        )}

        {/* CHART SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#111827] border border-slate-700 rounded-3xl p-6 shadow-xl h-[420px]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white">
                Transaction Status
              </h2>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={120}
                    label
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EXTRA ANALYTICS CARD */}
          <div className="bg-[#111827] border border-slate-700 rounded-3xl p-6 shadow-xl h-[420px] flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6">
              Analytics Overview
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-slate-400 mb-2">
                  Success Rate
                </p>

                <div className="w-full h-4 bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        transactions.length
                          ? (successCount /
                              transactions.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="text-slate-400 mb-2">
                  Failed/Pending Rate
                </p>

                <div className="w-full h-4 bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${
                        transactions.length
                          ? (failedCount /
                              transactions.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-5">
                <p className="text-slate-400 text-sm">
                  Total Revenue
                </p>

                <h2 className="text-5xl font-bold mt-2">
                  ${totalVolume.toFixed(2)}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#111827] border border-slate-700 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Transaction History
              </h2>

              <p className="text-slate-400 mt-1">
                Complete payment transaction records
              </p>
            </div>

            <input
              type="text"
              placeholder="Search transactions..."
              className="bg-[#1E293B] border border-slate-700 text-white rounded-3xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
            />
          </div>

          <TransactionTable
            transactions={transactions}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;