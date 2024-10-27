<template>
  <!--Componente v-card que crea una tarjeta con sombra variable dependiendo de hover-->
  <!--Agrega la clase selected si la tarjeta esta seleccionada -->
  <!--Emite un evento click al hacer clic en la tarjeta -->
  <v-card class="activity-card" :elevation="hover ? 4 : 1" :class="{ 'selected': selected }" @click="$emit('click')">
    <!--Componente v-img para la imagen, usando un placeholder hasta cargar la imagen completa-->
    <v-img :src="`/api/placeholder/300/200`" :aspect-ratio="3 / 2" cover class="activity-image">
      <!--Slot de placeholder, muestra un spinner mientras carga la imagen -->
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <!--Animacion circular de carga -->
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>
      <!--v-overlay que crea una capa encima de la imagen -->
      <!--Activa siempre el overlay -->
      <!--Fondo oscuro para mejorar el contraste del overlay -->
      <v-overlay contained class="align-end" :model-value="true" scrim="rgba(0, 0, 0, 0.3)">
        <!--v-chip que muestra la categoria de la actividad y usa el color adecuado segun la categoria -->
        <v-chip :color="getCategoryColor(activity.category)" size="small" class="ma-2">
          <!--Muestra el nombre de la categoria -->
          {{ activity.category }}
        </v-chip>
      </v-overlay>
    </v-img>
    <!--Muestra el titulo de la tarjeta, muestra el nombre de la actividad -->
    <v-card-title class="pt-4">
      {{ activity.name }}
    </v-card-title>

    <!--Subtitulo de la tarjeta, muestra la duracion y precio -->
    <v-card-subtitle>
      <div class="d-flex align-center justify-space-between">
        <span>
          <!--Icono del reloj al lado de la duracion -->
          <v-icon size="small" class="mr-1">mdi-clock</v-icon>
          <!--Duracion de la actividad -->
          {{ activity.duration }}
        </span>
        <span class="text-success">
          <!--Precio de la actividad -->
          {{ activity.price }}
        </span>
      </div>
    </v-card-subtitle>

    <!--Descripcion y lista de tags -->
    <v-card-text>
      <p class="text-truncate">{{ activity.description }}</p>
      <div class="mt-2">
        <v-chip-group>
          <!--Muestra una lista de etiquetas (tags) con chips -->
          <v-chip v-for="tag in activity.tags" :key="tag" size="small" variant="outlined">
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </div>
    </v-card-text>

    <!--Botones de acciones de las tarjetas -->
    <v-card-actions>
      <v-btn variant="text" color="primary" @click.stop="$emit('view-details')">
        Detalles
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="!selected" variant="text" color="primary" @click.stop="$emit('add')">
        Agregar
        <v-icon end>mdi-plus</v-icon>
      </v-btn>
      <v-btn v-else variant="text" color="error" @click.stop="$emit('remove')">
        Quitar
        <v-icon end>mdi-minus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ActivityCard',

  props: {
    activity: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  emits: ['click', 'view-details', 'add', 'remove'],

  setup() {
    const hover = ref(false)
    // Funcion para determinar el color del chip segun la categoria de la actividad.
    const getCategoryColor = (category) => {
      const colors = {
        'turismo': 'blue',
        'gastronomía': 'orange',
        'cultura': 'purple',
        'aventura': 'green',
        'relax': 'pink'
      }
      return colors[category] || 'grey'
    }

    return {
      hover,
      getCategoryColor
    }
  }
}
</script>

<!--Estilos especificos para las tarjetas -->
<style scoped>
.activity-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.activity-card:hover {
  transform: translateY(-4px);
}

.activity-card.selected {
  border: 2px solid var(--v-theme-primary);
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.activity-image {
  transition: transform 0.3s ease;
}

.activity-card:hover .activity-image {
  transform: scale(1.05);
}
</style>