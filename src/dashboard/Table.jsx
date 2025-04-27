import * as React from "react";
import { useState, useMemo } from "react";
import {
  Paper,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getAllAppointmentsByEmail } from "../services/appointmentService.js";
import { useAsync } from "../hooks/useAsyncClean";
import useFetchAndLoad from "../hooks/useFetchAndLoad.js";
import AppointmentCard from "./AppointmentCard.jsx";
import SearchComponent from "./SearchComponent.jsx";
import ConfirmationDialog from "./ConfirmationDialog.jsx";
import "./appointmentList.css"; // Import the CSS file

const statuses = ["current", "completed", "canceled", "expired"];

export default function AppointmentList({ email }) {
  const [filter, setFilter] = useState("current");
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

  function getLocalISODateString(date = new Date()) {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  const now = new Date();
  const todayISO = getLocalISODateString(now);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const query = searchTerm.toLowerCase();
      return (
        item.client_name.toLowerCase().includes(query) ||
        item.service_name.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.start_time.toLowerCase().includes(query) ||
        item.end_time.toLowerCase().includes(query)
      );
    });
  }, [appointments, searchTerm]);

  const {
    pastAppointments,
    nextAppointment,
    appointmentsToday,
    otherAppointments,
    canceledAppointments,
    completedAppointments,
  } = useMemo(() => {
    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
      const dateA = getDateTime(a);
      const dateB = getDateTime(b);
      return dateA - dateB;
    });

    const past = sortedAppointments.filter(
      (item) =>
        getDateTime(item) < now &&
        item.status &&
        item.status.toLowerCase() === "pending"
    );

    const canceled = sortedAppointments.filter(
      (item) =>
        item.status &&
        item.status.toLowerCase() === "canceled"
    );

    const completed = sortedAppointments.filter(
      (item) =>
        item.status &&
        item.status.toLowerCase() === "completed"
    );

    const upcoming = sortedAppointments.filter(
      (item) => getDateTime(item) >= now
    );
    const next = upcoming.length > 0 ? upcoming[0] : null;
    const today = upcoming.filter((item) => {
      const itemDate = getLocalISODateString(new Date(item.date));
      return itemDate === todayISO;
    });

    const other = upcoming.filter((item) => {
      const itemDate = getLocalISODateString(new Date(item.date));
      return (
        itemDate !== todayISO &&
        (!next || item.appointment_id !== next.appointment_id)
      );
    });


    return {
      pastAppointments: past,
      nextAppointment: next,
      appointmentsToday: today,
      otherAppointments: other,
      canceledAppointments: canceled,
      completedAppointments: completed
    };
  }, [filteredAppointments, now]);

  const markAsCompleted = (appointment) => {
    console.log(
      `✔ Marking appointment for ${appointment.client_name} as completed`
    );
  };

  const cancelAppointment = (appointment) => {
    console.log(`✖ Canceling appointment for ${appointment.client_name}`);
  };

  const renderAppointmentSection = (title, appointments) => {
    if (!appointments || appointments.length === 0) {
      return null;
    }

    const filteredAppointments = appointments.filter((item) => item != null);

    if (filteredAppointments.length === 0) {
      return null;
    }

    return (
      <>
        <Typography
          variant="h6"
          sx={{ mt: 4, mb: 2, fontWeight: "normal", color: "#2674fc" }}
        >
          {title}
        </Typography>
        <Grid container spacing={2}>
          {filteredAppointments.map((item) => (
            <AppointmentCard
              key={item.appointment_id || Math.random()} // fallback por si no hay id
              item={item}
              openDialog={openDialog}
            />
          ))}
        </Grid>
      </>
    );
  };

  return (
    <div className="appointmentListContainer">
      {/* Filtros y búsqueda */}
      <div className="filterSearchContainer">
        <div className="statusButtons">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={filter === status ? "contained" : "outlined"}
              onClick={() => setFilter(status)}
              className="statusButton"
              sx={{
                borderRadius: "20px",
                backgroundColor: filter === status ? "#2575fc" : "#fff",
                color: filter === status ? "#fff" : "#2575fc",
                border: "0px",
                padding: "8px 16px",
                fontSize: "0.95rem",
                fontWeight: 500,
                transition: "all 0.25s ease-in-out",
                "&:hover": {
                  boxShadow: "0 4px 10px rgba(37, 117, 252, 0.2)", // Agrega sombra sutil
                },
              }}
            >
              {status}
            </Button>
          ))}
        </div>
        {/* Use the SearchComponent */}
        <SearchComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="loadingContainer">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* {filter === "current" &&
            renderAppointmentSection("Next appointment", [nextAppointment])} */}
          {filter === "current" &&
            renderAppointmentSection("Today's appointments", appointmentsToday)}
          {filter === "current" &&
            renderAppointmentSection("Other appointments", otherAppointments)}
          {filter === "expired" &&
            renderAppointmentSection("Expired appointments", pastAppointments)}
          {filter === "canceled" &&
            renderAppointmentSection("Canceled appointments", canceledAppointments)}
          {filter === "completed" &&
            renderAppointmentSection("Completed appointments", completedAppointments)}
          {!nextAppointment &&
            appointmentsToday.length === 0 &&
            otherAppointments.length === 0 &&
            pastAppointments.length === 0 && (
              <Typography variant="body1" className="noAppointments">
                No hay citas para mostrar.
              </Typography>
            )}
        </>
      )}
      {/* Use the ConfirmationDialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={closeDialog}
        onConfirm={handleConfirm}
        actionType={actionType}
        selectedAppointment={selectedAppointment}
      />
    </div>
  );
}
