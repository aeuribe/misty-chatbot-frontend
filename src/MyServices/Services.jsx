import React, { useState } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiGrid,
  FiCircle,
  FiAperture,
} from "react-icons/fi";
import { useAsync } from "../hooks/useAsyncClean";
import useFetchAndLoad from "../hooks/useFetchAndLoad.js";
import { getServicesByBusinessEmail } from "../services/serviceServices.js";
import ServiceForm from "./ServiceForm"; // Ajusta la ruta según tu estructura
import PopUpConfirmDelete from "../components/PopUpConfirmDelete.jsx";
import { updateService, deleteService } from "../services/serviceServices.js";
import { getStoredBusinessData } from "../services/businessService.js";
import { createService } from "../services/serviceServices.js";

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
];

const getRandomColorClass = (id) => {
  return colors[id % colors.length]; // Determinístico pero distribuido
};

// const handleAddService = async (formData) => {
//   // await callEndpoint(createService(formData));
//   await getServices();
//   setShowForm(false);
// };

const Services = ({ searchTerm = "", email }) => {
  const [services, setServices] = useState([]);
  const { loading, callEndpoint } = useFetchAndLoad();
  const [showForm, setShowForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const businessData = getStoredBusinessData();

  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      // Llama a la API para eliminar el servicio
      await deleteService(serviceToDelete.service_id);

      // Actualiza el estado local eliminando el servicio borrado
      setServices((prevServices) =>
        prevServices.filter(
          (service) => service.service_id !== serviceToDelete.service_id
        )
      );

      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      // Aquí puedes mostrar un mensaje de error al usuario si quieres
    }
  };

  const handleSubmitService = async (formData) => {
    try {
      // Actualizar servicio existente y obtener el servicio actualizado
      const updatedService = await updateService(
        editingService.service_id,
        formData
      );

      // Actualizar el estado local reemplazando el servicio modificado
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.service_id === updatedService.service_id
            ? updatedService
            : service
        )
      );

      setShowForm(false);
      setEditingService(null);
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      // Puedes agregar manejo visual del error aquí (toast, modal, etc)
    }
  };

  const handleAddService = async (formData) => {
    console.log("la data del submit es:", formData);
    console.log("la data del business es:", businessData);
  
    if (!businessData || !businessData.business_id) {
      console.error("No hay datos del negocio para asociar el servicio");
      return;
    }
  
    // Construimos el objeto con los datos para enviar al backend
    const servicePayload = {
      businessId: businessData.business_id,
      serviceName: formData.service_name,
      description: formData.description,
      durationMin: formData.duration_min,
      price: formData.price,
    };
  
    try {
      const newService = await createService(servicePayload);
      console.log("Servicio creado exitosamente:", newService);
      setServices((prevServices) => [...prevServices, newService]);
      setShowAddForm(false); // Cerramos el formulario siempre
      // Aquí puedes actualizar el estado para reflejar el nuevo servicio en la UI
    } catch (error) {
      console.error("Error al crear el servicio:", error.message);
    }
  };

  const filteredServices = services.filter((service) =>
    (service?.service_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  //Services Data Handling
  const successFunctionGetServices = (data) => {
    console.log("esta es la data de servicios para el email: ", email);
    console.log("data: ", data);
    if (!data) return;
    setServices(data);
  };
  const getServices = async () => {
    return callEndpoint(getServicesByBusinessEmail(email));
  };
  useAsync(getServices, successFunctionGetServices, null, null, []);

  return (
    <div className="m-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-8xl h-full min-h-screen p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Service List</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            <FiPlus size={16} /> Add new service
          </button>
        </div>

        {/* Table or Empty Message */}
        <div className="overflow-x-auto">
          {filteredServices.length > 0 ? (
            <table className="w-full table-auto border-collapse text-sm">
              <thead className="bg-[#F5F7FA] text-left">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold text-center">Duration</th>
                  <th className="p-3 font-semibold text-right">Price</th>
                  <th className="p-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => {
                  const colorClass = getRandomColorClass(service.id);
                  return (
                    <tr
                      key={service.service_id}
                      className="border-b hover:bg-[#F5F7FA]"
                    >
                      <td className="p-3 font-semibold flex items-center gap-2">
                        {service.service_name}
                      </td>
                      <td className="p-3 truncate max-w-[200px]">
                        {service.description}
                      </td>
                      <td className="p-3 text-center">
                        {service.duration_min}
                      </td>
                      <td className="p-3 text-right">${service.price}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                            title="Edit"
                            onClick={() => {
                              setEditingService(service);
                              setShowForm(true);
                            }}
                          >
                            <FiEdit size={17} />
                          </button>
                          <button
                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                            title="Delete"
                            onClick={() => openDeleteModal(service)}
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-16">
              No services found.
            </div>
          )}
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <ServiceForm
            onSubmit={handleSubmitService}
            onCancel={() => {
              setShowForm(false);
              setEditingService(null);
            }}
            loading={loading}
            initialData={editingService}
          />
        </div>
      )}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <ServiceForm
            onSubmit={handleAddService}
            onCancel={() => {
              setShowAddForm(false);
              setEditingService(null);
            }}
            loading={loading}
            initialData={editingService}
          />
        </div>
      )}
      <PopUpConfirmDelete
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={loading}
        serviceName={serviceToDelete?.service_name}
      />
    </div>
  );
};

export default Services;
