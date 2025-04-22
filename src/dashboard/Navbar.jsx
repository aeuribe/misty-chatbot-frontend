import React from "react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import LogoutButton from "../logoutButton";
import { useAuth0 } from "@auth0/auth0-react";

import "./dashboard.css";

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  return (
    <div>
      {/* Barra que cubre toda la pantalla */}
      <Paper
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center", // 👈 esto centra verticalmente
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          color: "#000",
          padding: "16px 32px",
          fontSize: "1.25rem",
          fontWeight: 500,
        }}
        elevation={5}
      >
        <div className="dashboard-avatar">
          <Avatar src={user.picture} />
          <p>{user.nickname}</p>
        </div>

        <h2 style={{ margin: 0 }}>Misty | Chatbot</h2>
        <LogoutButton />
      </Paper>
    </div>
  );
};

export default Navbar;
