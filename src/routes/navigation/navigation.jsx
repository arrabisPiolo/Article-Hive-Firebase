import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../../components/context/user.context";
import { signOutUser } from "../../utils/firebase/firebase.utils";
import "./navigation.scss";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <div className="navigation">
        <div className="navigation-container">
          <div className="logo-container">
            <Link to="/">
              <img className="nav-logo" src="/article-hive-low.png" alt="" />
            </Link>
          </div>
          <div className="navlinks-container">
            <Link
              className={`nav-link ${
                location.pathname === "/my-post" ? "active" : ""
              }`}
              to="/my-post"
            >
              My Post
            </Link>

            {currentUser ? (
              <Link className="nav-link" onClick={signOutUser}>
                Sign Out
              </Link>
            ) : (
              <>
                <Link
                  className={`nav-link ${
                    location.pathname === "/log-in" ? "active" : ""
                  }`}
                  to="/log-in"
                >
                  Log In
                </Link>

                <Link
                  className={`nav-link sign-up-link ${
                    location.pathname === "/sign-up" ? "active" : ""
                  }`}
                  to="/sign-up"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          {/* <i className="fas fa-bars hamburger-menu" onClick={toggleMenu}></i> */}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
