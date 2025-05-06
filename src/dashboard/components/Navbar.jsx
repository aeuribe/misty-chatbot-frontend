import React from "react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import LogoutButton from "../../logoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import SearchBar from "../../components/SearchBar";

import "../dashboard.css";

const Navbar = ({ activeSection, searchTerm, setSearchTerm }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  return (
    <div className="fixed top-0 left-0 w-full h-20 bg-white z-30 flex items-center justify-between px-8">
      {/* Título de la sección dinámica */}
      <h2 className="font-semibold text-2xl ml-60 flex justify-center items-center text-[#343C6A]">
        {activeSection}
      </h2>

      {/* Search Bar (oculta en My Services) */}
        <div className="ml-auto mr-6">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

      <div className="dashboard-avatar">
        <p className="text-[#343C6A] font-medium mr-2">Andrés Uribe</p>
        <Avatar src="path-to-your-avatar" />
      </div>
    </div>
  );
};

export default Navbar;
