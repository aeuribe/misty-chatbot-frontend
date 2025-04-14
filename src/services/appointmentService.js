import axios from "axios";
import { loadAbort } from "../utilities/loadAbort.utility";


const API_URL = "http://localhost:3000/api";

export const createAppointment = (appointment) => {
  const controller = loadAbort();
  console.log("entre en el appointment create:", appointment);
  return { call: axios.post(`${API_URL}/appointments`, appointment, { signal: controller.signal }), controller };
};

export const createAppointments = async (appointmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/appointments`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response.data);
      throw new Error(error.response.data.message || "Error en la solicitud");
    } else if (error.request) {
      console.error("Sin respuesta del servidor:", error.request);
      throw new Error("No se recibió respuesta del servidor");
    } else {
      console.error("Error al configurar la solicitud:", error.message);
      throw new Error("Error en la configuración de la solicitud");
    }
  }
};

export const updateAppointment = async (
  appointmentId,
  businessId,
  clientId,
  serviceId,
  date,
  startTime,
  endTime,
  status
) => {
  try {
    console.log("Updating appointment:", {
      appointmentId,
      businessId,
      clientId,
      serviceId,
      date,
      startTime,
      endTime,
      status,
    });

    const response = await axios.put(`${API_URL}/appointments/${appointmentId}`, {
      businessId,
      clientId,
      serviceId,
      date,
      startTime,
      endTime,
      status,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error.response ? error.response.data : error.message);
    throw error; // Re-lanza el error para que el componente pueda manejarlo
  }
};

export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/appointments/${appointmentId}`
    );
    return response.data;
  } catch (error) {
    console.error("error en la respuesta:", error.response);
  }
};
export const getClientByNumber = (number) =>{
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/client/number/${number}`, {signal: controller.signal}), controller }
}

export const getAllAppointmentDataByNumber = (number) => {
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/appointments/number/${number}`, {signal: controller.signal}), controller }
}

