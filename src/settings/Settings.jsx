import React, { useState, useEffect } from "react";
import CompanyInfo from "./CompanyInfo";
import { updateBusiness } from "../services/businessService";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Settings = ({ business }) => {
  // Estado local para edición de datos del negocio, inicializado con la prop
  const [editableBusiness, setEditableBusiness] = useState({
    business_name: "",
    email: "",
    number: "",
    address: "",
  });

  // Mock inicial de horarios (puedes reemplazarlo con prop o API)
  const [businessHours, setBusinessHours] = useState([
    {
      business_hours_id: 1,
      day_of_week: "Monday",
      open_time: "09:00",
      close_time: "17:00",
      break_start: "12:30",
      break_end: "13:30",
    },
    {
      business_hours_id: 2,
      day_of_week: "Tuesday",
      open_time: "09:00",
      close_time: "17:00",
      break_start: "12:30",
      break_end: "13:30",
    },
  ]);

  // Estado para nuevo horario
  const [newHour, setNewHour] = useState({
    day_of_week: "Monday",
    open_time: "09:00",
    close_time: "17:00",
    break_start: "12:30",
    break_end: "13:30",
  });

  // Sincronizar estado local con prop business cuando cambie
  useEffect(() => {
    if (business) {
      setEditableBusiness({
        business_name: business.business_name || "",
        email: business.email || "",
        number: business.number || "",
        address: business.address || "",
      });
    }
  }, [business]);

  // Manejar cambio en nombre o dirección editable
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios en nombre o dirección (aquí deberías llamar API o función prop)
  const handleSaveInfo = async () => {
    console.log("business: ",business);
    const businessName = editableBusiness.business_name.trim();
    const address = editableBusiness.address.trim();
    const businessid = business.business_id;

    console.log("id: ",id);
  
    if (businessName === "") {
      alert("Business name cannot be empty");
      return;
    }
    if (address === "") {
      alert("Address cannot be empty");
      return;
    }
  
    try {
      // Suponiendo que tienes el businessId en el prop business
      await updateBusiness(id, businessName, address);
  
      alert("Business info updated successfully!");
  
      // Opcional: actualizar estado local o recargar datos
      setEditableBusiness(prev => ({
        ...prev,
        business_name: businessName,
        address: address,
      }));
  
    } catch (error) {
      console.error("Error updating business:", error);
      alert(`Error updating business: ${error.message}`);
    }
  };

  // Manejar cambios en formulario horario
  const handleHourChange = (e) => {
    const { name, value } = e.target;
    setNewHour((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar nuevo horario
  const handleAddHour = () => {
    const { open_time, close_time, break_start, break_end, day_of_week } = newHour;

    if (open_time >= close_time) {
      alert("Open time must be before close time");
      return;
    }
    if (break_start >= break_end) {
      alert("Break start must be before break end");
      return;
    }
    if (break_start < open_time || break_end > close_time) {
      alert("Break must be within open and close times");
      return;
    }

    if (businessHours.some((h) => h.day_of_week === day_of_week)) {
      alert("Schedule for this day already exists");
      return;
    }

    const newId =
      businessHours.length > 0
        ? Math.max(...businessHours.map((h) => h.business_hours_id)) + 1
        : 1;

    setBusinessHours((prev) => [
      ...prev,
      { business_hours_id: newId, ...newHour },
    ]);

    // Reset formulario
    setNewHour({
      day_of_week: "Monday",
      open_time: "09:00",
      close_time: "17:00",
      break_start: "12:30",
      break_end: "13:30",
    });
  };

  // Eliminar horario
  const handleDeleteHour = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setBusinessHours((prev) => prev.filter((h) => h.business_hours_id !== id));
    }
  };

  return (
    <div className="p-6 max-w-4xl ">

      {/* Company Info */}
      <CompanyInfo editableBusiness={editableBusiness} onInputChange={handleInputChange} onSave={handleSaveInfo}/>
      {/* Business Hours */}
      <section className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-[#343C6A]">
          Business Hours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl items-end mb-6">
          <div>
            <label
              htmlFor="day_of_week"
              className="block font-medium text-gray-700 mb-1"
            >
              Day of Week
            </label>
            <select
              id="day_of_week"
              name="day_of_week"
              value={newHour.day_of_week}
              onChange={handleHourChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="open_time"
              className="block font-medium text-gray-700 mb-1"
            >
              Open Time
            </label>
            <input
              id="open_time"
              name="open_time"
              type="time"
              value={newHour.open_time}
              onChange={handleHourChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="close_time"
              className="block font-medium text-gray-700 mb-1"
            >
              Close Time
            </label>
            <input
              id="close_time"
              name="close_time"
              type="time"
              value={newHour.close_time}
              onChange={handleHourChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="break_start"
              className="block font-medium text-gray-700 mb-1"
            >
              Break Start
            </label>
            <input
              id="break_start"
              name="break_start"
              type="time"
              value={newHour.break_start}
              onChange={handleHourChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="break_end"
              className="block font-medium text-gray-700 mb-1"
            >
              Break End
            </label>
            <input
              id="break_end"
              name="break_end"
              type="time"
              value={newHour.break_end}
              onChange={handleHourChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleAddHour}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Add Business Hour
        </button>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Day
                </th>
                <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Open
                </th>
                <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Close
                </th>
                <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Break Start
                </th>
                <th className="px-4 py-2 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Break End
                </th>
                <th className="px-4 py-2 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {businessHours.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No business hours set yet.
                  </td>
                </tr>
              ) : (
                businessHours.map((hour) => (
                  <tr key={hour.business_hours_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b border-gray-300">
                      {hour.day_of_week}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {hour.open_time}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {hour.close_time}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {hour.break_start}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300">
                      {hour.break_end}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 text-center">
                      <button
                        onClick={() => handleDeleteHour(hour.business_hours_id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        aria-label={`Delete business hours for ${hour.day_of_week}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Settings;
