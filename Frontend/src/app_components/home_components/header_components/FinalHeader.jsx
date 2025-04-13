// FinalHeader.jsx

import React, { useRef, useState, useEffect } from "react";
import Logo from "./HeaderLogo";
import NavigationDisplay from "./NavDisplay";
import UserGreeting from "./HeaderUserGreeting";

const Header = ({ navigationText }) => {
  const navRef = useRef(null); // ✅ MODIFIED: reference to nav display element
  const [navWidth, setNavWidth] = useState(0); // ✅ MODIFIED: state to store nav width

  useEffect(() => {
    if (navRef.current) {
      setNavWidth(navRef.current.offsetLeft + navRef.current.offsetWidth); // ✅ UPDATED: measure full left + width
    }
  }, [navigationText]);

  return (
    <>
      <Logo />
      <NavigationDisplay ref={navRef} text={navigationText} />
      <UserGreeting avoidWidth={navWidth} />
    </>
  );
};

export default Header;
