import { defineStore } from "pinia";
import axios from "axios";
import { useAppStore } from "./app";

export const useTripsStore = defineStore("trips", {
  state: () => ({
    trips: [],
    currentTrip: null,
    loading: false,
    filters: {
      search: "",
      status: "all",
      date: null,
    },
  }),

  getters: {
    filteredTrips: (state) => {
      let filtered = [...state.trips];

      // Aplicar filtro de búsqueda
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(
          (trip) =>
            trip.title.toLowerCase().includes(searchTerm) ||
            trip.destination.toLowerCase().includes(searchTerm)
        );
      }

      // Aplicar filtro de estado
      if (state.filters.status !== "all") {
        filtered = filtered.filter(
          (trip) => trip.status === state.filters.status
        );
      }

      // Aplicar filtro de fecha
      if (state.filters.date) {
        filtered = filtered.filter((trip) => {
          const tripDate = new Date(trip.startDate);
          const filterDate = new Date(state.filters.date);
          return tripDate >= filterDate;
        });
      }

      return filtered;
    },

    upcomingTrips: (state) => {
      const today = new Date();
      return state.trips.filter((trip) => new Date(trip.startDate) >= today);
    },
  },

  actions: {
    async fetchTrips() {
      this.loading = true;
      const appStore = useAppStore();

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/trips`
        );
        this.trips = response.data;
      } catch (error) {
        console.error("Error al obtener viajes:", error);
        appStore.showSnackbar({
          text: "Error al cargar los viajes",
          color: "error",
        });
      } finally {
        this.loading = false;
      }
    },

    async createTrip(tripData) {
      this.loading = true;
      const appStore = useAppStore();

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/trips`,
          tripData
        );

        this.trips.push(response.data);
        appStore.showSnackbar({
          text: "Viaje creado exitosamente",
          color: "success",
        });

        return response.data;
      } catch (error) {
        console.error("Error al crear viaje:", error);
        appStore.showSnackbar({
          text: "Error al crear el viaje",
          color: "error",
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
    },

    clearFilters() {
      this.filters = {
        search: "",
        status: "all",
        date: null,
      };
    },
  },
});
