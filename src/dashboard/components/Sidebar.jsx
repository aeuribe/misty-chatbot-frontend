import React, { useState } from "react";
import { BsCalendar2Date } from "react-icons/bs";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { FiCreditCard, FiSettings } from "react-icons/fi"; // Nuevos íconos
import "../dashboard.css";

const Sidebar = ({ setActiveSection }) => {
  const [activeButton, setActiveButton] = useState("appointments"); // Estado para el botón activo

  const buttons = [
    {
      id: "appointments",
      icon: <BsCalendar2Date className="w-[25px] h-[25px]" />,
      label: "Appointments",
    },
    {
      id: "services",
      icon: <HiOutlineSquares2X2 className="w-[25px] h-[25px]" />,
      label: "My Services",
    },
    {
      id: "subscription",
      icon: <FiCreditCard className="w-[25px] h-[25px]" />,
      label: "Subscription",
    },
    {
      id: "settings",
      icon: <FiSettings className="w-[25px] h-[25px]" />,
      label: "Settings",
    },
  ];

  const handleButtonClick = (btn) => {
    setActiveButton(btn.id); // Cambiar el botón activo
    setActiveSection(btn.label); // Actualizar la sección activa
  };

  return (
    <div className="fixed top-0 left-0 w-60 h-screen bg-white z-30 border-r border-gray-200">
      <div className="w-full h-20 flex flex-col items-center justify-center">
        <p className="text-[#343C6A] font-extrabold text-2xl">Misty | Chatbot</p>
      </div>

      <div className="flex flex-col">
        {buttons.map((btn) => {
          const isActive = activeButton === btn.id; // Verificar si el botón está activo
          return (
            <button
              key={btn.id}
              onClick={() => handleButtonClick(btn)} // Llamada a la función al hacer clic
              className={`relative h-[60px] flex items-center pl-[44px] mt-4 transition-all duration-500 ease-in-out`}
            >
              <div
                className={`absolute left-0 top-0 w-[6px] h-[60px] bg-[#2D60FF] rounded-r-[10px] transition-opacity duration-500 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Icon */}
              <div
                className={`mr-4 transition-all duration-500 ease-in-out ${
                  isActive
                    ? "text-[#2D60FF]"
                    : "text-[#B1B1B1] group-hover:text-[#2D60FF]"
                }`}
              >
                {React.cloneElement(btn.icon, {
                  className: `w-[25px] h-[25px] transition-all duration-500 ease-in-out ${
                    isActive
                      ? "text-[#2D60FF]"
                      : "text-[#B1B1B1] group-hover:text-[#2D60FF]"
                  }`,
                })}
              </div>
              {/* Text */}
              <span
                className={`font-inter font-medium text-[18px] transition-all duration-500 ease-in-out ${
                  isActive
                    ? "text-[#2D60FF]"
                    : "text-[#B1B1B1] group-hover:text-[#2D60FF]"
                }`}
              >
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
