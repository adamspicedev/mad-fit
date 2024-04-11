import { getTestResultsForCurrentUser } from "@/actions/testResult.actions";
import { getWeightsForCurrentUser } from "@/actions/weight.actions";
import TestResultsCard from "@/components/test-results/TestResultCard";
import WeightCard from "@/components/weight/WeightCard";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const { user, userData } = await validateRequest();
  const weights = await getWeightsForCurrentUser();
  const testResults = await getTestResultsForCurrentUser();

  if (!user) {
    return redirect("sign-in");
  }

  return (
    <div className="">
      <h1 className="text-3xl">Welcome back, {userData?.firstName}!</h1>
      <div className="w-full flex flex-col md:flex-row gap-4">
        <WeightCard weights={weights?.data ?? []} />
        <TestResultsCard testResults={testResults?.data ?? []} />
      </div>
    </div>
  );
};

export default DashboardPage;
