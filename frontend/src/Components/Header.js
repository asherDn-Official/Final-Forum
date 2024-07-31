import React, { useState } from "react";
import "./Header.css";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  //const [isVisiblesdfdsf, setIsVisttibleswe234] = useState(false);

  // const toggleVisibility2323edrfe = () => {
  //   setIsVisttibleswe234(!isVisiblesdfdsf);
  // };
  // const [isVisibldfesdfdsfdsadff, setIsdssdVdsddisttibleswe234] =
  //   useState(false);

  // const toggleVfsdfsf2323edrfe = () => {
  //   setIsdssdVdsddisttibleswe234(!isVisibldfesdfdsfdsadff);
  // };

  // const [isVisiblefOthemaninnavbar, setIsVisiblefo3244rthwsmainfiv] =
  //   useState(false);

  // const toggleVisibility = () => {
  //   setIsVisiblefo3244rthwsmainfiv(!isVisiblefOthemaninnavbar);
  // };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="Mainsfo34344">
      <div className="navs">
        <Link style={{ background: "transparent" }} to="/" className="title">
          <img
            className="ImageNavbrsixecontrol"
            src="/images/footerlogo.webp"
            alt=""
          />
        </Link>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to="https://revnitro.com/">Home</NavLink>
          </li>
          <li>
            <NavLink to="https://blog.revnitro.com/">Blog</NavLink>
          </li>
          <li>
            <NavLink to="https://revnitro.com/ClassifiedsPage.html">
              Classifieds
            </NavLink>
          </li>
          <li>
            <NavLink to="https://revnitro.com/commingsoon.html">Shop</NavLink>
          </li>
          <li>
            <NavLink className="active" to="/" target="_blank">
              Forum
            </NavLink>
          </li>
          <li>
            <NavLink to="https://revnitro.com/car&bike-event.html">
              Events
            </NavLink>
          </li>
          <li>
            <NavLink to="https://revnitro.com/team.html">Team</NavLink>
          </li>
          <li>
            <NavLink to="https://forms.revnitro.com/Contact">
              Contact Us
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
