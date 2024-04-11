"use server";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { WeightCardProps } from "./WeightCard";
import { Button } from "../ui/button";
import { deleteWeight } from "@/actions/weight.actions";
import DeleteWeightForm from "./DeleteWeightForm";

const WeightTable = async ({ weights }: WeightCardProps) => {
  return (
    <Table>
      <TableCaption>A list of your recorded weights.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Weight</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {weights.map((weight) => (
          <TableRow key={`${weight.date}_${weight.weight}`}>
            <TableCell className="font-medium">
              {new Intl.DateTimeFormat("en-NZ").format(weight.date)}
            </TableCell>
            <TableCell>{weight.weight}</TableCell>
            <TableCell>
              <DeleteWeightForm id={weight.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WeightTable;
