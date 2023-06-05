import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/context/user.context";
import { signOutUser } from "../../utils/firebase/firebase.utils";

import "./navigation.scss";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuColor, setMenuColor] = useState("black"); // Add state to track menu color

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/"); // Navigate to the home page after sign out
  };

  const handleMenuClick = () => {
    if (menuColor === "black") {
      setMenuColor("white"); // Change the menu color to white if it's black
    } else {
      setMenuColor("black"); // Change the menu color to black if it's white
    }
  };

  const handleNavLinkClick = () => {
    setOpen(false); // Close the navlinks-container toggle
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 777) {
        setTransitionEnabled(true);
      } else {
        setTransitionEnabled(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="navigation">
        <div className="navigation-container">
          <div className="logo-container">
            <Link to="/">
              <img className="nav-logo" src="/article-hive-low.png" alt="" />
            </Link>
          </div>
          <div
            className="navlinks-container"
            style={{
              width: "100%",
              transform: open ? "translateX(0px)" : "",
              transition: transitionEnabled ? "transform 0.5s ease" : "none", // Apply transition only when enabled
            }}
          >
            {currentUser ? (
              <>
                <Link
                  className="nav-link create-post-link"
                  to="/create-post"
                  onClick={window.innerWidth <= 777 ? handleNavLinkClick : null}
                >
                  Create Post
                </Link>
                <Link
                  className={`nav-link ${
                    location.pathname === "/my-post" ? "active" : ""
                  }`}
                  to="/my-post"
                  onClick={window.innerWidth <= 777 ? handleNavLinkClick : null}
                >
                  My Post
                </Link>
                <Link
                  className="nav-link"
                  onClick={
                    window.innerWidth <= 777
                      ? () => {
                          handleSignOut();
                          handleNavLinkClick();
                        }
                      : handleSignOut
                  }
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={`nav-link ${
                    location.pathname === "/log-in" ? "active" : ""
                  }`}
                  to="/log-in"
                  onClick={window.innerWidth <= 777 ? handleNavLinkClick : null}
                >
                  Log In
                </Link>

                <Link
                  className={`nav-link sign-up-link ${
                    location.pathname === "/sign-up" ? "active" : ""
                  }`}
                  to="/sign-up"
                  onClick={window.innerWidth <= 777 ? handleNavLinkClick : null}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <i
            onClick={() => {
              setOpen(!open);
              handleMenuClick();
            }}
            className="fas fa-bars burger-menu"
            style={{ color: menuColor }}
          ></i>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
