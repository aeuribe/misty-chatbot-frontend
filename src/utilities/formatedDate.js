export function formatDateTime(dateString) {
    if (!dateString) return 'Fecha no disponible';
  
    const date = new Date(dateString);
  
    if (isNaN(date)) return 'Fecha inválida';
  
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  export function formatHour(hourStr) {
    if (!hourStr) return 'Hora no disponible';
  
    const [hours, minutes, seconds] = hourStr.split(':');
    if (!hours || !minutes) return 'Hora inválida';
  
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), Number(seconds ?? 0));
  
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  
  