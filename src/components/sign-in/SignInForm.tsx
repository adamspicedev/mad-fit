"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createGoogleAuthorizationURL,
  resendVerificationEmail,
  signIn,
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
import { SignInSchema } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";
import Separator from "../separator/Seperator";
import { FaGoogle } from "react-icons/fa";

const SignInForm = () => {
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

  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    const res = await signIn(values);
    if (res.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error,
      });

      if (res?.key === "email_not_verified") {
        setShowResendVerificationEmail(true);
      }
    } else if (res.success) {
      toast({
        variant: "default",
        title: "Success",
        description: "Signed in successfully",
      });

      router.push("/dashboard");
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
        <FaGoogle className="mr-4" /> Sign in with Google
      </Button>
      <Separator text="Or sign in with your email" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="jane.doe@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign In
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

export default SignInForm;
