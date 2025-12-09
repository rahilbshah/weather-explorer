import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Chart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📊 Temperature Chart
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">📈</p>
          <p>Select a file to view temperature chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl shadow-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📊 Temperature Chart
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
            unit="°C"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temp_max"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: "#ef4444", r: 4 }}
            activeDot={{ r: 6 }}
            name="Max Temp"
          />
          <Line
            type="monotone"
            dataKey="temp_min"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Min Temp"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
