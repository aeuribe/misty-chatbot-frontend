import React from "react";
import LoginButton from "../loginButton";
import LogoutButton from "../logoutButton";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-6">
      <div className="max-w-2xl text-center mb-12">
        <h1 className="text-white text-5xl md:text-6xl font-extrabold drop-shadow-lg">
          Welcome to Misty Chatbot
        </h1>
      </div>
      <div>
        <LoginButton />
      </div>
    </div>
  );
}

export default Home;
