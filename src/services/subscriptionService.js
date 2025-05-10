import axios from "axios";

const API_URL = "http://localhost:3000/api";

export async function getSubscriptionByBusinessId(businessId) {
  try {
    const response = await axios.get(`${API_URL}/subscription/${businessId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Error fetching subscription"
    );
  }
}

export async function createSubscription(subscriptionData) {
  try {
    const response = await axios.post(
      `${API_URL}/subscription`,
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Error creating subscription"
    );
  }
}
