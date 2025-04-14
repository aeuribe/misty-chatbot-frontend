import React from "react";
import LoginButton from "../loginButton";
import LogoutButton from "../logoutButton";

import "./home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-title-container">
        <h1 className="home-title">Welcome to Misty Chatbot</h1>
      </div>
      <div className="home-button-container"><LoginButton /></div>
    </div>
  );
}

export default Home;
