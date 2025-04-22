import * as React from "react";
import { useState } from "react";
import {
  Paper,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { getAllAppointmentsByEmail } from "../services/appointmentService.js";
import { useAsync } from "../hooks/useAsyncClean";
import useFetchAndLoad from "../hooks/useFetchAndLoad.js";
import { formatDateTime, formatHour } from "../utilities/formatedDate.js";

const statuses = ["all", "completed", "pending"];

export default function AppointmentList({ email }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const { loading, callEndpoint } = useFetchAndLoad();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState(null);

  const openDialog = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    if (actionType === "complete") {
      markAsCompleted(selectedAppointment);
    } else if (actionType === "cancel") {
      cancelAppointment(selectedAppointment);
    }
    closeDialog();
  };

  const successFunctionGetAppointments = (data) => {
    if (!data) return;
    setAppointments(data);
  };

  const getAppointments = async () => {
    return callEndpoint(getAllAppointmentsByEmail(email));
  };

  useAsync(getAppointments, successFunctionGetAppointments, null, null, []);

  const getDateTime = (item) => {
    const datePart = item.date.split("T")[0];
    return new Date(`${datePart}T${item.start_time}`);
  };

  const filteredData = appointments
    .filter((item) => {
      if (filter === "completed")
        return item.status.toLowerCase() === "completed";
      if (filter === "pending") return item.status.toLowerCase() === "pending";
      return true;
    })
    .filter((item) => {
      const query = searchTerm.toLowerCase();
      return (
        item.client_name.toLowerCase().includes(query) ||
        item.service_name.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.start_time.toLowerCase().includes(query) ||
        item.end_time.toLowerCase().includes(query)
      );
    });

  const sortedAppointments = [...filteredData].sort((a, b) => {
    const dateA = getDateTime(a);
    const dateB = getDateTime(b);
    return dateA - dateB;
  });

  const now = new Date();
  const todayISO = now.toISOString().split("T")[0];

  const upcomingAppointments = sortedAppointments.filter(
    (item) => getDateTime(item) >= now
  );
  const nextAppointment = sortedAppointments[0] || null;

  const appointmentsToday = sortedAppointments.filter(
    (item) =>
      item.date.split("T")[0] === todayISO &&
      (!nextAppointment ||
        item.appointment_id !== nextAppointment.appointment_id)
  );

  const otherAppointments = sortedAppointments.filter(
    (item) =>
      item.date.split("T")[0] !== todayISO &&
      (!nextAppointment ||
        item.appointment_id !== nextAppointment.appointment_id)
  );

  const markAsCompleted = (appointment) => {
    console.log(`✔ Marking appointment for ${appointment.client_name} as completed`);
  };

  const cancelAppointment = (appointment) => {
    console.log(`✖ Canceling appointment for ${appointment.client_name}`);
  };

  const renderAppointmentCard = (item) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={`${item.client_name}-${item.date}-${item.start_time}`}
    >
      <Paper
        sx={{
          padding: 2,
          borderRadius: 2,
          border: "1px solid #ddd",
          backgroundColor: item.status === "completed" ? "#f1f8e9" : "#fff",
          position: "relative",
          minHeight: "200px",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: 8,
            right: 12,
            fontWeight: "bold",
            color: item.status === "completed" ? "#28a745" : "#f39c12",
          }}
        >
          {item.status.toUpperCase()}
        </Typography>

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#2c3e50", mb: 1 }}
        >
          {item.client_name}
        </Typography>
        <Typography variant="body1" sx={{ color: "#555" }}>
          <strong>Service:</strong> {item.service_name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#555" }}>
          <strong>Price:</strong> ${item.price}
        </Typography>
        <Typography variant="body2" sx={{ color: "#555" }}>
          <strong>Date:</strong> {formatDateTime(item.date)}
        </Typography>
        <Typography variant="body2" sx={{ color: "#555" }}>
          <strong>Time:</strong> {formatHour(item.start_time)} -{" "}
          {formatHour(item.end_time)}
        </Typography>

        <div style={{ marginTop: "16px" }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => openDialog(item, "complete")}
            sx={{ mr: 1 }}
          >
            ✔ Complete
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => openDialog(item, "cancel")}
          >
            ✖ Cancel
          </Button>
        </div>
      </Paper>
    </Grid>
  );

  return (
    <div>
      {/* Filtros y búsqueda */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          {statuses.map((status) => (
            <Button
              key={status}
              variant={filter === status ? "contained" : "outlined"}
              onClick={() => setFilter(status)}
              style={{
                marginRight: "8px",
                textTransform: "capitalize",
                borderRadius: "20px",
                color: "#333",
                borderColor: "#333",
              }}
            >
              {status}
            </Button>
          ))}
        </div>
        <TextField
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          sx={{
            width: "250px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
                boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
              },
            },
            "& input": {
              color: "#333",
              padding: "8px 12px",
            },
            transition: "all 0.3s ease",
          }}
          InputLabelProps={{ shrink: true }}
        />
      </div>

      {/* Contenido */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {nextAppointment && (
            <>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", color: "#2674fc" }}
              >
                Próxima cita
              </Typography>
              <Grid container spacing={2}>
                {renderAppointmentCard(nextAppointment)}
              </Grid>
            </>
          )}

          {appointmentsToday.length > 0 && (
            <>
              <Typography
                variant="h6"
                sx={{ mt: 4, mb: 2, fontWeight: "bold", color: "#2674fc" }}
              >
                Citas de hoy
              </Typography>
              <Grid container spacing={2}>
                {appointmentsToday.map(renderAppointmentCard)}
              </Grid>
            </>
          )}

          {otherAppointments.length > 0 && (
            <>
              <Typography
                variant="h6"
                sx={{ mt: 4, mb: 2, fontWeight: "bold", color: "#2674fc" }}
              >
                Otras citas
              </Typography>
              <Grid container spacing={2}>
                {otherAppointments.map(renderAppointmentCard)}
              </Grid>
            </>
          )}

          {!nextAppointment &&
            appointmentsToday.length === 0 &&
            otherAppointments.length === 0 && (
              <Typography
                variant="body1"
                sx={{ mt: 4, textAlign: "center", color: "#888" }}
              >
                No hay citas para mostrar.
              </Typography>
            )}
        </>
      )}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`¿${actionType === "complete" ? "Completar" : "Cancelar"} cita?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que quieres {actionType === "complete" ? "completar" : "cancelar"} esta cita?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>No</Button>
          <Button onClick={handleConfirm} autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
