"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestResultSchema, WeightSchema } from "@/types";
import { z } from "zod";
import { createWeight } from "@/actions/weight.actions";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createTestResult } from "@/actions/testResult.actions";

const CreateFitnessTestResultForm = () => {
  const [isTransitionStarted, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof TestResultSchema>>({
    resolver: zodResolver(TestResultSchema),
    defaultValues: {
      date: "",
      pressUps: "",
      parkLap: "",
      stepUp: "",
      sledPush: "",
      chestPress: "",
      plank: "",
    },
  });

  async function onSubmit(values: z.infer<typeof TestResultSchema>) {
    const res = await createTestResult(values);

    if (res.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error,
      });
    } else {
      toast({
        variant: "default",
        title: "Success",
        description: "Test result added successfully.",
      });
    }
    startTransition(router.refresh);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" placeholder="04/04/2004" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pressUps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Press Ups <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sledPush"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sled Push <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parkLap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Timed Lap <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stepUp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Step Ups <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chestPress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Chest Press <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Plank <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateFitnessTestResultForm;
