import { signOut } from "@/actions/auth.actions";
import { Button } from "../ui/button";

const SignOutForm = () => {
  return (
    <form action={signOut}>
      <Button type="submit">Sign Out</Button>
    </form>
  );
};

export default SignOutForm;
