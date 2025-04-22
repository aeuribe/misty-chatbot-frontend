import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { MdOutlineDateRange } from "react-icons/md";
import "./dashboard.css";
const Sidebar = () => {
  return (
    <div>
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
          <ListItem disablePadding>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.07)",
                borderRadius: "12px",
                padding: "10px 16px",
                marginTop: "1rem",
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
                <ListItemText primary="Services" />
              </Box>
            </Box>
          </ListItem>
        </List>
      </Box>
    </div>
  );
};

export default Sidebar;
