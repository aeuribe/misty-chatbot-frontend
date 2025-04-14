export const calculateEndTime = (startTime, duration) =>{
    const startDateTime = new Date(`1970-01-01T${startTime}:00`);
    const durationInMinutes = duration;
    const endDateTime = new Date(
      startDateTime.getTime() + durationInMinutes * 60 * 1000
    );
    const endTimeHours = endDateTime.getHours().toString().padStart(2, "0");
    const endTimeMinutes = endDateTime.getMinutes().toString().padStart(2, "0");

    return `${endTimeHours}:${endTimeMinutes}`;
}