import React from "react";
import { WeightRowSchema } from "@/types";
import { z } from "zod";
import CreateWeightForm from "./CreateWeightForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import WeightChart from "./WeightChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import WeightTable from "./WeightTable";

export interface WeightCardProps {
  weights: z.infer<typeof WeightRowSchema>[];
}

const WeightCard = ({ weights }: WeightCardProps) => {
  return (
    <Card className="my-8 min-w-[50%]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-3xl font-normal">Weight</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <h3 className="text-xl">Add a weight</h3>
          <CreateWeightForm />
        </div>
        <div className="mt-4">
          <h3 className="text-xl">Progress</h3>
          <WeightChart weights={weights} />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Show Weights</AccordionTrigger>
            <AccordionContent>
              <WeightTable weights={weights} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default WeightCard;
