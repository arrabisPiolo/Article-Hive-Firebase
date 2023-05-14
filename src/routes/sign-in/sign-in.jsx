import React from "react";
import SignUpform from "../../components/sign-up-form/sign-up-form";
import "./sign-in.scss";

const SignIn = () => {
  return (
    <div className="sign-in-container">
      <SignUpform />
    </div>
  );
};

export default SignIn;

{
  /* <div className="btns">
        <button class="github-btn">
          <span class="github-icon"></span>
          Sign up with GitHub
        </button>
        <button class="google-btn">
          <span class="google-icon"></span>
          Sign up with Google
        </button>
      </div> */
}
