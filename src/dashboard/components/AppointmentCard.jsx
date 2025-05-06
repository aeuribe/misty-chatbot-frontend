import React from "react";
import { FiTarget, FiClock, FiCalendar } from "react-icons/fi";
import { formatDateTime, formatHour } from "../../utilities/formatedDate.js";
import CustomButton from "../../components/CustomButton.jsx";
import CheckIcon from "../../assets/check-icon.jsx";
import { FiTrash2 } from "react-icons/fi";


const getStatusColor = (status) => {
  if (!status) return "bg-yellow-100 text-yellow-700";
  const s = status.toLowerCase();
  if (s === "completed") return "bg-green-100 text-green-700";
  if (s === "canceled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

const getStatusDotColor = (status) => {
  if (!status) return "bg-yellow-500";
  const s = status.toLowerCase();
  if (s === "completed") return "bg-green-500";
  if (s === "canceled") return "bg-red-500";
  return "bg-yellow-500";
};

const AppointmentCard = ({ item, openActionModal, openDeleteModal }) => {
  
  if (!item || !item.date) {
    console.error("Invalid appointment item:", item);
    return null;
  }

  const appointmentDate = new Date(item.date);
  const formattedDate = `${String(appointmentDate.getDate()).padStart(
    2,
    "0"
  )}${String(appointmentDate.getMonth() + 1).padStart(2, "0")}${appointmentDate
    .getFullYear()
    .toString()
    .slice(2, 4)}`;
  const appointmentId = `#${formattedDate}-${item.appointment_id}`;

  const statusClass = getStatusColor(item.status);
  const dotColor = getStatusDotColor(item.status);
  const statusLabel = item.status ? item.status.toUpperCase() : "PENDING";

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between min-h-[220px]">
      {/* Top Row: ID & Status */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-500 select-text">
          {appointmentId}
        </span>
        <div
          className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-2 ${statusClass}`}
        >
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          {statusLabel}
        </div>
      </div>

      {/* Cliente */}
      <h2 className="text-lg font-bold text-gray-900 mb-2 select-text">
        {item.client_name}
      </h2>

      {/* Info secundaria */}
      <div className="text-sm text-gray-600 space-y-2 flex flex-col mb-4 select-text">
        <div className="flex items-center gap-2">
          <FiTarget className="text-gray-500" />
          <span>
            {item.service_name} — ${item.price}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          <span>{formatDateTime(item.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-500" />
          <span>
            {formatHour(item.start_time)} - {formatHour(item.end_time)}
          </span>
        </div>
      </div>

      {/* Footer */}
      {item.status?.toLowerCase() === "canceled" ? (
        <div className="flex mt-auto pt-2">
          <CustomButton
            title="Delete canceled appointment"
            bg="bg-gray-100"
            textColor="text-gray-700"
            hoverBg="hover:bg-gray-200"
            onClick={() => openDeleteModal(item)}
          >
            <FiTrash2 className="w-5 h-5 text-gray-700" />
          </CustomButton>
        </div>
      ) : (
        item.status?.toLowerCase() !== "completed" && (
          <div className="flex flex-wrap gap-4 items-center mt-auto pt-2">
            <CustomButton
              title="Mark appointment as completed"
              onClick={() => openActionModal(item, "complete")}
            >
              <CheckIcon className="w-5 h-5 text-green-700" />
            </CustomButton>
            <CustomButton
              title="Cancel appointment"
              bg="bg-red-100"
              textColor="text-red-700"
              hoverBg="hover:bg-red-200"
              onClick={() => openActionModal(item, "cancel")}
            >
              ✖
            </CustomButton>
          </div>
        )
      )}

    </div>
  );
};

export default AppointmentCard;
