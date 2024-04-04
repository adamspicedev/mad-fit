import Link from "next/link";

import SignInForm from "@/components/sign-in/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>Login to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account yet?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
