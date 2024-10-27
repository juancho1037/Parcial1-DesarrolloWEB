<template>
  <v-container class="not-found-container fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-icon
          size="100"
          color="primary"
          class="mb-6 animate-bounce"
        >
          mdi-map-marker-question
        </v-icon>
        
        <h1 class="text-h3 font-weight-bold mb-4">
          ¡Página no encontrada!
        </h1>
        
        <p class="text-body-1 text-medium-emphasis mb-8">
          Parece que te has perdido en el camino. 
          Esta página no existe o ha sido movida.
        </p>

        <v-btn
          color="primary"
          size="large"
          to="/"
          class="mx-2"
          rounded
        >
          <v-icon start>mdi-home</v-icon>
          Volver al Inicio
        </v-btn>

        <v-btn
          variant="outlined"
          size="large"
          @click="$router.go(-1)"
          class="mx-2"
          rounded
        >
          <v-icon start>mdi-arrow-left</v-icon>
          Regresar
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 70px); /* Ajustar según la altura de tu navbar */
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>