import axios from "axios";
import { loadAbort } from "../utilities/loadAbort.utility";


const API_URL = 'http://localhost:3000/api';

export const getClientByNumber = (number) =>{
    const controller = loadAbort();
    return { call: axios.get(`${API_URL}/client/number/${number}`, {signal: controller.signal}), controller }
}

// export const createClient = async (client) => {
//     const controller = loadAbort();
//     console.log("creando cliente con:", client);
//     return { call: axios.post(`${API_URL}/client`, client, { signal: loadAbort().signal }), controller }
// }

export const createClient = async (client) => {
    const controller = loadAbort();
    try {
      console.log("Creando cliente con:", client);
      const response = await axios.post(`${API_URL}/client`, client, {
        signal: controller.signal,
      });
      return response.data; // Retorna el cliente creado con id
    } catch (error) {
      console.error("Error creando cliente:", error);
      throw error;
    }
  };