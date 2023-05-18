import { useState, useContext } from "react";

import FormInput from "../form-input/form-input";
import logo from "../../assets/welcome-logo1.png";
import logo1 from "../../assets/article-hive-logo1.png";
import { UserContext } from "../context/user.context";

import {
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  signInWithGitHubPopUp,
} from "../../utils/firebase/firebase.utils";

import "./log-in-form.scss";
import { useNavigate } from "react-router-dom";

const defaultFormFields = {
  email: "",
  password: "",
};

const LogIn = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      await createUserDocumentFromAuth(user);
      setCurrentUser(user);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const signInWithGithub = async () => {
    try {
      const { user } = await signInWithGitHubPopUp();
      await createUserDocumentFromAuth(user);
      setCurrentUser(user);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { user } = await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      setCurrentUser(user);
      resetFormFields();
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("no user accociated with this email");
          break;
        default:
          console.log(error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="login-container">
      <div className="welcome-logo-container">
        <img src={logo} alt="" />
      </div>

      <div className="sign-in-container">
        <img className="beehive" src={logo1} alt="" />
        <h2>Already have an account?</h2>
        <span>Sign in with your email and password</span>
        <form onSubmit={handleSubmit}>
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
          <button className="signin-btn" type="submit">
            Sign In
          </button>
          <div className="divider">
            <p className="text-center">OR</p>
          </div>
        </form>

        <div className="buttons-container">
          <button
            type="button"
            className="button google"
            onClick={signInWithGoogle}
          >
            <span className="button-icon"></span>
            Sign In With Google
          </button>
          <button
            type="button"
            className="button github"
            onClick={signInWithGithub}
          >
            <span className="button-icon"></span>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
