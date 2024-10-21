<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h4 font-weight-bold text-center">
            Bienvenido al Planificador de Viajes
          </v-card-title>
          <v-card-text class="text-body-1 text-center">
            Planifica tus aventuras y crea recuerdos inolvidables.
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn to="/trips" color="primary" size="large">
              Ver mis viajes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
};
</script>
