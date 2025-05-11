// src/services/stripeService.js
import axios from "axios";

const API_URL = 'http://localhost:3000/api';

export async function createStripeCustomer({ email, name }) {
  try {
    const response = await axios.post(`${API_URL}/stripe/create-customer`, {
      email,
      name,
    });
    // El backend responde con { stripe_customer_id: ... }
    return response.data.stripe_customer_id;
  } catch (error) {
    // Manejo de error: puede ser de red o del backend
    const message =
      error.response?.data?.error || error.message || "Error creating Stripe customer";
    throw new Error(message);
  }
}

export async function createCheckoutSession(stripe_customer_id, business_id) {
    try {
      const response = await axios.post(`${API_URL}/stripe/create-checkout-session`, {
        stripe_customer_id,
        business_id,
      });
      // El backend responde con { id: session.id }
      return response.data.id; // id de la sesión de Stripe Checkout
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || "Error creating checkout session";
      throw new Error(message);
    }
  }

  // stripeService.js
export async function getSubscriptionByCustomerId(stripeCustomerId) {
  try {
    const response = await axios.get(`${API_URL}/subscriptions?customer=${stripeCustomerId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error fetching subscription");
  }
}
