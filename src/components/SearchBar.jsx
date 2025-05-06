import React from 'react';
import searchIcon from "../assets/search-icon.svg";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-[255px] h-[50px] bg-[#F5F7FA] rounded-full flex items-center px-4">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for something"
      className="w-full h-full bg-transparent border-none text-[#8BA3CB] font-inter text-sm placeholder-[#8BA3CB] outline-none pl-10"
    />
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
      <img
        src={searchIcon}
        alt="Search"
        className="w-5 h-5"
      />
    </div>
  </div>
  )
}

export default SearchBar
