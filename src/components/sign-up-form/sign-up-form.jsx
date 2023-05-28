import React, { useState } from "react";
import logo1 from "../../assets/article-hive-logo1.png";
import "./sign-up-form.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import FormInput from "../form-input/form-input";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  signInWithGitHubPopUp,
} from "../../utils/firebase/firebase.utils";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpform = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const navigate = useNavigate();
  const resetFeilds = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Password do not Match");
      return;
    }
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password,
        displayName
      );

      await createUserDocumentFromAuth(user, { displayName });
      navigate("/");
      resetFeilds();
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Cannot create user, email already in use");
          break;
        case "auth/weak-password":
          alert("password must be at least 6 characters");
          break;
        default:
          console.log(error);
      }
    }
  };

  const signInWithProvider = async (signInFunction) => {
    try {
      const { user } = await signInFunction();
      await createUserDocumentFromAuth(user);

      navigate("/");
      toast.success("Signed In Successfully");
    } catch (error) {
      toast.error("Error Signing In");
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form-container">
        {/* <img className="beehive" src={logo1} alt="" /> */}
        <span className="sign-up-form-text">
          Sign up with your email and password
        </span>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Display Name"
            inputProps={{
              type: "text",
              required: true,
              name: "displayName",
              value: displayName,
              onChange: handleChange,
            }}
          />

          <FormInput
            label="Email"
            inputProps={{
              type: "email",
              required: true,
              name: "email",
              value: email,
              onChange: handleChange,
            }}
          />

          <FormInput
            label="Password"
            inputProps={{
              type: "password",
              required: true,
              name: "password",
              value: password,
              onChange: handleChange,
            }}
          />

          <FormInput
            label="Confirm Password"
            inputProps={{
              type: "password",
              required: true,
              name: "confirmPassword",
              value: confirmPassword,
              onChange: handleChange,
            }}
          />
          <button className="sign-up-btn" type="submit">
            Sign up
          </button>
          <div className="divider">
            <p className="text-center">OR</p>
          </div>
        </form>
        <div className="buttons-container">
          <button
            type="button"
            className="button google"
            onClick={() => {
              signInWithProvider(signInWithGooglePopup);
            }}
          >
            <span className="button-icon"></span>
            Sign Up using google
          </button>
          <button
            type="button"
            className="button github"
            onClick={() => {
              signInWithProvider(signInWithGitHubPopUp);
            }}
          >
            <span className="button-icon"></span>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpform;
