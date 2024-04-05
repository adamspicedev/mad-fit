"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createGoogleAuthorizationURL,
  resendVerificationEmail,
  signUp,
} from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema } from "@/types";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useCountdown } from "usehooks-ts";
import Separator from "../separator/Seperator";
import { toast } from "../ui/use-toast";

const SignUpForm = () => {
  const [countRunning, setCountRunning] = useState(false);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60,
      intervalMs: 1000,
    });

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      resetCountdown();
      setCountRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const [showResendVerificationEmail, setShowResendVerificationEmail] =
    useState(false);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const res = await signUp(values);

    if (res.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          res.key === "user_username_unique"
            ? "User already exists"
            : res.error,
      });
    } else {
      toast({
        variant: "default",
        title: "Success",
        description: "Please check your email to verify your account.",
      });
      setShowResendVerificationEmail(true);
      startCountdown();
    }
  }

  const onResendVerificationEmail = async () => {
    const res = await resendVerificationEmail(form.getValues("email"));
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      toast({
        variant: "default",
        description: res.success,
      });
      setCountRunning(true);
      startCountdown();
    }
  };

  const onGoogleSignInClicked = async () => {
    console.debug("Google sign in clicked");
    const res = await createGoogleAuthorizationURL();
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      window.location.href = res.data.toString();
    }
  };

  return (
    <>
      <Button
        onClick={onGoogleSignInClicked}
        variant="outline"
        className="w-full mb-4"
      >
        <FaGoogle className="mr-4" /> Sign up with Google
      </Button>
      <Separator text="Or sign up with your email" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="jane.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </form>
        {showResendVerificationEmail && (
          <Button
            className="min-w-full mt-4"
            disabled={count > 0 && count < 60}
            onClick={onResendVerificationEmail}
          >
            {countRunning
              ? "Can send another in email in "
              : "Resend verification email"}{" "}
            {count > 0 && count <= 60 && countRunning && `${count}s`}
          </Button>
        )}
      </Form>
    </>
  );
};

export default SignUpForm;
