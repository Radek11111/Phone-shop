"use client";
import MaxWidthWrapper from "../MaxWidthWrapper";
import IconsGroup from "./IconsGroup";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="bg-slate-200 shadow-md">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center max-w-4xl mx-auto p-3 ">
          <Logo />
          <IconsGroup />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
