"use client";

import { useState } from "react";
import Container from "../Container";
import Row from "../Row";
import IconsGroup from "./IconsGroup";
import Logo from "./Logo";
import SideBarMenu from "./SideBarMenu";

const Navbar = () => {

   const [openSearchBar, setOpenSearchBar] = useState(false);
  const [openCartBar, setOpenCartBar]= useState(false)
  return (
    <nav className="bg-slate-200 shadow-md h-full">
      <Container>
        <Row className=" justify-between">
          <SideBarMenu />
          <Logo />
          <IconsGroup
            openCartBar={openCartBar}
            openSearchBar={openSearchBar}
            setOpenCartBar={setOpenCartBar}
            setOpenSearchBar={setOpenSearchBar}
          />
        </Row>
      </Container>
    </nav>
  );
};

export default Navbar;
