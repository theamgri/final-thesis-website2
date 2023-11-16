import { useState } from 'react';
import React, { useEffect, useRef } from 'react';
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const SearchBar = () => {
    // Handle the search action here, e.g., redirect to search results page
    console.log('Searching for:', searchQuery);
    // You can implement your search logic, such as navigating to search results page.
  };

  return (
    <div className="flex items-center text-black">
      <input
        type="text"
        placeholder="Search Here..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-0 rounded-l-md p-1 text-sm border border-gray-600"
      />
      <button
        onClick={SearchBar}
        className="bg-slate-800 p-1 text-sm text-white border border-gray-600 rounded-r-md hover:bg-slate-600"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;

