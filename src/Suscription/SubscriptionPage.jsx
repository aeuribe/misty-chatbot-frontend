import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getStoredBusinessData } from "../services/businessService.js";
import {
  createStripeCustomer,
  createCheckoutSession,
} from "../services/stripeService.js";
import { updateStripeCustomerId } from "../services/businessService.js";
import { loadStripe } from "@stripe/stripe-js";
import { getSubscriptionByBusinessId } from "../services/subscriptionService.js";

const SubscriptionPage = ({ business }) => {
  const { user } = useAuth0();
  const businessData = getStoredBusinessData();

  // El estado de la suscripción: null = nunca se ha suscrito
  const [subscription, setSubscription] = useState(null);

  // Simulación de carga de suscripción (reemplaza esto con tu lógica real)
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (business.stripe_customer_id) {
        try {
          // Llama a tu backend para obtener la suscripción REAL
          const subscriptionData = await getSubscriptionByBusinessId(
            business.business_id
          );
          console.log("subscriptionData: ", subscriptionData);
          if (subscriptionData) {
            setSubscription({
              planName: subscriptionData.planName,
              status: subscriptionData.status,
              startDate: subscriptionData.current_period_start,
              nextBilling: subscriptionData.current_period_end,
            });
          } else {
            // Si no hay suscripción, limpia el estado
            console.log("el business aun no tiene subscripcion ");
            setSubscription(null);
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [business.stripe_customer_id]);

  // Lógica de estado
  const isFirstTime = !business.stripe_customer_id || subscription === null;
  const isActive = subscription?.status === "active";
  const isRenew = subscription && !isActive;
  const stripePromise = loadStripe(
    "pk_test_51RMJBcR2dbxqYM1Q13A1IbccFvbV5XSIJEtE8hJN0OWmE9nsq2qT8MoTasrV9OWc61bMSpx0QynqghWqHFBnZddT00IutxaNvM"
  );

  // Handlers
  const handleSubscribe = async () => {
    const businessId = business.business_id;
    let customerId = business.stripe_customer_id;

    try {
      // 1. Crear cliente Stripe solo si no existe
      if (!customerId) {
        const customer = await createStripeCustomer({
          name: business.business_name,
          email: business.email,
        });

        if (!customer) {
          throw new Error("No se pudo crear el cliente en Stripe");
        }

        customerId = customer;

        // 2. Actualizar el negocio con el stripe_customer_id
        await updateStripeCustomerId(businessId, customerId);

        console.log("Cliente Stripe creado:", customerId);
      } else {
        console.log("Usando cliente Stripe existente:", customerId);
      }

      // 3. Crear sesión de checkout con el customerId y businessId
      const sessionId = await createCheckoutSession(customerId, businessId);

      if (!sessionId) {
        throw new Error("No se pudo crear la sesión de checkout");
      }

      // 4. Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error redirigiendo a Stripe Checkout:", error.message);
        // Aquí puedes mostrar un mensaje al usuario
      }
    } catch (error) {
      console.error("Error en suscripción:", error.message);
      // Aquí puedes mostrar un mensaje de error amigable al usuario
    }
  };

  const handlePay = async () => {
    const businessId = business.business_id;
    let customerId = business.stripe_customer_id;
  
    try {
      if (!customerId) {
        // Si no hay cliente Stripe, crea uno (por si acaso)
        const customer = await createStripeCustomer({
          name: business.business_name,
          email: business.email,
        });
  
        if (!customer) {
          throw new Error("No se pudo crear el cliente en Stripe");
        }
  
        customerId = customer;
  
        await updateStripeCustomerId(businessId, customerId);
  
        console.log("Cliente Stripe creado para renovación:", customerId);
      } else {
        console.log("Usando cliente Stripe existente para renovación:", customerId);
      }
  
      // Crear sesión de checkout para renovar la suscripción
      // Aquí asumo que tu backend sabe manejar que es renovación por businessId
      const sessionId = await createCheckoutSession(customerId, businessId);
  
      if (!sessionId) {
        throw new Error("No se pudo crear la sesión de checkout para renovación");
      }
  
      // Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
  
      if (error) {
        console.error("Error redirigiendo a Stripe Checkout para renovación:", error.message);
        // Mostrar mensaje al usuario si quieres
      }
    } catch (error) {
      console.error("Error en renovación de suscripción:", error.message);
      // Mostrar mensaje de error amigable al usuario si quieres
    }
  };  

  return (
    <div className="m-4 rounded-xl bg-white p-6 shadow-md max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user?.picture || "https://via.placeholder.com/40?text=U"}
          alt="User"
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-xl font-semibold text-[#343C6A]">
            {business.business_name}
          </h1>
          <p className="text-sm text-gray-500">
            {isFirstTime ? "No subscription yet" : "Subscription details"}
          </p>
        </div>
      </div>

      {isFirstTime && (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-[#343C6A]">
            You are not subscribed yet
          </h2>
          <p className="text-gray-600">
            Start your subscription to unlock all premium features.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 border text-left">
            <h3 className="text-sm font-medium text-[#343C6A] mb-2">
              Your plan includes:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Appointment automation</li>
              <li>Business hours customization</li>
              <li>Client reminders</li>
              <li>WhatsApp integration</li>
              <li>Priority support</li>
            </ul>
          </div>
          <button
            onClick={handleSubscribe}
            className="bg-[#343C6A] text-white px-6 py-2 rounded-md hover:bg-[#2b3059]"
          >
            Subscribe Now
          </button>
        </div>
      )}

      {!isFirstTime && subscription && (
        <div className="bg-gray-50 rounded-xl p-5 space-y-6 border border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#343C6A]">
              {subscription.planName}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <InfoRow
              label="Access until"
              value={new Date(subscription.nextBilling).toLocaleDateString()}
            />
            <InfoRow
              label="Start date"
              value={new Date(subscription.startDate).toLocaleDateString()}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#343C6A] mb-2">
              Your plan includes:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Appointment automation</li>
              <li>Business hours customization</li>
              <li>Client reminders</li>
              <li>WhatsApp integration</li>
              <li>Priority support</li>
            </ul>
          </div>

          {isRenew && (
            <div className="text-right">
              <button
                onClick={handlePay}
                className="bg-[#343C6A] text-white px-5 py-2 rounded-md hover:bg-[#2b3059]"
              >
                Renew Subscription
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-1 border-gray-200">
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

export default SubscriptionPage;
