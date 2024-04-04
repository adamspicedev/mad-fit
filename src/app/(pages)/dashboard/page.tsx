import { signOut } from "@/actions/auth.actions";
import SignOutForm from "@/components/sign-out/SignOutForm";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("sign-in");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{JSON.stringify(user)}</p>

      <SignOutForm />
    </div>
  );
};

export default DashboardPage;
