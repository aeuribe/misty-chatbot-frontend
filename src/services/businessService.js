import axios from "axios";
const API_URL = 'http://localhost:3000/api';
import { loadAbort } from "../utilities/loadAbort.utility";
import businessSingleton from "./businessSingleton";

export const getBusinessById = (businessId) => {
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/business/${businessId}`, {signal: controller.signal}), controller }
}

export const getBusinessByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/business/email/${email}`);
    return response.data; // Devuelve solo los datos del negocio
  } catch (error) {
    console.error("Error al obtener negocio por email:", error);
    throw error; // Propaga el error para manejarlo fuera
  }
};

// Servicio que obtiene el negocio y lo guarda en el singleton
export const fetchAndStoreBusinessByEmail = async (email) => {
  const businessData = await getBusinessByEmail(email);
  businessSingleton.setBusinessData(businessData);
  return businessData;
};

// Servicio para obtener el negocio desde el singleton
export const getStoredBusinessData = () => {
  return businessSingleton.getBusinessData();
};