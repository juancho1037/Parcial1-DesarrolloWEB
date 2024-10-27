import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    isLoading: false,
    snackbar: {
      show: false,
      text: "",
      color: "success",
      timeout: 3000,
    },
    dialog: {
      show: false,
      title: "",
      message: "",
      confirmText: "Confirmar",
      cancelText: "Cancelar",
      onConfirm: null,
      onCancel: null,
      loading: false,
    },
  }),

  actions: {
    showLoading() {
      this.isLoading = true;
    },

    hideLoading() {
      this.isLoading = false;
    },

    showSnackbar({ text, color = "success", timeout = 3000 }) {
      this.snackbar = {
        show: true,
        text,
        color,
        timeout,
      };
    },

    showDialog({
      title,
      message,
      confirmText = "Confirmar",
      cancelText = "Cancelar",
      onConfirm = null,
      onCancel = null,
    }) {
      this.dialog = {
        show: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        loading: false,
      };
    },

    setDialogLoading(loading) {
      this.dialog.loading = loading;
    },
  },
});
