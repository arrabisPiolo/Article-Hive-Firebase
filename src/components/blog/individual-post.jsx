import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContentContext } from "../context/content.context";
import "./individual-post.scss";

const IndividualPost = () => {
  const { postId } = useParams(); // retrieve post id from URL parameter
  const { contents } = useContext(ContentContext);
  const post = contents.find((post) => post.id === parseInt(postId)); // find post with matching id
  const navigate = useNavigate();

  if (!post) {
    return <div>Post not found</div>; // handle case where post is not found
  }
  const {
    authoruid,
    photoURL,
    author,
    title,
    content,
    imageUrl,
    createdAt,
    formattedDate,
  } = post;

  const getTimeElapsed = () => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - createdAt;

    // Calculate time in seconds, minutes, hours, and days
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes === 1) {
      return `1 minute ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours === 1) {
      return `1 hour ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return `1 day ago`;
    } else {
      return `${days} days ago`;
    }
  };

  return (
    <>
      <div className="post-container">
        <div className="post">
          <div className="image-container">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="img-header"
                href="#post1"
              />
            )}
          </div>
          <div className="bottom">
            <div className="profile-pic-container">
              <img
                className="profile"
                src={photoURL}
                alt={author}
                onClick={() => navigate(`/author/${authoruid}`)}
              />
            </div>
            <div className="article-container">
              <div>
                <span
                  className="author"
                  onClick={() => navigate(`/author/${authoruid}`)}
                >
                  {author}
                </span>
                <div className="time-stamp">
                  <span className="time-elapsed">{getTimeElapsed()}</span>
                  <span className="middle-dot">&#xB7;</span>
                  <span className="formatted-date">{formattedDate}</span>
                </div>
              </div>
              <div className="content-container">
                <h1 className="title1">{title}</h1>
                <p className="content1">{content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualPost;
