import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import StyledTextField from "../components/StyledTextField.jsx";

import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import "./form.css";

import { useValidateFields } from "../hooks/useValidateFields.js";
import useDisableFields from "../hooks/useDisableFields.js";
import useFetchAndLoad from "../hooks/useFetchAndLoad.js";
import { useApiRequest } from "../hooks/useCallApi.js";
import { useAsync } from "../hooks/useAsyncClean.js";

import { Client } from "../models/client.js";
import { Business } from "../models/Business.js";

import {
  adaptBackendToClient,
  adaptClientToBackend,
} from "../adapters/clientAdapter.js";
import businessAdapter from "../adapters/businessAdapter.js";

import { getBusinessById } from "../services/businessService.js";
import { getServicesByBusinessId } from "../services/serviceServices.js";
import { getAvailableSlots } from "../services/availableSlotsService.js";
import { createAppointment } from "../services/appointmentService.js";
import { getClientByNumber, createClient } from "../services/clientService.js";

import { calculateEndTime } from "../utilities/calculateEndTime.utility.js";
import { filterSlots } from "../utilities/filterSlots.utility.js";

function Form() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [searchParams] = useSearchParams();
  const urlNumber = searchParams.get("number");
  const urlBusinessId = searchParams.get("business_id");
  //useStates
  const [business, setBussines] = useState(new Business("", ""));
  const [client, setClient] = useState(new Client("", "", "", "", ""));
  const [services, setServices] = useState([]);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedService, setSelectedService] = useState({
    id: "",
    duration: 0,
  });
  const [selectedSlot, setSelectedSlot] = useState();
  const [clientExist, setClientExist] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [buttonText, setButtonText] = useState("Enviar");
  const [buttonColor, setButtonColor] = useState("info");
  const {
    nameError,
    emailError,
    selectedServiceError,
    selectedDateError,
    selectedSlotError,
    isValid,
    validate,
  } = useValidateFields();
  const { loading, callEndpoint } = useFetchAndLoad();
  const { nameDisabled, emailDisabled, disableNameAndEmail } =
    useDisableFields();
  const { execute } = useApiRequest();
  // =================================================
  // Handlers
  // =================================================
  const handleClientChange = (event) => {
    const { id, value } = event.target;
    setClient({ ...client, [id]: value });
  };

  const handleDateChange = (event) => {
    const newDate = event && event.target ? dayjs(event.target.value) : event; // Asegurar conversión
    if (newDate && newDate.isValid && newDate.isValid()) {
      console.log("Fecha seleccionada:", newDate.format("YYYY-MM-DD"));
      setSelectedDate(newDate);
    } else {
      console.log("Fecha inválida:", newDate);
    }
  };

  const handleServiceChange = (event) => {
    const selectedServiceId = event.target.value;
    const selectedServiceData = services.find(
      (service) => service.service_id === selectedServiceId
    );

    setSelectedService({
      id: selectedServiceId,
      duration: selectedServiceData.duration_min,
    });
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const handleClick = async () => {
    const isFormValid = validate(
      client.name,
      client.email,
      selectedService,
      selectedDate,
      selectedSlot
    );

    if (!isFormValid) {
      console.log("Formulario inválido. Corrige los errores.");
      return;
    }
    // Bloquear el botón y cambiar el texto/color
    setButtonText("Enviando...");
    setButtonColor("secondary");
    setButtonClicked(true);

    const newAppointment = {
      businessId: urlBusinessId,
      clientId: client.id,
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedSlot,
      endTime: calculateEndTime(selectedSlot, selectedService.duration),
      status: "Pending",
    };

    const registerAppointment = async (newAppointment) => {
      return callEndpoint(createAppointment(newAppointment));
    };

    await execute(
      () => registerAppointment(newAppointment),
      (data) => {
        console.log("Cita registrada con éxito:", data);
        setButtonText("Enviado"); // Cambia el texto a "Enviado" cuando se complete exitosamente
        setButtonColor("success"); // Opcional: cambiar color para indicar éxito
      },
      (err) => console.log("Error al registrar cita:", err)
    );
  };

  // =================================================
  // Client Data Handling
  // =================================================
  // Get client data
  const successFunctionGetClient = (data) => {
    if (!data) {
      setClient({
        ...client,
        phone: urlNumber,
        businessId: urlBusinessId,
      });
    } else {
      adaptBackendToClient(setClient, data);
      setClientExist(true);
      disableNameAndEmail();
    }
  };
  const getClient = async () => {
    return callEndpoint(getClientByNumber(urlNumber));
  };
  useAsync(getClient, successFunctionGetClient, null, [
    searchParams.toString(),
  ]);

  // Post Client Data
  const postClient = async () => {
    if (isValid == false || buttonClicked == false || clientExist === true) {
      console.log("saliendo de esta mrd");
      return;
    }
    setButtonText("Enviando...");
    return callEndpoint(createClient(adaptClientToBackend(client)));
  };
  const successFunctionCreateClient = (data) => {
    setButtonText("Enviado");
  };
  useAsync(postClient, successFunctionCreateClient, null, null, [
    isValid,
    buttonClicked,
  ]);

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
  // Services Data Handling
  // =================================================
  const getService = async () => {
    if (!business.id) return;
    return callEndpoint(getServicesByBusinessId(business.id));
  };
  useAsync(
    getService,
    (data) => {
      if (data) setServices(data);
    },
    null,
    null,
    [business.id]
  );
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

  return (
    <Box
      className="form-container"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" // Para ocupar toda la altura de la pantalla
    >
      <Box
        className="Card"
        p={3}
        borderRadius={2}
        boxShadow={3}
        bgcolor="#FFF"
        width="350px"
      >
        <h1>Formulario de Registro de Citas</h1>
        <h2>{business.name}</h2>
        <StyledTextField
          id="name"
          label="Nombre Completo"
          variant="outlined"
          value={client.name}
          onChange={handleClientChange}
          disabled={nameDisabled}
          error={nameError}
        />

        <StyledTextField
          id="phone"
          label="Número Telefónico"
          type="tel"
          variant="outlined"
          placeholder="+1 234 567 890"
          value={client.phone}
          disabled={true} // Hacer el campo inmutable
        />
        <StyledTextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          placeholder="ejemplo@dominio.com"
          value={client.email}
          onChange={handleClientChange}
          disabled={emailDisabled}
          error={emailError}
        />
        <StyledTextField
          id="service"
          label="Seleccione un Servicio"
          variant="outlined"
          select
          value={selectedService.id}
          onChange={handleServiceChange}
          error={selectedServiceError}
        >
          {services.length > 0 ? (
            services.map((service) => (
              <MenuItem key={service.service_id} value={service.service_id}>
                {`${service.service_name} - $${service.price}`}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay servicios disponibles</MenuItem>
          )}
        </StyledTextField>
        <StyledTextField
          id="date"
          label="Seleccione una Fecha"
          type="date"
          value={selectedDate.format("YYYY-MM-DD")}
          onChange={handleDateChange}
          error={selectedDateError}
        />

        <StyledTextField
          id="time-slot"
          label="Horarios Disponibles"
          variant="outlined"
          select
          value={selectedSlot}
          onChange={handleSlotChange}
          error={selectedSlotError}
        >
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => (
              <MenuItem key={index} value={slot}>
                {slot}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay horarios disponibles</MenuItem>
          )}
        </StyledTextField>
        <Button
          variant="contained"
          color={buttonColor}
          onClick={handleClick}
          disabled={buttonClicked && buttonText !== "Error"} // Bloquea si está enviando o enviado
          sx={{
            width: "100%",
            backgroundColor:
              buttonText === "Enviado"
                ? "#4CAF50"
                : buttonText === "Enviando..."
                ? "#FF9800"
                : "#3A57E8",
            color: "#FFF",
            "&:disabled": {
              backgroundColor: buttonText === "Enviado" ? "#4CAF50" : "#FF9800", // Cambia color cuando está deshabilitado
              color: "#FFF",
              opacity: 0.8,
            },
          }}
        >
          {buttonText}
        </Button>

        {buttonText === "Enviado" && (
          <Alert
            variant="filled"
            severity="success"
            sx={{
              backgroundColor: "#D4EDDA",
              color: "#FFF",
              marginBottom: "15px",
              marginTop: "15px",
            }}
          >
            Su cita ha sido creada exitosamente.
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default Form;
