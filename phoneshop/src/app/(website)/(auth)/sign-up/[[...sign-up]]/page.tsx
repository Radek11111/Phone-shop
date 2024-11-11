import { SignUp } from "@clerk/nextjs";

import React from "react";

export default async function Page() {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex bg-cover bg-center "></div>
      <div className="flex justify-center items-center">
        <SignUp />;
      </div>
    </div>
  );
}
