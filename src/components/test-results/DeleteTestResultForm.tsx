"use client";

import { deleteWeight } from "@/actions/weight.actions";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteTestResult } from "@/actions/testResult.actions";

interface DeleteTestResultFormProps {
  id: string;
}

const DeleteTestResultForm = ({ id }: DeleteTestResultFormProps) => {
  const [isTransitionStarted, startTransition] = useTransition();
  const router = useRouter();

  const deleteTestResultClicked = async () => {
    const res = await deleteTestResult(id);

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
        description: "Test Result deleted successfully.",
      });
    }
    startTransition(router.refresh);
  };

  return (
    <Button
      onClick={deleteTestResultClicked}
      variant="destructive"
      color="primary"
    >
      Delete
    </Button>
  );
};

export default DeleteTestResultForm;
