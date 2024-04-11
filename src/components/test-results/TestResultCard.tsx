import React from "react";
import { TestResultRowSchema, WeightRowSchema } from "@/types";
import { z } from "zod";
import CreateWeightForm from "./CreateFitnessTestResultForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import TestResultsTable from "./TestResultsTable";
import TestResultsChart from "./TestResultsChart";
import CreateFitnessTestResultForm from "./CreateFitnessTestResultForm";

export interface TestResultCardProps {
  testResults: {
    id: string;
    date: Date;
    userId: string;
    pressUps: string | null;
    parkLap: string | null;
    stepUp: string | null;
    sledPush: string | null;
    chestPress: string | null;
    plank: string | null;
  }[];
}

const TestResultCard = ({ testResults }: TestResultCardProps) => {
  return (
    <Card className="my-8 min-w-[50%]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-3xl font-normal">Fitness Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                {" "}
                <h3 className="text-xl">Add a Test Result</h3>
              </AccordionTrigger>
              <AccordionContent>
                <CreateFitnessTestResultForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-4">
          <h3 className="text-xl">Progress</h3>
          <TestResultsChart testResults={testResults} />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Show Test Results</AccordionTrigger>
            <AccordionContent>
              <TestResultsTable testResults={testResults} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TestResultCard;
