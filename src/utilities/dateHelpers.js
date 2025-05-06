export const getLocalISODateString = (date = new Date()) => {
    return date.toISOString().split("T")[0];
  };