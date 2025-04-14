import axios from "axios";
import { loadAbort } from "../utilities/loadAbort.utility";

const API_URL = 'http://localhost:3000/api';

export const getAvailableSlots = (businessId, date) => {
    const controller = loadAbort()
    return { call: axios.get(`${API_URL}/available-slots`, { params: { businessId, date }}, {signal: controller.signal}), controller }
}
