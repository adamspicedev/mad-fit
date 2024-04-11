import React from "react";
import SignOutForm from "../sign-out/SignOutForm";
import { validateRequest } from "@/lib/auth";

const Header = async () => {
  const { user } = await validateRequest();
  return (
    <div className="flex justify-end border-b border-slate-100 min-h-14 mb-2">
      <div className="container flex items-center justify-end">
        {user && <SignOutForm />}
      </div>
    </div>
  );
};

export default Header;
