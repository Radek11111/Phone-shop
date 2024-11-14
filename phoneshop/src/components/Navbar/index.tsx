"use client";

import Container from "../Container";
import Row from "../Row";
import IconsGroup from "./IconsGroup";
import Logo from "./Logo";
import SideBarMenu from "./SideBarMenu";

const Navbar = () => {
  return (
    <nav className="bg-slate-200 shadow-md h-full">
      <Container>
        <Row className=" justify-between">
          <SideBarMenu />
          <Logo />
          <IconsGroup />
        </Row>
      </Container>
    </nav>
  );
};

export default Navbar;
