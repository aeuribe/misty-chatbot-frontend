import React from "react";
import { Paper, Button, Grid, Typography, Box } from "@mui/material";
import { formatDateTime, formatHour } from "../utilities/formatedDate.js";

const getStatusColor = (status) => {
  if (!status) return "#f39c12";
  const s = status.toLowerCase();
  if (s === "completed") return "#28a745";
  if (s === "canceled") return "#e74c3c";
  return "#f39c12";
};

const getCardBackground = (status) => {
  if (!status) return "#fff";
  const s = status.toLowerCase();
  if (s === "completed") return "#f1f8e9";
  if (s === "canceled") return "#fff5f5"; // rojo MUY sutil
  return "#fff";
};

const AppointmentCard = ({ item, openDialog }) => {
  if (!item || !item.date) {
    console.error("Invalid appointment item:", item);
    return null;
  }

  const appointmentDate = new Date(item.date);
  const formattedDate = `${String(appointmentDate.getDate()).padStart(
    2,
    "0"
  )}${String(appointmentDate.getMonth() + 1).padStart(2, "0")}${appointmentDate
    .getFullYear()
    .toString()
    .slice(2, 4)}`;
  const appointmentId = `#${formattedDate}-${item.appointment_id}`;

  const statusColor = getStatusColor(item.status);
  const cardBg = getCardBackground(item.status);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={`${item.client_name}-${item.date}-${item.start_time}`}
    >
      <Paper
        sx={{
          padding: 3,
          borderRadius: 2,
          border: "1px solid #ddd",
          backgroundColor: cardBg,
          position: "relative",
          minHeight: "220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Contenedor superior para ID y estado */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: "bold",
              color: "#777",
              userSelect: "text",
            }}
          >
            {appointmentId}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "bold",
              color: statusColor,
              textTransform: "uppercase",
              userSelect: "text",
            }}
          >
            {item.status}
          </Typography>
        </Box>

        {/* Nombre del cliente */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#2c3e50", mb: 2 }}
        >
          {item.client_name}
        </Typography>

        {/* Detalles del servicio */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" sx={{ color: "#555", mb: 0.5 }}>
            <strong>Service:</strong> {item.service_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", mb: 0.5 }}>
            <strong>Price:</strong> ${item.price}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", mb: 0.5 }}>
            <strong>Date:</strong> {formatDateTime(item.date)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555" }}>
            <strong>Time:</strong> {formatHour(item.start_time)} -{" "}
            {formatHour(item.end_time)}
          </Typography>
        </Box>

        {/* Botones */}
        <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => openDialog(item, "complete")}
            sx={{ flex: 1 }}
          >
            ✔ Complete
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => openDialog(item, "cancel")}
            sx={{ flex: 1 }}
          >
            ✖ Cancel
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default AppointmentCard;
