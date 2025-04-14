import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

import { useSearchParams } from "react-router-dom";
import { getAllAppointmentDataByNumber } from "../services/appointmentService";
import { getAvailableSlots } from "../services/availableSlotsService";
import { updateAppointment } from "../services/appointmentService";
import { getBusinessById } from "../services/businessService.js";
import StyledTextField from "../components/StyledTextField.jsx";

import { Business } from "../models/Business.js";
import { useAsync } from "../hooks/useAsyncClean.js";

import businessAdapter from "../adapters/businessAdapter.js";
import useFetchAndLoad from "../hooks/useFetchAndLoad.js";

import { filterSlots } from "../utilities/filterSlots.utility.js";
import { calculateEndTime } from "../utilities/calculateEndTime.utility.js";

export function RescheduleForm() {
  const [searchParams] = useSearchParams();
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState("");

  const [errors, setErrors] = useState({});
  const [buttonText, setButtonText] = useState("Reprogramar");
  const [business, setBussines] = useState(new Business("", ""));
  const urlBusinessId = searchParams.get("business_id");
  const urlNumber = searchParams.get("number");
  const { loading, callEndpoint } = useFetchAndLoad();
  const [availableSlots, setAvailableSlots] = useState([]);

  // =================================================
  // Business Data Handling
  // =================================================
  const successFunctionGetBusiness = (data) => {
    if (!data) return;
    businessAdapter(setBussines, data);
  };
  const getBusiness = async () => {
    return callEndpoint(getBusinessById(urlBusinessId));
  };
  useAsync(getBusiness, successFunctionGetBusiness, null, null, [
    searchParams.toString(),
  ]);

  // =================================================
  // Slots Data Handling
  // =================================================
  const successFunctionGetSlots = (data) => {
    if (!data) return;
    setAvailableSlots(
      filterSlots(data.availableSlots, selectedDate.format("YYYY-MM-DD"))
    );
  };
  const getSlots = async () => {
    return callEndpoint(
      getAvailableSlots(business.id, selectedDate.format("YYYY-MM-DD"))
    );
  };
  useAsync(getSlots, successFunctionGetSlots, null, null, [
    selectedDate,
    business.id,
  ]);

  // =================================================
  // Appointment Data Handling
  // =================================================
  const successFunctionGetAppointment = (data) => {
    if (!data) return;
    setAppointmentData(data);
    console.log("data: ",data);
  };
  const getAppointment = async () => {
    return callEndpoint(getAllAppointmentDataByNumber(urlNumber));
  };
  useAsync(getAppointment, successFunctionGetAppointment, null, null, [
    searchParams.toString(),
  ]);

  const handleDateChange = (event) => {
    const newDate = dayjs(event.target.value);
    setSelectedDate(newDate);
    setSelectedSlot("");
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const handleReschedule = async () => {
    if (!validateFields()) return;

    setButtonText("Procesando...");
    try {
      // Validar que appointmentData tenga un valor antes de acceder a sus propiedades
      if (!appointmentData) {
        console.error("Error: appointmentData es nulo");
        setButtonText("Error");
        return;
      }

      // Construir el objeto actualizado para la cita
      const updatedAppointment = {
        appointmentId: appointmentData.appointment_id, // ID de la cita (usar appointmentId)
        businessId: appointmentData.business_id, // ID del negocio
        clientId: appointmentData.client_id, // ID del cliente
        serviceId: appointmentData.service_id, // ID del servicio
        date: selectedDate.format("YYYY-MM-DD"), // Nueva fecha seleccionada
        startTime: selectedSlot, // Nuevo horario seleccionado
        endTime: calculateEndTime(selectedSlot, appointmentData.duration_min), // Calcula el tiempo final basado en la duración del servicio
        status: "Pending", // Estado de la cita (ajustar según tu lógica)
      };

      console.log("Actualizando cita con datos:", updatedAppointment);

      // Llamar al servicio para actualizar la cita en el backend
      await updateAppointment(
        updatedAppointment.appointmentId,
        updatedAppointment.businessId,
        updatedAppointment.clientId,
        updatedAppointment.serviceId,
        updatedAppointment.date,
        updatedAppointment.startTime,
        updatedAppointment.endTime,
        updatedAppointment.status
      );

      setButtonText("Cita Reprogramada");
    } catch (error) {
      console.error("Error reprogramando la cita:", error);
      setButtonText("Error");
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!selectedDate) newErrors.selectedDate = true;
    if (!selectedSlot) newErrors.selectedSlot = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!appointmentData) return <div>Cargando...</div>;

  return (
    <Box
      className="form-container"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box
        className="Card"
        p={3}
        borderRadius={2}
        boxShadow={3}
        bgcolor="#FFF"
        width="350px"
      >
        <h1 style={{ paddingBottom: "1px" }}>Reprogramar una Cita</h1>
        <h2>{business.name}</h2>

        <StyledTextField
          label="Nombre Completo"
          value={appointmentData.client_name}
          disabled
        />
        <StyledTextField
          label="Servicio"
          value={appointmentData.service_name}
          disabled
        />
        <StyledTextField
          label="Fecha Actual"
          value={dayjs(appointmentData.date).format("YYYY-MM-DD")}
          disabled
        />
        <StyledTextField
          label="Horario Actual"
          value={appointmentData.start_time}
          disabled
        />
        <StyledTextField
          label="Nueva Fecha"
          type="date"
          value={selectedDate.format("YYYY-MM-DD")}
          onChange={handleDateChange}
          error={errors.selectedDate}
        />
        <StyledTextField
          label="Nuevo Horario"
          select
          value={selectedSlot}
          onChange={handleSlotChange}
          error={errors.selectedSlot}
        >
          {availableSlots.map((slot, index) => (
            <MenuItem key={index} value={slot}>
              {slot}
            </MenuItem>
          ))}
        </StyledTextField>
        <Button
          variant="contained"
          color="primary"
          onClick={handleReschedule}
          disabled={buttonText === "Cita Reprogramada"}
          sx={{
            width: "100%",
            backgroundColor: buttonText === "Enviado" ? "#4CAF50" : "#3A57E8 ",
            color: "#FFF",
            "&:disabled": {
              backgroundColor:
                buttonText === "Enviado" ? "#4CAF50" : "#3A57E8 ",
              color: "#FFF",
              opacity: 0.8,
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
}
