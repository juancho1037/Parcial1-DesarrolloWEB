const dateHelpers = {
  // Formatear fecha a string
  formatDate: (date) => {
    return new Date(date).toISOString().split("T")[0];
  },

  // Formatear fecha y hora
  formatDateTime: (date) => {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  },

  // Obtener diferencia en días entre dos fechas
  getDaysDifference: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Verificar si una fecha está en el pasado
  isPastDate: (date) => {
    return new Date(date) < new Date();
  },

  // Agregar días a una fecha
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  // Obtener rango de fechas para un viaje
  getTripDateRange: (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  },

  // Verificar si dos rangos de fechas se solapan
  doDateRangesOverlap: (start1, end1, start2, end2) => {
    return (
      new Date(start1) <= new Date(end2) && new Date(end1) >= new Date(start2)
    );
  },
};

module.exports = dateHelpers;
