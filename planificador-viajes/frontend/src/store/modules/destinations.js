import { defineStore } from "pinia";
import axios from "axios";
import { useAppStore } from "./app";

export const useDestinationsStore = defineStore("destinations", {
  state: () => ({
    destinations: [],
    popularDestinations: [],
    currentDestination: null,
    loading: false,
    filters: {
      search: "",
      category: "all",
      priceRange: null,
      rating: null,
    },
    categories: [
      { id: "beach", name: "Playa", icon: "mdi-beach" },
      { id: "mountain", name: "Montaña", icon: "mdi-mountain" },
      { id: "city", name: "Ciudad", icon: "mdi-city" },
      { id: "adventure", name: "Aventura", icon: "mdi-hiking" },
    ],
  }),

  getters: {
    filteredDestinations: (state) => {
      let filtered = [...state.destinations];

      // Aplicar filtro de búsqueda
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(
          (destination) =>
            destination.name.toLowerCase().includes(searchTerm) ||
            destination.description.toLowerCase().includes(searchTerm)
        );
      }

      // Aplicar filtro de categoría
      if (state.filters.category !== "all") {
        filtered = filtered.filter(
          (destination) => destination.category === state.filters.category
        );
      }

      // Aplicar filtro de rango de precio
      if (state.filters.priceRange) {
        const [min, max] = state.filters.priceRange;
        filtered = filtered.filter(
          (destination) => destination.price >= min && destination.price <= max
        );
      }

      // Aplicar filtro de calificación
      if (state.filters.rating) {
        filtered = filtered.filter(
          (destination) => destination.rating >= state.filters.rating
        );
      }

      return filtered;
    },

    getDestinationById: (state) => (id) => {
      return state.destinations.find((d) => d.id === id);
    },

    destinationsByCategory: (state) => (category) => {
      return state.destinations.filter((d) => d.category === category);
    },

    topRatedDestinations: (state) => {
      return [...state.destinations]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
    },
  },

  actions: {
    async fetchDestinations() {
      this.loading = true;
      const appStore = useAppStore();

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_DESTINATIONS_ENDPOINT
          }`
        );
        this.destinations = response.data;
      } catch (error) {
        console.error("Error al obtener destinos:", error);
        appStore.showSnackbar({
          text: "Error al cargar los destinos",
          color: "error",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchPopularDestinations() {
      this.loading = true;
      const appStore = useAppStore();

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_DESTINATIONS_ENDPOINT
          }/popular`
        );
        this.popularDestinations = response.data;
      } catch (error) {
        console.error("Error al obtener destinos populares:", error);
        appStore.showSnackbar({
          text: "Error al cargar los destinos populares",
          color: "error",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchDestinationDetails(id) {
      this.loading = true;
      const appStore = useAppStore();

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_DESTINATIONS_ENDPOINT
          }/${id}`
        );
        this.currentDestination = response.data;
        return response.data;
      } catch (error) {
        console.error("Error al obtener detalles del destino:", error);
        appStore.showSnackbar({
          text: "Error al cargar los detalles del destino",
          color: "error",
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async rateDestination({ destinationId, rating, comment }) {
      this.loading = true;
      const appStore = useAppStore();

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_DESTINATIONS_ENDPOINT
          }/${destinationId}/rate`,
          { rating, comment }
        );

        // Actualizar la calificación en el destino local
        const destination = this.destinations.find(
          (d) => d.id === destinationId
        );
        if (destination) {
          destination.rating = response.data.newRating;
          destination.totalRatings = response.data.totalRatings;
        }

        appStore.showSnackbar({
          text: "¡Gracias por tu calificación!",
          color: "success",
        });

        return response.data;
      } catch (error) {
        console.error("Error al calificar destino:", error);
        appStore.showSnackbar({
          text: "Error al enviar la calificación",
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
        category: "all",
        priceRange: null,
        rating: null,
      };
    },

    // Método para favoritos (requiere usuario autenticado)
    async toggleFavorite(destinationId) {
      const appStore = useAppStore();

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}${
            import.meta.env.VITE_DESTINATIONS_ENDPOINT
          }/${destinationId}/favorite`
        );

        // Actualizar el estado del favorito en el destino local
        const destination = this.destinations.find(
          (d) => d.id === destinationId
        );
        if (destination) {
          destination.isFavorite = response.data.isFavorite;
        }

        appStore.showSnackbar({
          text: response.data.isFavorite
            ? "Añadido a favoritos"
            : "Eliminado de favoritos",
          color: "success",
        });
      } catch (error) {
        console.error("Error al modificar favorito:", error);
        appStore.showSnackbar({
          text: "Error al actualizar favoritos",
          color: "error",
        });
      }
    },
  },
});
