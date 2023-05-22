import React, { useState, useContext, useEffect } from "react";
import CreatePostForm from "./create-post-form";
import { ContentContext } from "../context/content.context";
import { UserContext } from "../context/user.context";
import { GetDataArray } from "../../utils/firebase/firebase.utils";

import { useNavigate } from "react-router-dom";
import "./blog.scss";

import SearchBar from "./search-bar";
import PostItem from "./post-item";

const Blog = () => {
  const [showForm, setShowForm] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const { setContents } = useContext(ContentContext);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleClick = () => {
    if (currentUser) {
      setShowForm(!showForm);
      navigate("/create-post");
    } else {
      alert("Please Login to Create Post");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const dataArray = await GetDataArray();
      setDataArray(dataArray);
      setContents(dataArray);
      setFilteredDataArray(dataArray);
    };
    return fetchData;
  }, []);

  const handleSearch = () => {
    const searchFieldValue = searchField.toLowerCase();
    const filteredArray = dataArray.filter((item) =>
      item.title.toLowerCase().includes(searchFieldValue)
    );
    if (searchFieldValue.trim() === "") {
      alert("Please enter a search term");
    } else if (filteredArray.length === 0) {
      alert("No results found for the search term");
    } else {
      alert(`Found ${filteredArray.length} result(s) for the search term`);
    }
    setFilteredDataArray(filteredArray);
  };

  const sortedDataArray = filteredDataArray.sort((a, b) => b.id - a.id);
  console.log(sortedDataArray);
  return (
    <div className="blog-container">
      <SearchBar
        searchField={searchField}
        setSearchField={setSearchField}
        handleSearch={handleSearch}
      />
      <div className="header">
        <h1>POSTS</h1>
        <span className="create-post" onClick={handleClick}>
          Create Post
        </span>
      </div>
      {showForm && <CreatePostForm />}
      <div>
        <ul>
          {sortedDataArray.map(
            ({ id, authoruid, photoURL, author, title, content, imageUrl }) => (
              <PostItem
                key={id}
                id={id}
                authoruid={authoruid}
                photoURL={photoURL}
                author={author}
                title={title}
                content={content}
                imageUrl={imageUrl}
                navigate={navigate}
              />
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
