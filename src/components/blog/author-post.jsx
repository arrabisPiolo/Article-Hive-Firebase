import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentContext } from "../context/content.context";
import "./post.scss";

const Post = () => {
  const { authoruid } = useParams(); // retrieve post id from URL parameter
  const { contents } = useContext(ContentContext);
  const [matchingPosts, setMatchingPosts] = useState([]); // State to store matching posts

  useEffect(() => {
    const filteredPosts = contents.filter(
      (post) => post.authoruid === authoruid
    );
    setMatchingPosts(filteredPosts);
  }, [contents, authoruid]);

  if (matchingPosts.length === 0) {
    return <div>No posts found with the specified postId</div>;
  }

  return (
    <>
      {matchingPosts.map((post) => (
        <div className="post-container" key={post.id}>
          <span className="title">{post.title}</span>
          <p className="content">{post.content}</p>
        </div>
      ))}
    </>
  );
};

export default Post;
