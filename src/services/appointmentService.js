import axios from "axios";
import { loadAbort } from "../utilities/loadAbort.utility";


const API_URL = "http://localhost:3000/api";

export const createAppointment = (appointment) => {
  const controller = loadAbort();
  console.log("entre en el appointment create:", appointment);
  return { call: axios.post(`${API_URL}/appointments`, appointment, { signal: controller.signal }), controller };
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

export const getAllAppointmentsByEmail = (email) => {
  console.log("he recibido el email:",email);
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/appointments/email/${email}`, {signal: controller.signal}), controller }
}

export const markAppointmentAsCompleted = async (appointmentId) => {
  try {
    const response = await axios.put(
      `${API_URL}/appointments/${appointmentId}/status`, // <-- aquí el cambio
      { status: "completed" }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error completing appointment");
  }
};

export const markAppointmentAsCanceled = async (appointmentId) => {
  try {
    const response = await axios.put(
      `${API_URL}/appointments/${appointmentId}/status`, // <-- aquí el cambio
      { status: "canceled" }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error canceling appointment");
  }
};



export const cancelAppointmentById = async (appointmentId) => {
  try {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}/status`, { status: "canceled" });
    console.log("Cita cancelada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al marcar cita como completada:", error);
    throw error;
  }
}

export async function deleteAppointmentById(appointmentId) {
  try {
    const response = await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // axios pone la respuesta JSON en data
  } catch (error) {
    // Manejo de error más robusto
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(error.message || 'Error deleting appointment');
    }
  }
}