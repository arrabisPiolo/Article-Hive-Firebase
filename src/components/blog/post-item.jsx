import React from "react";
import { useNavigate } from "react-router-dom";
import "./post-item.scss";

const PostItem = ({
  id,
  authoruid,
  photoURL,
  author,
  title,
  content,
  createdAt,
  formattedDate,
}) => {
  const navigate = useNavigate();

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
    <li key={id}>
      <div className="post" id="post1">
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
                <span className="formatted-date">{`Posted on ${formattedDate}`}</span>
              </div>
            </div>
            <div className="content-container">
              <h1 className="title" onClick={() => navigate(`/post/${id}`)}>
                {title}
              </h1>
              <p className="content">{content}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PostItem;
