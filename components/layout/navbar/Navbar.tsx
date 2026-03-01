"use client"

import { useState } from "react";
import DesktopNav from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>

      {/* Desktop Navbar  */}
      <DesktopNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* Fullscreen Mobile Menu */}
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default Navbar;