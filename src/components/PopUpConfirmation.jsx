// components/ConfirmationActionDialog.jsx
import React from "react";
import { formatDateTime } from "../utilities/formatedDate";

const ConfirmationActionDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  loading, 
  appointment,
  actionType 
}) => {
  if (!isOpen) return null;

  const actionMessages = {
    complete: {
      title: "Confirm Completion",
      message: "¿Estás seguro de marcar esta cita como completada?",
      button: "Mark as Completed"
    },
    cancel: {
      title: "Confirm Cancellation",
      message: "¿Estás seguro de cancelar esta cita?",
      button: "Cancel Appointment"
    }
  };

  const { title, message, button } = actionMessages[actionType] || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 mx-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-6">
          {message} <br/>
          <span className="font-semibold">{appointment?.client_name}</span> -{' '}
          <span className="font-semibold">{appointment?.service_name}</span> -{' '}
          {formatDateTime(appointment?.date)}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-md ${
              actionType === 'complete' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white transition-colors disabled:opacity-50`}
          >
            {loading ? "Procesando..." : button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationActionDialog;
