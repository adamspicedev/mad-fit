"use server";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteTestResultForm from "./DeleteTestResultForm";
import { TestResultCardProps } from "./TestResultCard";

const TestResultsTable = async ({ testResults }: TestResultCardProps) => {
  return (
    <Table>
      <TableCaption>A list of your recorded weights.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Press Ups</TableHead>
          <TableHead>Times Lap</TableHead>
          <TableHead>Step Ups</TableHead>
          <TableHead>Sled Push</TableHead>
          <TableHead>Chest Press</TableHead>
          <TableHead>Plank</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testResults.map((testResult) => (
          <TableRow key={`${testResult.date}_${testResult.pressUps}`}>
            <TableCell className="font-medium">
              {new Intl.DateTimeFormat("en-NZ").format(testResult.date)}
            </TableCell>
            <TableCell>{testResult.pressUps}</TableCell>
            <TableCell>{testResult.parkLap}</TableCell>
            <TableCell>{testResult.stepUp}</TableCell>
            <TableCell>{testResult.sledPush}</TableCell>
            <TableCell>{testResult.chestPress}</TableCell>
            <TableCell>{testResult.plank}</TableCell>
            <TableCell>
              <DeleteTestResultForm id={testResult.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TestResultsTable;
