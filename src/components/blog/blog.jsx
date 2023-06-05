import React, { useState, useContext, useEffect } from "react";

import { ContentContext } from "../context/content.context";
import { UserContext } from "../context/user.context";

import "./blog.scss";

import SearchBar from "./search-bar";
import PostItem from "./post-item";
import { GetDataArray } from "../../utils/firebase/firebase.utils";

const Blog = () => {
  const [dataArray, setDataArray] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const { setContents } = useContext(ContentContext);
  const { currentUser } = useContext(UserContext);

  const handleClick = () => {
    alert("Please Login to Create Post");
  };
  useEffect(() => {
    const fetchData = async () => {
      const dataArray = await GetDataArray();
      setDataArray(dataArray);
      setContents(dataArray);
      setFilteredDataArray(dataArray);
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const searchFieldValue = searchField.toLowerCase();
    const filteredArray = dataArray.filter(
      (item) =>
        item.title.toLowerCase().includes(searchFieldValue) ||
        item.author.toLowerCase().includes(searchFieldValue)
    );
    if (searchFieldValue.trim() === "") {
      setFilteredDataArray(dataArray); // Update filtered array to contain all items
    } else if (filteredArray.length === 0) {
      alert("No results found for the search term");
    } else {
      alert(`Found ${filteredArray.length} result(s) for the search term`);
    }
    setFilteredDataArray(filteredArray); // Update filtered array with the filtered results
  };

  const sortedDataArray = filteredDataArray.sort((a, b) => b.id - a.id);

  return (
    <div className="blog-container">
      <div className="search-create">
        <SearchBar
          searchField={searchField}
          setSearchField={setSearchField}
          handleSearch={handleSearch}
          placeholder={"Search by author or content..."}
        />

        {!currentUser && (
          <button className="create-post" onClick={handleClick}>
            <i className="fas fa-lock"></i> Create Post
          </button>
        )}
      </div>

      {filteredDataArray.length === 0 ? (
        <div>No posts found</div>
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
                <PostItem
                  key={id}
                  id={id}
                  authoruid={authoruid}
                  photoURL={photoURL}
                  author={author}
                  title={title}
                  content={content}
                  imageUrl={imageUrl}
                  createdAt={createdAt}
                  formattedDate={formattedDate}
                />
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Blog;
