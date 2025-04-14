import dayjs from "dayjs";

export const filterSlots = (slots, date) => {
  let result = [];
  const now = dayjs();
  result = slots.filter((slot) => {
    const slotDateTime = dayjs(`${date} ${slot}`, "YYYY-MM-DD HH:mm");
    return slotDateTime.isAfter(now);
  });
  return result;
};
