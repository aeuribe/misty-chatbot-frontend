import React, { useState, useMemo } from "react";
import {
  getAllAppointmentsByEmail,
  markAppointmentAsCompleted,
  markAppointmentAsCanceled,
  cancelAppointmentById,
} from "../services/appointmentService.js";
import { useAsync } from "../hooks/useAsyncClean";
import useFetchAndLoad from "../hooks/useFetchAndLoad.js";
import ConfirmationDialog from "./components/ConfirmationDialog.jsx";
import AppointmentCard from "./components/AppointmentCard.jsx"; // Nuevo, ver abajo
import PopUpConfirmDelete from "../components/PopUpConfirmDelete.jsx";
import { deleteAppointmentById } from "../services/appointmentService.js";
import ConfirmationActionDialog from "../components/PopUpConfirmation.jsx";

const mainTabs = ["Today", "Upcoming", "History"];
const historySubTabs = ["Completed", "Canceled", "Expired"];

function getLocalISODateString(date = new Date()) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

export default function AppointmentList({ email, searchTerm }) {
  const [mainTab, setMainTab] = useState(0);
  const [historyTab, setHistoryTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const { loading, callEndpoint } = useFetchAndLoad();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const [showActionModal, setShowActionModal] = useState(false);
  const [appointmentToAction, setAppointmentToAction] = useState(null);

  const openActionModal = (appointment, action) => {
    setAppointmentToAction(appointment);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleConfirmAction = async () => {
    if (!appointmentToAction || !actionType) return;

    try {
      let updatedAppointment;
      if (actionType === "complete") {
        updatedAppointment = await markAppointmentAsCompleted(
          appointmentToAction.appointment_id
        );
      } else if (actionType === "cancel") {
        updatedAppointment = await markAppointmentAsCanceled(
          appointmentToAction.appointment_id
        );
        console.log("updatedAppointment", updatedAppointment);
        console.log(
          "un appointment viejo",
          appointments.find(
            (a) => a.appointment_id === updatedAppointment.appointment_id
          )
        );
      }

      setAppointments((prev) =>
        prev.map((a) =>
          a.appointment_id === updatedAppointment.appointment_id
            ? { ...a, status: updatedAppointment.status }
            : a
        )
      );

      setShowActionModal(false);
      setAppointmentToAction(null);
      setActionType(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const openDeleteModal = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;
    try {
      await deleteAppointmentById(appointmentToDelete.appointment_id);
      setAppointments((prev) =>
        prev.filter(
          (a) => a.appointment_id !== appointmentToDelete.appointment_id
        )
      );
      setShowDeleteModal(false);
      setAppointmentToDelete(null);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };
  // Fetch appointments
  useAsync(
    () => callEndpoint(getAllAppointmentsByEmail(email)),
    (data) => setAppointments(Array.isArray(data) ? data : []),
    null,
    null,
    []
  );

  // Helpers
  const getDateTime = (item) => {
    const datePart = item.date.split("T")[0];
    return new Date(`${datePart}T${item.start_time}`);
  };

  const now = new Date();
  const todayISO = getLocalISODateString(now);

  // Filtrado y agrupación
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    const query = searchTerm.toLowerCase();
    return appointments.filter(
      (item) =>
        item.client_name?.toLowerCase().includes(query) ||
        item.service_name?.toLowerCase().includes(query) ||
        item.date?.toLowerCase().includes(query) ||
        item.start_time?.toLowerCase().includes(query) ||
        item.end_time?.toLowerCase().includes(query)
    );
  }, [appointments, searchTerm]);

  const {
    pastAppointments,
    appointmentsToday,
    otherAppointments,
    canceledAppointments,
    completedAppointments,
  } = useMemo(() => {
    if (!Array.isArray(filteredAppointments)) return {};
    const sorted = [...filteredAppointments].sort(
      (a, b) => getDateTime(a) - getDateTime(b)
    );
    const past = sorted.filter(
      (item) =>
        getDateTime(item) < now && item.status?.toLowerCase() === "pending"
    );
    const canceled = sorted.filter(
      (item) => item.status?.toLowerCase() === "canceled"
    );
    const completed = sorted.filter(
      (item) => item.status?.toLowerCase() === "completed"
    );
    const today = sorted.filter(
      (item) => getLocalISODateString(new Date(item.date)) === todayISO
    );
    const other = sorted.filter(
      (item) =>
        getLocalISODateString(new Date(item.date)) > todayISO &&
        item.status?.toLowerCase() !== "canceled" &&
        item.status?.toLowerCase() !== "completed"
    );
    return {
      pastAppointments: past,
      appointmentsToday: today,
      otherAppointments: other,
      canceledAppointments: canceled,
      completedAppointments: completed,
    };
  }, [filteredAppointments, now]);

  // Acciones
  const openDialog = (appointment, action) => {
    console.log("openDialog called", appointment, action);
    setSelectedAppointment(appointment);
    setActionType(action);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleConfirm = async () => {
    if (actionType === "complete") {
      await markAppointmentAsCompleted(selectedAppointment.appointment_id);
      setAppointments((prev) =>
        prev.map((item) =>
          item.appointment_id === selectedAppointment.appointment_id
            ? { ...item, status: "completed" }
            : item
        )
      );
    } else if (actionType === "cancel") {
      await cancelAppointmentById(selectedAppointment.appointment_id);
      setAppointments((prev) =>
        prev.map((item) =>
          item.appointment_id === selectedAppointment.appointment_id
            ? { ...item, status: "canceled" }
            : item
        )
      );
    }
    closeDialog();
  };

  // Render helpers
  const renderAppointments = (appointments) =>
    appointments && appointments.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {appointments.map((item) => (
          <AppointmentCard
            key={item.appointment_id}
            item={item}
            openActionModal={openActionModal}
            openDeleteModal={openDeleteModal}
          />
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-400 py-8">
        There are no appointments to display.
      </div>
    );
  // UI
  return (
    <div className="w-full min-h-screen mt-4">
      {/* Tabs principales */}
      <div className="flex space-x-2 mb-4 ml-4 bg-[#F5F7FA]">
        {mainTabs.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-semibold shadow-lg ${
              mainTab === i
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
            onClick={() => setMainTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="bg-[#F5F7FA] rounded-b-lg p-4 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {mainTab === 0 && renderAppointments(appointmentsToday)}
            {mainTab === 1 && renderAppointments(otherAppointments)}
            {mainTab === 2 && (
              <>
                {/* Subtabs */}
                <div className="flex space-x-2 mb-4">
                  {historySubTabs.map((tab, i) => (
                    <button
                      key={tab}
                      className={`px-3 py-1 rounded font-medium text-sm ${
                        historyTab === i
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500 hover:bg-blue-50"
                      }`}
                      onClick={() => setHistoryTab(i)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {historyTab === 0 && renderAppointments(completedAppointments)}
                {historyTab === 1 && renderAppointments(canceledAppointments)}
                {historyTab === 2 && renderAppointments(pastAppointments)}
              </>
            )}
          </>
        )}
      </div>

      {/* Confirmación */}

      <PopUpConfirmDelete
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={loading}
        serviceName={appointmentToDelete?.service_name || "esta cita"}
      />
      <ConfirmationActionDialog
        isOpen={showActionModal}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setShowActionModal(false);
          setAppointmentToAction(null);
          setActionType(null);
        }}
        loading={loading}
        appointment={appointmentToAction}
        actionType={actionType}
      />
    </div>
  );
}
