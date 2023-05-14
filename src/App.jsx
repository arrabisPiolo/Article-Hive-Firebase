import React from "react";
import Home from "./components/home/home";
import Navigation from "./routes/navigation/navigation";
import Contact from "./components/contact/contact";
import Blog from "./components/blog/blog";
import CreatePostForm from "./components/blog/create-post-form";
import Post from "./components/blog/post";
import SignIn from "./routes/sign-in/sign-in";
import LogIn from "./routes/log-in/log-in";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Blog />} />
        <Route path="log-in" element={<LogIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="contact" element={<Contact />} />
        <Route path="create-post" element={<CreatePostForm />} />
        <Route path="/post/:postId" element={<Post />} />
      </Route>
    </Routes>
  );
};

export default App;
