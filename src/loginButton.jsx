import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      sx={{
        color: "#2674fc",
        backgroundColor: "#fff",
        borderRadius: '80px',
        fontWeight: '800',
        minWidth: '100px',
        boxShadow: 'none',
        '&:hover': {
          color: '#fff', // Color del texto al hacer hover
          backgroundColor: '#2674fc', // Fondo del botón al hacer hover
        }
      }}
      onClick={() => loginWithRedirect()}
      variant="contained"
    >
      Log In
    </Button>
  );
};

export default LoginButton;
