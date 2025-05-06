import axios from "axios";
import { loadAbort } from "../utilities/loadAbort.utility";


const API_URL = 'http://localhost:3000/api';

export const getServicesByBusinessId = (businessId) => {
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/services/${businessId}/services`, {signal: controller.signal}), controller}
}

export const getServicesByBusinessEmail = (email) => {
  console.log("he recibido el email para getServices: ", email);
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/services/by-email/${email}`, { signal: controller.signal}), controller} // Devuelve los servicios obtenidos
};

// services/serviceServices.js

export async function updateService(serviceId, fieldsToUpdate) {
  try {
    const response = await axios.put(`${API_URL}/services/${serviceId}`, fieldsToUpdate, {
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
      throw new Error(error.message || 'Error updating service');
    }
  }
}

export async function deleteService(serviceId) {
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}`, {
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
      throw new Error(error.message || 'Error deleting service');
    }
  }
}

export const createService = async (serviceData) => {
  try {
    const response = await axios.post(`${API_URL}/services`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    // Manejo de errores robusto:
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // Envía el mensaje del backend
    } else {
      throw new Error(error.message || 'Error creating service'); // Error genérico
    }
  }
};
