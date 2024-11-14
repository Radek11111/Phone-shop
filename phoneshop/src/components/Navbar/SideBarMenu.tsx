import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { CiLogin, CiLogout, CiMenuFries } from "react-icons/ci";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SideBarMenu() {
  const router = useRouter();

  const { isSignedIn } = useUser();
  return (
    <>
      <div className="block sm:hidden relative">
        <Sheet>
          <SheetTrigger>
            <CiMenuFries size={34} />
          </SheetTrigger>
          <SheetContent
            className={cn("px-4 w-full md:w-[400px]  [&>#closeBtn]:text-3xl ")}
          >
            <div className="">Home Dashboard Products</div>
            <div className="">
              {isSignedIn ? (
               <SignOutButton />
              ) : (
                <Button
                  className=""
                  variant="nostyle"
                  size="icon"
                  onClick={() => router.push("/sign-in")}
                >
                    <CiLogin size={40} />
                    Sign In
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
