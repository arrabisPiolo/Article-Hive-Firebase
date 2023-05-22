import React from "react";
import { useNavigate } from "react-router-dom";

const PostItem = ({
  id,
  authoruid,
  photoURL,
  author,
  title,
  content,
  imageUrl,
}) => {
  const navigate = useNavigate();
  return (
    <li key={id}>
      <div className="post">
        {imageUrl && <img src={imageUrl} alt={title} className="img-header" />}
        <div className="user-profile-container">
          <img
            className="profile"
            src={photoURL}
            alt={author}
            onClick={() => handleAuthorClick(authoruid)}
          />
          <span
            className="author"
            onClick={() => navigate(`/author/${authoruid}`)}
          >
            {author}
          </span>
        </div>

        <h1 className="title">{title}</h1>
        <div className="content-container">
          <p className="content">{content}</p>
        </div>
        <button className="btn-view" onClick={() => navigate(`/post/${id}`)}>
          View
        </button>
      </div>
    </li>
  );
};

export default PostItem;
