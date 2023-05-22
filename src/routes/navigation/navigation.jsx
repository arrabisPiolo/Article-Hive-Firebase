import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../components/context/user.context";
import { signOutUser } from "../../utils/firebase/firebase.utils";
import "./navigation.scss";

const Navigation = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const signOutHandler = async () => {
    const response = await signOutUser();

    setCurrentUser(null);
    console.log(response);
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
            <Link className="nav-link" to="/contact">
              Contact
            </Link>

            {currentUser ? (
              <Link className="nav-link" onClick={signOutHandler}>
                Sign Out
              </Link>
            ) : (
              <>
                <Link className="nav-link" to="/log-in">
                  Log In
                </Link>

                <Link className="nav-link" to="/sign-up">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
