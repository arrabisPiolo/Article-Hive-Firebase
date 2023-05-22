import React from "react";
import Home from "./components/home/home";
import Navigation from "./routes/navigation/navigation";
import Contact from "./components/contact/contact";
import Blog from "./components/blog/blog";
import CreatePostForm from "./components/blog/create-post-form";
import Post from "./components/blog/post";
import SignUp from "./routes/sign-up/sign-up";
import LogIn from "./routes/log-in/log-in";
import AuthorPosts from "./components/blog/author-post";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Blog />} />
          <Route path="log-in" element={<LogIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="contact" element={<Contact />} />
          <Route path="create-post" element={<CreatePostForm />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/author/:authoruid" element={<AuthorPosts />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
