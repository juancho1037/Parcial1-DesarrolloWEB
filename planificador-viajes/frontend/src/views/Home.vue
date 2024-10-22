<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container class="hero-content">
        <v-row align="center" class="min-vh-100">
          <v-col cols="12" md="6" class="hero-text">
            <h1 class="text-h2 font-weight-bold mb-4 animate__animated animate__fadeInUp">
              Planifica Tus Sueños,<br/>
              <span class="gradient-text">Vive Tus Aventuras</span>
            </h1>
            <p class="text-h6 text-medium-emphasis mb-6 animate__animated animate__fadeInUp animate__delay-1s">
              Descubre un mundo de posibilidades. Planifica, organiza y disfruta de cada momento de tus viajes.
            </p>
            <div class="d-flex flex-wrap gap-4 animate__animated animate__fadeInUp animate__delay-2s">
              <v-btn
                to="/trips"
                size="x-large"
                color="primary"
                class="text-none px-8 py-3"
                elevation="4"
                rounded
              >
                Comenzar Ahora
                <v-icon right class="ml-2">mdi-arrow-right</v-icon>
              </v-btn>
              <v-btn
                size="x-large"
                variant="outlined"
                color="primary"
                class="text-none px-8 py-3"
                rounded
              >
                Ver Demo
                <v-icon right class="ml-2">mdi-play</v-icon>
              </v-btn>
            </div>
          </v-col>
          
          <v-col cols="12" md="6" class="hero-image animate__animated animate__fadeInRight">
            <div class="position-relative">
              <v-img
                src="/hero-illustration.svg"
                class="floating-animation"
                max-width="600"
                alt="Travel Illustration"
              />
              <!-- Floating Elements -->
              <div class="floating-element element-1">
                <v-card class="pa-4" rounded="xl" elevation="4">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="36" class="mr-3">mdi-map-marker-check</v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">+500</div>
                      <div class="text-caption text-medium-emphasis">Destinos</div>
                    </div>
                  </div>
                </v-card>
              </div>
              <div class="floating-element element-2">
                <v-card class="pa-4" rounded="xl" elevation="4">
                  <div class="d-flex align-center">
                    <v-icon color="success" size="36" class="mr-3">mdi-account-group</v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">10k+</div>
                      <div class="text-caption text-medium-emphasis">Viajeros</div>
                    </div>
                  </div>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section py-16">
      <v-container>
        <v-row justify="center" class="mb-12">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-4">
              Todo lo que necesitas para tu próximo viaje
            </h2>
            <p class="text-h6 text-medium-emphasis">
              Herramientas poderosas y fáciles de usar para hacer de cada viaje una experiencia inolvidable
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4" v-for="feature in features" :key="feature.title">
            <v-card
              class="feature-card h-100"
              elevation="0"
              rounded="lg"
            >
              <v-card-text class="pa-6">
                <div class="feature-icon mb-4" :class="feature.iconClass">
                  <v-icon size="36" :color="feature.iconColor">{{ feature.icon }}</v-icon>
                </div>
                <h3 class="text-h5 font-weight-bold mb-2">{{ feature.title }}</h3>
                <p class="text-body-1 text-medium-emphasis">{{ feature.description }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Popular Destinations -->
    <section class="destinations-section py-16 bg-grey-lighten-4">
      <v-container>
        <v-row justify="center" class="mb-12">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h3 font-weight-bold mb-4">Destinos Populares</h2>
            <p class="text-h6 text-medium-emphasis">
              Inspírate con algunos de los destinos más populares entre nuestros viajeros
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4" v-for="destination in destinations" :key="destination.name">
            <v-card
              class="destination-card h-100"
              elevation="4"
              rounded="lg"
            >
              <v-img
                :src="destination.image"
                height="250"
                cover
                class="destination-image"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-card-text class="pa-6">
                <h3 class="text-h5 font-weight-bold mb-2">{{ destination.name }}</h3>
                <p class="text-body-1 text-medium-emphasis mb-4">{{ destination.description }}</p>
                <v-chip
                  color="primary"
                  variant="outlined"
                  size="small"
                >
                  {{ destination.category }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-16">
      <v-container>
        <v-card class="cta-card pa-12 text-center" rounded="xl" elevation="8">
          <h2 class="text-h3 font-weight-bold mb-4">¿Listo para tu próxima aventura?</h2>
          <p class="text-h6 text-medium-emphasis mb-8">
            Únete a miles de viajeros que ya están planificando sus próximos destinos
          </p>
          <v-btn
            to="/register"
            size="x-large"
            color="primary"
            class="text-none px-8 py-3"
            elevation="2"
            rounded
          >
            Crear Cuenta Gratis
            <v-icon right class="ml-2">mdi-arrow-right</v-icon>
          </v-btn>
        </v-card>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      features: [
        {
          icon: 'mdi-map-marker-path',
          iconColor: 'primary',
          iconClass: 'bg-primary-lighten-4',
          title: 'Planificación Inteligente',
          description: 'Organiza tus itinerarios de manera intuitiva con nuestra herramienta de planificación inteligente.'
        },
        {
          icon: 'mdi-calendar-check',
          iconColor: 'success',
          iconClass: 'bg-success-lighten-4',
          title: 'Gestión de Actividades',
          description: 'Mantén un registro detallado de todas tus actividades y reservas en un solo lugar.'
        },
        {
          icon: 'mdi-weather-sunny',
          iconColor: 'warning',
          iconClass: 'bg-warning-lighten-4',
          title: 'Información del Destino',
          description: 'Accede a información actualizada sobre el clima, eventos locales y recomendaciones.'
        }
      ],
      destinations: [
        {
          name: 'París, Francia',
          description: 'La ciudad del amor y la luz, con su icónica Torre Eiffel y arquitectura histórica.',
          category: 'Ciudad Histórica',
          image: '/images/paris.jpg'
        },
        {
          name: 'Bali, Indonesia',
          description: 'Playas paradisíacas, templos ancestrales y una cultura única te esperan.',
          category: 'Playa y Cultura',
          image: '/images/bali.jpg'
        },
        {
          name: 'Kioto, Japón',
          description: 'Sumérgete en la tradición japonesa entre templos y jardines zen.',
          category: 'Cultural',
          image: '/images/kyoto.jpg'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home-container {
  overflow-x: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #f6f8fd 0%, #ffffff 100%);
  min-height: 100vh;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  height: 100%;
  background: linear-gradient(45deg, transparent 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.gradient-text {
  background: linear-gradient(45deg, var(--v-theme-primary), #2196f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.floating-animation {
  animation: float 6s ease-in-out infinite;
}

.floating-element {
  position: absolute;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  right: -10%;
  animation-delay: 1s;
}

.element-2 {
  bottom: 20%;
  left: -5%;
  animation-delay: 2s;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.feature-card {
  transition: transform 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.destination-card {
  transition: transform 0.3s ease;
  overflow: hidden;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.destination-card:hover .destination-image {
  transform: scale(1.05);
}

.destination-image {
  transition: transform 0.3s ease;
}

.cta-card {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, #1976d2 100%);
  color: white;
}

/* Animaciones adicionales */
.animate__animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animate__fadeInUp {
  animation-name: fadeInUp;
}

.animate__fadeInRight {
  animation-name: fadeInRight;
}

.animate__delay-1s {
  animation-delay: 0.2s;
}

.animate__delay-2s {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(40px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
