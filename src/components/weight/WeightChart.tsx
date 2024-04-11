"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { WeightCardProps } from "./WeightCard";

const WeightChart = ({ weights }: WeightCardProps) => {
  const data = weights.map((weight) => ({
    date: new Intl.DateTimeFormat("en-NZ").format(weight.date),
    weight: weight.weight,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#E11D48"
            fill="#E11D48"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
