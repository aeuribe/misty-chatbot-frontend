import axios from "axios";
import { loadAbort } from "../utilities/loadAbort.utility";


const API_URL = 'http://localhost:3000/api';

export const getServicesByBusinessId = (businessId) => {
  const controller = loadAbort();
  return { call: axios.get(`${API_URL}/services/${businessId}/services`, {signal: controller.signal}), controller}
}
