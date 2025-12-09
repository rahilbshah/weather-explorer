import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data to display.</p>;
  // Expect data array of objects with date and temperature fields
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="temp_max"
          stroke="#ff7300"
          name="Max Temp"
        />
        <Line
          type="monotone"
          dataKey="temp_min"
          stroke="#387908"
          name="Min Temp"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
