"use client";

import { deleteWeight } from "@/actions/weight.actions";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface DeleteWeightFormProps {
  id: string;
}

const DeleteWeightForm = ({ id }: DeleteWeightFormProps) => {
  const [isTransitionStarted, startTransition] = useTransition();
  const router = useRouter();

  const deleteWeightClicked = async () => {
    const res = await deleteWeight(id);

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
        description: "Weight deleted successfully.",
      });
    }
    startTransition(router.refresh);
  };

  return (
    <Button onClick={deleteWeightClicked} variant="destructive" color="primary">
      Delete
    </Button>
  );
};

export default DeleteWeightForm;
