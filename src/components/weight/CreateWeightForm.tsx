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
import { WeightSchema } from "@/types";
import { z } from "zod";
import { createWeight } from "@/actions/weight.actions";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const CreateWeightForm = () => {
  const [isTransitionStarted, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof WeightSchema>>({
    resolver: zodResolver(WeightSchema),
    defaultValues: {
      weight: "",
      date: "",
    },
  });

  async function onSubmit(values: z.infer<typeof WeightSchema>) {
    const res = await createWeight(values);

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
        description: "Weight added successfully.",
      });
    }
    startTransition(router.refresh);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Weight <span className="text-red-500">*</span>
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
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateWeightForm;
