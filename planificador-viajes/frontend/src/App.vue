<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Planificador de Viajes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Inicio</v-btn>
      <template v-if="isLoggedIn">
        <v-btn to="/trips" text>Mis Viajes</v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" text>
              {{ userName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>Cerrar Sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn to="/login" text>Login</v-btn>
        <v-btn to="/register" text>Registro</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
      userName: "",
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      this.isLoggedIn = !!token;
      this.userName = user.name || "";
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.userName = "";
      this.$router.push("/login");
    },
  },
};
</script>
