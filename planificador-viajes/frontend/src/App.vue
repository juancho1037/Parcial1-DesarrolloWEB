<template>
  <v-app theme="light">
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Planificador de Viajes</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Inicio</v-btn>
      <v-btn to="/trips" text>Mis Viajes</v-btn>
      <v-btn to="/login" text v-if="!isLoggedIn">Login</v-btn>
      <v-btn @click="logout" text v-else>Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  created() {
    this.isLoggedIn = !!localStorage.getItem("token");
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.v-application {
  background-color: #f5f5f5; /* Un gris muy claro */
}
</style>
