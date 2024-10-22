<template>
  <v-card class="mx-auto mt-5" max-width="400">
    <v-card-title class="text-h5">Iniciar Sesión</v-card-title>
    <v-card-text>
      <v-alert v-if="showTestCredentials" type="info" class="mb-4">
        Credenciales de prueba:<br />
        Email: test@example.com<br />
        Contraseña: 123456
      </v-alert>

      <v-form @submit.prevent="login" ref="form">
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

        <v-btn
          type="submit"
          color="primary"
          block
          class="mt-2"
          :loading="loading"
        >
          Iniciar Sesión
        </v-btn>

        <v-btn text block class="mt-2" @click="toggleTestCredentials">
          Ver credenciales de prueba
        </v-btn>
      </v-form>
    </v-card-text>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-card>
</template>

<script>
const TEST_USER = {
  email: "test@example.com",
  password: "123456",
  name: "Usuario de Prueba",
  id: "1",
};

export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success",
      showTestCredentials: false,
      emailRules: [
        (v) => !!v || "El email es requerido",
        (v) => /.+@.+\..+/.test(v) || "El email debe ser válido",
      ],
      passwordRules: [(v) => !!v || "La contraseña es requerida"],
    };
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      // Simulación de delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        // Verificar credenciales de prueba
        if (
          this.user.email === TEST_USER.email &&
          this.user.password === TEST_USER.password
        ) {
          // Simular token JWT
          const token = "test-jwt-token-" + Date.now();

          // Guardar datos de sesión
          localStorage.setItem("token", token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: TEST_USER.id,
              name: TEST_USER.name,
              email: TEST_USER.email,
            })
          );

          this.snackbarColor = "success";
          this.snackbarText = "¡Bienvenido!";
          this.snackbar = true;

          this.$router.push("/trips");
        } else {
          throw new Error("Credenciales inválidas");
        }
      } catch (error) {
        this.snackbarColor = "error";
        this.snackbarText = "Email o contraseña incorrectos";
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    toggleTestCredentials() {
      this.showTestCredentials = !this.showTestCredentials;
    },
    // Método de conveniencia para desarrollo
    autoFillTestCredentials() {
      this.user.email = TEST_USER.email;
      this.user.password = TEST_USER.password;
    },
  },
};
</script>
