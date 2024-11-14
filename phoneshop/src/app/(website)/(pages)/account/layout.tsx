
import SideBarAccount from "@/components/SideBarAccount";
import * as React from "react";


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 relative h-screen">
      <div className="">
        <div className="flex relative">
          <SideBarAccount/>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
}