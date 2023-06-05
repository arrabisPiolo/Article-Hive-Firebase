import React, { useContext, useEffect, useState } from "react";
import { ContentContext } from "../context/content.context";
import { UserContext } from "../context/user.context";
import { DeletePost } from "../../utils/firebase/firebase.utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./my-post-component.scss";
import { useNavigate } from "react-router-dom";

const MyPostComponent = () => {
  const { contents } = useContext(ContentContext);
  const { currentUser } = useContext(UserContext);

  const [filteredMatchingPosts, setFilteredMatchingPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const filteredPosts = contents.filter(
        (post) => post.authoruid === currentUser.uid
      );

      setFilteredMatchingPosts(filteredPosts);
    }
  }, [contents, currentUser]);

  const handleDelete = async (authoruid, postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      // Delete the post from Firebase
      await DeletePost(authoruid, postId);
      window.location.reload(); // Reload the page
      toast.error("Deletion complete. The post has been successfully removed.");
    }
  };
  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const getTimeElapsed = (createdAt) => {
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
  const sortedDataArray = filteredMatchingPosts.sort((a, b) => b.id - a.id);

  return (
    <div className="author-post-container">
      {currentUser && (
        <div className="black-container">
          <div className="author-profile-container">
            <img className="author-profile" src={currentUser.photoURL} alt="" />
            <h3>{currentUser.displayName}</h3>
          </div>
        </div>
      )}
      {filteredMatchingPosts.length === 0 ? (
        <div className="no-post">No posts found</div>
      ) : (
        <div className="posts-container">
          <ul>
            {sortedDataArray.map(
              ({
                id,
                authoruid,
                photoURL,
                author,
                title,
                content,
                imageUrl,
                createdAt,
                formattedDate,
              }) => (
                <li key={id}>
                  <div className="post" id="post1">
                    <div className="image-container">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="img-header"
                          href="#post1"
                          onClick={() => navigate(`/post/${id}`)}
                        />
                      )}
                    </div>
                    <div className="bottom">
                      <div className="profile-pic-container">
                        <img className="profile1" src={photoURL} alt={author} />
                      </div>
                      <div className="article-container">
                        <div>
                          <span className="author1">{author}</span>
                          <div className="time-stamp">
                            <span className="time-elapsed">
                              {getTimeElapsed(createdAt)}
                            </span>
                            <span className="middle-dot">&#xB7;</span>
                            <span className="formatted-date">
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                        <div className="content-container">
                          <h1
                            className="title"
                            onClick={() => navigate(`/post/${id}`)}
                          >
                            {title}
                          </h1>
                          <p className="content">{content}</p>
                        </div>

                        <div className="edit-delete-button-container">
                          <button
                            className="my-post-btn edit-button"
                            onClick={() => handleEdit(id)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                            <span className="tooltiptext">
                              Edit <span className="triangle"></span>
                            </span>
                          </button>
                          <button
                            className="my-post-btn delete-button"
                            onClick={() => handleDelete(authoruid, id)}
                            title="delete"
                          >
                            <i className="fas fa-trash"></i>
                            <span className="tooltiptext">
                              Delete <span className="triangle"></span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyPostComponent;
