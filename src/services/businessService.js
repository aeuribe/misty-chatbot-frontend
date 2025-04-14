import axios from "axios";
const API_URL = 'http://localhost:3000/api';
import { loadAbort } from "../utilities/loadAbort.utility";

export const getBusinessById = (businessId) => {
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/business/${businessId}`, {signal: controller.signal}), controller }
}

