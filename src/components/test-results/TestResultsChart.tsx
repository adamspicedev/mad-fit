"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { TestResultCardProps } from "./TestResultCard";

const TestResultsChart = ({ testResults }: TestResultCardProps) => {
  const data = testResults.map((testResult) => ({
    date: new Intl.DateTimeFormat("en-NZ").format(testResult.date),
    pressUps: testResult.pressUps,
    parkLap: testResult.parkLap,
    stepUp: testResult.stepUp,
    sledPush: testResult.sledPush,
    chestPress: testResult.chestPress,
    plank: testResult.plank,
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
          <XAxis dataKey="date" vertOriginX={90} />
          <YAxis />
          <Line
            type="monotone"
            dataKey="pressUps"
            stroke="#E11D48"
            fill="#E11D48"
          />
          <Line
            type="monotone"
            dataKey="parkLap"
            stroke="#c22975"
            fill="#c22975"
          />
          <Line
            type="monotone"
            dataKey="sledPush"
            stroke="#91428d"
            fill="#91428d"
          />
          <Line
            type="monotone"
            dataKey="chestPress"
            stroke="#5b4e8c"
            fill="#5b4e8c"
          />
          <Line
            type="monotone"
            dataKey="plank"
            stroke="#344f77"
            fill="#344f77"
          />
          <Line
            type="monotone"
            dataKey="stepUp"
            stroke="#2f4858"
            fill="#2f4858"
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestResultsChart;
