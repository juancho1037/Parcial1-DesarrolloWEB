<template>
  <v-card class="mx-auto mt-5" max-width="400">
    <v-card-title class="text-h5">Registro de Usuario</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="register" ref="form">
        <v-text-field
          v-model="user.name"
          label="Nombre"
          :rules="nameRules"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.email"
          label="Email"
          type="email"
          :rules="emailRules"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.password"
          label="Contraseña"
          type="password"
          :rules="passwordRules"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          :rules="[...passwordRules, passwordMatchRule]"
          required
        ></v-text-field>

        <v-btn
          type="submit"
          color="primary"
          block
          class="mt-2"
          :loading="loading"
        >
          Registrarse
        </v-btn>

        <v-btn text block class="mt-2" @click="$router.push('/login')">
          ¿Ya tienes cuenta? Inicia sesión
        </v-btn>
      </v-form>
    </v-card-text>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
      nameRules: [
        (v) => !!v || "El nombre es requerido",
        (v) => v.length >= 3 || "El nombre debe tener al menos 3 caracteres",
      ],
      emailRules: [
        (v) => !!v || "El email es requerido",
        (v) => /.+@.+\..+/.test(v) || "El email debe ser válido",
      ],
      passwordRules: [
        (v) => !!v || "La contraseña es requerida",
        (v) =>
          v.length >= 6 || "La contraseña debe tener al menos 6 caracteres",
      ],
    };
  },
  computed: {
    passwordMatchRule() {
      return () =>
        this.user.password === this.user.confirmPassword ||
        "Las contraseñas no coinciden";
    },
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        const response = await axios.post("http://localhost:3000/register", {
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
        });

        this.snackbarColor = "success";
        this.snackbarText = "Registro exitoso. Redirigiendo al login...";
        this.snackbar = true;

        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);
      } catch (error) {
        this.snackbarColor = "error";
        this.snackbarText =
          error.response?.data?.message || "Error en el registro";
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
