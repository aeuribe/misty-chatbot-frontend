import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';
import { FaPowerOff } from "react-icons/fa";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      sx={{
        color: "#2674fc",
        backgroundColor: "#fff",
        borderRadius: "80px",
        fontWeight: "800",
        minWidth: "100px",
        boxShadow: "none",
        gap:"8px",
        "&:hover": {
          color: "#fff", // Color del texto al hacer hover
          backgroundColor: "#2674fc", // Fondo del botón al hacer hover
        },
      }}
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out 
      <FaPowerOff />
    </Button>
  );
};

export default LogoutButton;
