<template>
  <v-footer class="footer">
    <v-container>
      <v-row>
        <!-- Logo y descripción -->
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" size="32" class="mr-2">
              mdi-airplane
            </v-icon>
            <span class="text-h6 font-weight-bold">Planificador de Viajes</span>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Explora el mundo con nosotros. Planifica tus viajes de manera inteligente y descubre nuevos destinos.
          </p>
          <div class="social-links">
            <v-btn v-for="social in socialLinks" :key="social.icon" :href="social.link" target="_blank" icon
              variant="text" color="primary" class="mr-2">
              <v-icon>{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>

        <!-- Enlaces rápidos -->
        <v-col v-for="section in footerSections" :key="section.title" cols="12" sm="6" md="2" class="mb-6 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-4">{{ section.title }}</h3>
          <v-list density="compact" class="footer-links pa-0">
            <v-list-item v-for="link in section.links" :key="link.text" :to="link.to" :href="link.href"
              :target="link.href ? '_blank' : undefined" density="compact" class="px-0" color="primary">
              <template v-slot:prepend>
                <v-icon size="small" color="primary" class="mr-2">
                  {{ link.icon }}
                </v-icon>
              </template>
              {{ link.text }}
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Hoja informativa -->
        <v-col cols="12" md="4">
          <h3 class="text-h6 font-weight-bold mb-4">Hoja informativa</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Suscríbete para recibir las mejores ofertas y consejos de viaje.
          </p>
          <v-form @submit.prevent="subscribeNewsletter">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="email" label="Tu correo electrónico" type="email" variant="outlined"
                  density="comfortable" :rules="emailRules" hide-details class="mb-4"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn type="submit" color="primary" block :loading="subscribing">
                  Suscribirse
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>

      <!-- Separador -->
      <v-divider class="my-6"></v-divider>

      <!-- Pie de página -->
      <div class="d-flex flex-wrap justify-space-between align-center">
        <div class="text-body-2 text-medium-emphasis">
          &copy; {{ currentYear }} Planificador de Viajes. Todos los derechos reservados.
        </div>
        <div class="d-flex flex-wrap">
          <v-btn v-for="link in legalLinks" :key="link.text" :to="link.to" variant="text" size="small" class="ml-4">
            {{ link.text }}
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
import { ref, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

export default {
  name: 'Footer',

  setup() {
    const appStore = useAppStore()
    const email = ref('')
    const subscribing = ref(false)

    const socialLinks = [
      { icon: 'mdi-facebook', link: '#' },
      { icon: 'mdi-twitter', link: '#' },
      { icon: 'mdi-instagram', link: '#' },
      { icon: 'mdi-youtube', link: '#' }
    ]

    const footerSections = [
      {
        title: 'Compañía',
        links: [
          { text: 'Acerca de', to: '/about', icon: 'mdi-information' },
          { text: 'Contacto', to: '/contact', icon: 'mdi-email' },
          { text: 'Blog', to: '/blog', icon: 'mdi-post' },
          { text: 'Carreras', to: '/careers', icon: 'mdi-briefcase' }
        ]
      },
      {
        title: 'Recursos',
        links: [
          { text: 'Guías de viaje', to: '/guides', icon: 'mdi-book-open' },
          { text: 'FAQs', to: '/faqs', icon: 'mdi-frequently-asked-questions' },
          { text: 'Comunidad', to: '/community', icon: 'mdi-account-group' },
          { text: 'Soporte', to: '/support', icon: 'mdi-help-circle' }
        ]
      }
    ]

    const legalLinks = [
      { text: 'Términos y condiciones', to: '/terms' },
      { text: 'Política de privacidad', to: '/privacy' },
      { text: 'Cookies', to: '/cookies' }
    ]

    const emailRules = [
      v => !!v || 'El email es requerido',
      v => /.+@.+\..+/.test(v) || 'Email debe ser válido'
    ]

    const currentYear = computed(() => new Date().getFullYear())

    const subscribeNewsletter = async () => {
      if (!email.value || !emailRules.every(rule => rule(email.value) === true)) {
        appStore.showSnackbar({
          text: 'Por favor, ingresa un email válido',
          color: 'error'
        })
        return
      }

      subscribing.value = true
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000))

        appStore.showSnackbar({
          text: '¡Gracias por suscribirte!',
          color: 'success'
        })
        email.value = ''
      } catch (error) {
        appStore.showSnackbar({
          text: 'Error al suscribirse. Por favor, intenta nuevamente.',
          color: 'error'
        })
      } finally {
        subscribing.value = false
      }
    }

    return {
      email,
      subscribing,
      socialLinks,
      footerSections,
      legalLinks,
      emailRules,
      currentYear,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.footer {
  background: #f8fafc !important;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding: 4rem 0 !important;
}

.footer-links {
  background: transparent !important;
}

.social-links .v-btn {
  transition: transform 0.3s ease;
}

.social-links .v-btn:hover {
  transform: translateY(-3px);
}

.footer :deep(.v-list-item) {
  min-height: 32px !important;
}

.footer :deep(.v-list-item__content) {
  padding: 0;
}

/* Mejoras para mobile */
@media (max-width: 600px) {
  .footer {
    padding: 2rem 0 !important;
  }

  .legal-links {
    justify-content: center;
    margin-top: 1rem;
  }

  .legal-links .v-btn {
    margin: 0.5rem;
  }
}

/* Soporte para modo oscuro */
:deep(.v-theme--dark) {
  .footer {
    background: #1e1e1e !important;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>