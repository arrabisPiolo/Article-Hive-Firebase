import React, { useContext, useEffect, useState } from "react";
import { ContentContext } from "../context/content.context";
import { UserContext } from "../context/user.context";
import { GetDataArray } from "../../utils/firebase/firebase.utils";

import "./author-post.scss";

const MyPostComponent = () => {
  const { contents, setContents } = useContext(ContentContext);
  const { currentUser } = useContext(UserContext);
  const [matchingPosts, setMatchingPosts] = useState([]);
  const [filteredMatchingPosts, setFilteredMatchingPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataArray = await GetDataArray();
      setContents(dataArray);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const filteredPosts = contents.filter(
        (post) => post.authoruid === currentUser.uid
      );
      setMatchingPosts(filteredPosts);
      setFilteredMatchingPosts(filteredPosts);
    }
  }, [contents, currentUser]);

  const handleSearch = () => {
    const searchFieldValue = searchField.toLowerCase();
    if (searchFieldValue === "") {
      setFilteredMatchingPosts(matchingPosts);
    } else {
      const filteredArray = matchingPosts.filter((item) =>
        item.title.toLowerCase().includes(searchFieldValue)
      );
      if (searchFieldValue.trim() === "") {
        alert("Please enter a search term");
      } else if (filteredArray.length === 0) {
        alert("No results found for the search term");
      } else {
        alert(`Found ${filteredArray.length} result(s) for the search term`);
      }
      setFilteredMatchingPosts(filteredArray);
    }
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
  console.log(currentUser);
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
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="img-header"
                        href="#post1"
                        onClick={() => navigate(`/post/${id}`)}
                      />
                    )}
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
