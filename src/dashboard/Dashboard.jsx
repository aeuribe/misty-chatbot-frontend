import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LogoutButton from "../logoutButton";
import DataTable from "./Table";
import { MdOutlineDateRange } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";

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
        <strong>Appointments</strong>
        <h2 style={{ margin: 0 }}>Misty | Chatbot</h2>
        <LogoutButton />
      </Paper>

      {/* Contenido principal */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          padding: "20px",
        }}
      >
        {/* Sidebar a la izquierda */}
        <Box
          sx={{
            width: "250px",
            borderRight: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "0px 20px 20px 10px",
            color: "#fff",
          }}
        >
          <List>
            <ListItem disablePadding>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  borderRadius: "12px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", // centra verticalmente
                    justifyContent: "center", // centra horizontalmente
                    gap: "8px", // espacio entre ícono y texto
                    padding: "6px 12px",
                    alignSelf: "center",
                  }}
                >
                  <MdOutlineDateRange size={20} />
                  <ListItemText primary="Appointments" />
                </Box>
              </Box>
            </ListItem>
          </List>
        </Box>

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
          {isAuthenticated && (<DataTable email={user.email}/>)}

        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
