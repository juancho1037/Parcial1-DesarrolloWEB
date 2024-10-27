<template>
  <div class="forgot-password-container">
    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height">
        <!-- Lado izquierdo - Formulario -->
        <v-col cols="12" md="6" order-md="1" order="2" class="form-side">
          <div class="form-wrapper pa-8">
            <div class="text-center mb-8">
              <h1 class="text-h4 font-weight-bold gradient-text mb-2">
                Recupera tu Contraseña
              </h1>
              <p class="text-body-1 text-medium-emphasis">
                Te enviaremos instrucciones para recuperar tu contraseña
              </p>
            </div>

            <v-form @submit.prevent="handleSubmit" ref="form" class="forgot-form">
              <v-card class="form-card pa-6" elevation="0" rounded="lg" :class="{ 'shake-animation': error }">
                <v-text-field v-model="email" label="Correo Electrónico" type="email" variant="outlined"
                  :rules="emailRules" prepend-inner-icon="mdi-email" required :error-messages="errorMessage"
                  @input="clearError" class="input-field mb-4"></v-text-field>

                <v-btn type="submit" color="primary" size="large" block :loading="loading" class="submit-btn mb-4"
                  rounded elevation="2">
                  Enviar Instrucciones
                  <v-icon right class="ml-2">mdi-send</v-icon>
                </v-btn>

                <div class="text-center">
                  <v-btn variant="text" color="primary" class="mt-2" :to="{ name: 'Login' }">
                    <v-icon left class="mr-2">mdi-arrow-left</v-icon>
                    Volver al Login
                  </v-btn>
                </div>
              </v-card>
            </v-form>
          </div>
        </v-col>

        <!-- Right Side - Illustration -->
        <v-col cols="12" md="6" order-md="2" order="1" class="illustration-side d-none d-md-flex">
          <div class="illustration-content pa-12">
            <div class="welcome-text">
              <h2 class="text-h3 font-weight-bold text-white mb-4">
                ¿Olvidaste tu Contraseña?
              </h2>
              <p class="text-h6 text-white text-opacity-75">
                No te preocupes, te ayudaremos a recuperar el acceso a tu cuenta
              </p>
            </div>

            <v-card class="info-card mt-8" elevation="4" rounded="lg">
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-2">
                  <v-icon color="info" size="24" class="mr-2">mdi-information</v-icon>
                  <span class="text-body-1 font-weight-medium">Pasos a seguir:</span>
                </div>
                <ol class="text-body-2 pl-4">
                  <li class="mb-2">Ingresa tu correo electrónico registrado</li>
                  <li class="mb-2">Revisa tu bandeja de entrada</li>
                  <li>Sigue las instrucciones enviadas</li>
                </ol>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

export default {
  name: 'ForgotPassword',

  setup() {
    const router = useRouter()
    const appStore = useAppStore()
    const form = ref(null)

    const email = ref('')
    const loading = ref(false)
    const error = ref(false)
    const errorMessage = ref('')
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })

    const emailRules = [
      v => !!v || 'El email es requerido',
      v => /.+@.+\..+/.test(v) || 'Ingresa un email válido'
    ]

    const clearError = () => {
      error.value = false
      errorMessage.value = ''
    }

    const handleSubmit = async () => {
      if (!form.value) return
      const { valid } = await form.value.validate()

      if (!valid) return

      loading.value = true
      try {
        // Aquí iría la llamada a la API para recuperar contraseña
        // await authStore.forgotPassword(email.value)

        snackbar.value = {
          show: true,
          text: 'Se han enviado las instrucciones a tu correo',
          color: 'success'
        }

        // Redirigir al login después de un tiempo
        setTimeout(() => {
          router.push({ name: 'Login' })
        }, 3000)
      } catch (err) {
        error.value = true
        errorMessage.value = err.response?.data?.message || 'Error al procesar la solicitud'

        snackbar.value = {
          show: true,
          text: 'Error al enviar las instrucciones',
          color: 'error'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      email,
      loading,
      error,
      errorMessage,
      snackbar,
      emailRules,
      clearError,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  background: #f8fafc;
}

.form-side {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.form-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  animation: fadeIn 0.6s ease-out;
}

.form-card {
  background: white;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.illustration-side {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, #1976d2 100%);
  position: relative;
  overflow: hidden;
}

.illustration-side::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
  background-size: 20px 20px;
  opacity: 0.5;
}

.illustration-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gradient-text {
  background: linear-gradient(45deg, var(--v-theme-primary), #1976d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.input-field {
  transition: transform 0.3s ease;
}

.input-field:focus-within {
  transform: translateY(-2px);
}

.submit-btn {
  transition: transform 0.3s ease;
  background: linear-gradient(45deg, var(--v-theme-primary), #1976d2);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.info-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.shake-animation {
  animation: shake 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .form-wrapper {
    padding: 2rem;
  }

  .illustration-side {
    display: none;
  }
}
</style>