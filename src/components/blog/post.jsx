import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ContentContext } from "../context/content.context";
import "./post.scss";

const Post = () => {
  const { postId } = useParams(); // retrieve post id from URL parameter
  const { contents } = useContext(ContentContext);
  const post = contents.find((post) => post.id === parseInt(postId)); // find post with matching id

  if (!post) {
    return <div>Post not found</div>; // handle case where post is not found
  }

  return (
    <>
      <div className="post-container">
        <span className="title">{post.title}</span>
        <p className="content">{post.content}</p>
      </div>
    </>
  );
};

export default Post;
