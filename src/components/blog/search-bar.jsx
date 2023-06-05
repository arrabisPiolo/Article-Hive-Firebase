import React from "react";
import "./search-bar.scss";

const SearchBar = ({
  searchField,
  setSearchField,
  handleSearch,
  placeholder,
}) => {
  return (
    <div className="search-container">
      <div className="search-field-wrapper">
        <input
          className="search-field"
          type="search"
          placeholder={placeholder}
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
