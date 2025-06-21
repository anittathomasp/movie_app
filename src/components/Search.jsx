import React from "react";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search">
      <div>
        <img src="/assets/search.svg" alt="Search Icon" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
