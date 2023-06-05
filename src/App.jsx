import React from "react";

import Navigation from "./routes/navigation/navigation";

import Blog from "./components/blog/blog";
import CreatePostForm from "./components/blog/create-post-form";
import IndividualPost from "./components/blog/individual-post";
import SignUp from "./routes/sign-up/sign-up";
import LogIn from "./routes/log-in/log-in";
import MyPost from "./routes/my-post/my-post";
import AuthorPosts from "./components/blog/author-post";
import EditPostForm from "./components/blog/edit-post-form";

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
          <Route path="my-post" element={<MyPost />} />
          <Route path="create-post" element={<CreatePostForm />} />
          <Route path="/edit-post/:postId" element={<EditPostForm />} />
          <Route path="/post/:postId" element={<IndividualPost />} />
          <Route path="/author/:authoruid" element={<AuthorPosts />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
