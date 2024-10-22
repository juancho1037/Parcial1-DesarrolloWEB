<template>
  <div class="register-container">
    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height">
        <!-- Left Side - Illustration -->
        <v-col cols="12" md="6" class="d-none d-md-flex illustration-side">
          <div class="illustration-content pa-12">
            <div class="text-h3 font-weight-bold text-white mb-4">
              Comienza Tu Aventura
            </div>
            <p class="text-h6 text-white text-opacity-75 mb-8">
              Únete a nuestra comunidad de viajeros y descubre un mundo de posibilidades
            </p>
            
            <!-- Features List -->
            <div class="features-list">
              <div class="feature-item" v-for="(feature, index) in features" :key="index">
                <v-icon color="white" size="24" class="mr-3">{{ feature.icon }}</v-icon>
                <span class="text-white text-opacity-75">{{ feature.text }}</span>
              </div>
            </div>

            <!-- Floating Elements -->
            <div class="floating-elements">
              <v-card class="floating-card card-1" elevation="4" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="32">mdi-map-marker-check</v-icon>
                    <div class="ml-3">
                      <div class="text-body-1 font-weight-bold">París, Francia</div>
                      <div class="text-caption">Destino Popular</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <v-card class="floating-card card-2" elevation="4" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon color="success" size="32">mdi-account-group</v-icon>
                    <div class="ml-3">
                      <div class="text-body-1 font-weight-bold">10k+ Viajeros</div>
                      <div class="text-caption">Comunidad Activa</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-col>

        <!-- Right Side - Form -->
        <v-col cols="12" md="6" class="form-side">
          <div class="form-container pa-8">
            <div class="text-center mb-8">
              <div class="text-h4 font-weight-bold gradient-text mb-2">
                Crea tu Cuenta
              </div>
              <p class="text-body-1 text-medium-emphasis">
                Planifica tus viajes de manera inteligente
              </p>
            </div>

            <v-form @submit.prevent="register" ref="form" class="register-form">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="user.name"
                    label="Nombre Completo"
                    variant="outlined"
                    :rules="nameRules"
                    prepend-inner-icon="mdi-account"
                    required
                    class="input-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="user.email"
                    label="Correo Electrónico"
                    type="email"
                    variant="outlined"
                    :rules="emailRules"
                    prepend-inner-icon="mdi-email"
                    required
                    class="input-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.password"
                    label="Contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="passwordRules"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    required
                    class="input-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.confirmPassword"
                    label="Confirmar Contraseña"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="[...passwordRules, passwordMatchRule]"
                    prepend-inner-icon="mdi-lock-check"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    required
                    class="input-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-checkbox
                    v-model="terms"
                    :rules="[(v) => !!v || 'Debes aceptar los términos para continuar']"
                    label="Acepto los términos y condiciones"
                    required
                    color="primary"
                  ></v-checkbox>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    elevation="2"
                    class="register-btn text-none"
                    rounded
                  >
                    Crear Cuenta
                    <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>

                <v-col cols="12" class="text-center">
                  <span class="text-body-2 text-medium-emphasis">¿Ya tienes una cuenta?</span>
                  <v-btn
                    variant="text"
                    color="primary"
                    class="ml-2"
                    @click="$router.push('/login')"
                  >
                    Iniciar Sesión
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <!-- Social Sign Up -->
            <div class="mt-8">
              <div class="text-center text-body-2 text-medium-emphasis mb-4">
                O regístrate con
              </div>
              <div class="d-flex justify-center gap-4">
                <v-btn
                  variant="outlined"
                  rounded
                  color="primary"
                  class="social-btn"
                >
                  <v-icon left>mdi-google</v-icon>
                  Google
                </v-btn>
                <v-btn
                  variant="outlined"
                  rounded
                  color="primary"
                  class="social-btn"
                >
                  <v-icon left>mdi-facebook</v-icon>
                  Facebook
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      terms: false,
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      features: [
        { icon: 'mdi-map-marker-check', text: 'Acceso a destinos exclusivos' },
        { icon: 'mdi-calendar-check', text: 'Planificación personalizada' },
        { icon: 'mdi-account-group', text: 'Comunidad de viajeros' },
        { icon: 'mdi-percent', text: 'Descuentos especiales' }
      ],
      nameRules: [
        v => !!v || 'El nombre es requerido',
        v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
      ],
      emailRules: [
        v => !!v || 'El email es requerido',
        v => /.+@.+\..+/.test(v) || 'El email debe ser válido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
      ]
    }
  },
  computed: {
    passwordMatchRule() {
      return () =>
        this.user.password === this.user.confirmPassword ||
        'Las contraseñas no coinciden'
    }
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      try {
        // Simulación de registro
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.snackbarColor = 'success'
        this.snackbarText = '¡Registro exitoso! Redirigiendo...'
        this.snackbar = true

        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
      } catch (error) {
        this.snackbarColor = 'error'
        this.snackbarText = 'Error en el registro. Por favor, intenta nuevamente.'
        this.snackbar = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: #f8fafc;
}

.illustration-side {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, #1976d2 100%);
  position: relative;
  overflow: hidden;
}

.illustration-content {
  position: relative;
  z-index: 2;
}

/* Reemplazamos la imagen de fondo con un patrón CSS */
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

/* Añadimos un segundo patrón para más profundidad */
.illustration-side::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
    transparent 0%,
    rgba(255, 255, 255, 0.05) 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.05) 75%,
    transparent 100%
  );
  background-size: 40px 40px;
  animation: moveBackground 15s linear infinite;
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 40px;
  }
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

/* Añadimos un sutil efecto de gradiente al fondo del formulario */
.form-side {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.gradient-text {
  background: linear-gradient(45deg, var(--v-theme-primary), #1976d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  animation: fadeInLeft 0.5s ease forwards;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-1 {
  top: 20%;
  right: 10%;
  animation: float 6s ease-in-out infinite;
}

.card-2 {
  bottom: 20%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
  animation-delay: 1s;
}

.input-field {
  transition: transform 0.3s ease;
}

.input-field:focus-within {
  transform: translateY(-2px);
}

.register-btn {
  transition: transform 0.3s ease;
  background: linear-gradient(45deg, var(--v-theme-primary), #1976d2);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.social-btn {
  transition: all 0.3s ease;
  flex: 1;
}

.social-btn:hover {
  transform: translateY(-2px);
  background: rgba(var(--v-theme-primary), 0.05);
}

/* Añadimos un efecto de brillo al hover de los botones */
.social-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.social-btn:hover::before {
  transform: translateX(100%);
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

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mejoras en los inputs */
:deep(.v-field) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.v-field:hover) {
  border-color: var(--v-theme-primary);
}

:deep(.v-field--focused) {
  border-color: var(--v-theme-primary);
  box-shadow: 0 0 0 4px rgba(var(--v-theme-primary), 0.1);
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .form-container {
    padding: 2rem;
  }
  
  .illustration-side {
    display: none;
  }
}

/* Añadimos animación al cargar el formulario */
.form-container {
  animation: fadeIn 0.6s ease-out;
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
</style>