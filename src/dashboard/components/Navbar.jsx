import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

const Navbar = ({ activeSection, searchTerm, setSearchTerm }) => {
  const { user, logout } = useAuth0();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full h-20 bg-white z-30 flex items-center justify-between px-8">
      <h2 className="font-semibold text-2xl ml-60 flex justify-center items-center text-[#343C6A]">
        {activeSection}
      </h2>

      <div className="ml-auto mr-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="relative flex items-center cursor-pointer h-10">
        <p className="text-[#343C6A] font-medium mr-2">{user?.name || "User"}</p>
        <img
          src={user?.picture || "https://via.placeholder.com/40?text=U"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
          onClick={toggleMenu}
        />

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-50 text-xs font-medium">
            <button
              onClick={() => {
                closeMenu();
                logout({ logoutParams: { returnTo: window.location.origin } });
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;
