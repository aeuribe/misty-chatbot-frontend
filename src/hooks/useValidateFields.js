import { useState } from "react";

export const useValidateFields = () => {
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selectedServiceError, setSelectedServiceError] = useState(false);
  const [selectedDateError, setSelectedDateError] = useState(false);
  const [selectedSlotError, setSelectedSlotError] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validate = (name, email, selectedService, selectedDate, selectedSlot) => {
    let isValidated = true;

    // Validación de campos
    if(!name) {
      isValidated = false;
      setNameError(true);
    } else {
      setNameError(false);
    }

    if (!email) {
      isValidated = false;
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (selectedService){
      if(selectedService.id === '') {
        isValidated = false;
        setSelectedServiceError(true);
      } else {
        setSelectedServiceError(false);
      }
    }
    if(!selectedDate) {
      isValidated = false;
      setSelectedDateError(true);
    } else {
      setSelectedDateError(false);
    }

    if(!selectedSlot) {
      isValidated = false;
      setSelectedSlotError(true);
    } else {
      setSelectedSlotError(false);
    }

    setIsValid(isValidated); // ✅ Actualiza isValid una sola vez
    return isValidated;
  };

  return {
    nameError,
    emailError,
    selectedServiceError,
    selectedDateError,
    selectedSlotError,
    isValid,
    validate
  };
};
