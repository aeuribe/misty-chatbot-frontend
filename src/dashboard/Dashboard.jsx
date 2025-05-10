// Dashboard.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Services from "../MyServices/Services";
import SubscriptionPage from "../Suscription/SubscriptionPage";
import {
  fetchAndStoreBusinessByEmail,
  getStoredBusinessData,
} from "../services/businessService";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [activeSection, setActiveSection] = useState("Appointments");
  const [searchTerm, setSearchTerm] = useState("");
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      console.log("user.email: ", user.email);
      fetchAndStoreBusinessByEmail(user.email)
        .then((data) => setBusiness(data))
        .catch(console.error);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (activeSection === "Subscription") {
      console.log("business: ", business);
    }
  }, [activeSection, business]);
  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      {/* Pasamos el estado de la sección activa al Navbar */}
      <Navbar
        activeSection={activeSection}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Pasamos la función que actualiza la sección activa al Sidebar */}
      <Sidebar setActiveSection={setActiveSection} />

      <div className="pt-20 pl-60 min-h-screen overflow-y-auto">
        {/* Contenido principal con scroll si es necesario */}
        {isAuthenticated && (
          <>
            {activeSection === "Appointments" && (
              <Table email={user.email} searchTerm={searchTerm} />
            )}
            {activeSection === "My Services" && (
              <Services searchTerm={searchTerm} email={user.email} />
            )}
            {activeSection === "Subscription" && (
              <SubscriptionPage business={business} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
