import { getTestResultsForCurrentUser } from "@/actions/testResult.actions";
import { getWeightsForCurrentUser } from "@/actions/weight.actions";
import SignOutForm from "@/components/sign-out/SignOutForm";
import TestResultsCard from "@/components/test-results/TestResultCard";
import WeightCard from "@/components/weight/WeightCard";
import { validateRequest } from "@/lib/auth";
import { TestResultRowSchema } from "@/types";
import { redirect } from "next/navigation";
import { z } from "zod";

const DashboardPage = async () => {
  const { user } = await validateRequest();
  const weights = await getWeightsForCurrentUser();
  const testResults = await getTestResultsForCurrentUser();

  if (!user) {
    return redirect("sign-in");
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <WeightCard weights={weights?.data ?? []} />
      <TestResultsCard testResults={testResults?.data ?? []} />
    </div>
  );
};

export default DashboardPage;
