import React from "react";

const SearchBar = ({ searchField, setSearchField, handleSearch }) => {
  return (
    <div className="search-field">
      <input
        type="search"
        placeholder="search"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
