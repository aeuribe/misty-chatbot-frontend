import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import DataTable from "./Table";
import { useAuth0 } from "@auth0/auth0-react";
import "./dashboard.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Barra que cubre toda la pantalla */}
      <Navbar />

      {/* Contenido principal */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          padding: "20px",
        }}
      >
        {/* Sidebar a la izquierda */}
        <Sidebar/>

        {/* Contenido principal (tabla, etc.) */}
        <Paper
          elevation={6}
          sx={{
            flexGrow: 1,
            backgroundColor: "#ffffff",
            maxWidth: "80%",
            marginLeft: "auto",
            borderRadius: 3,
            overflow: "hidden",
            padding: "30px",
          }}
        >
          {/* <h2>Aquí irá la tabla</h2> */}
          {isAuthenticated && <DataTable email={user.email} />}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
