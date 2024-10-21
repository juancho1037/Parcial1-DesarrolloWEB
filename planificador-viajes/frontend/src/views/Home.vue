<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h4 font-weight-bold">
            Bienvenido al Planificador de Viajes
          </v-card-title>
          <v-card-text class="text-body-1">
            Planifica tus aventuras y crea recuerdos inolvidables.
          </v-card-text>
          <v-card-actions>
            <v-btn to="/trips" color="primary"> Ver mis viajes </v-btn>
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
