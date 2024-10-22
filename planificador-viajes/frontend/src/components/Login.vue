<template>
  <div class="login-container">
    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height">
        <!-- Left Side - Form -->
        <v-col cols="12" md="6" order-md="1" order="2" class="form-side">
          <div class="form-wrapper pa-8">
            <div class="text-center mb-8">
              <h1 class="text-h4 font-weight-bold gradient-text mb-2">
                ¡Bienvenido de Nuevo!
              </h1>
              <p class="text-body-1 text-medium-emphasis">
                Continúa planificando tus próximas aventuras
              </p>
            </div>

            <v-form @submit.prevent="login" ref="form" class="login-form">
              <v-card
                class="form-card pa-6"
                elevation="0"
                rounded="lg"
              >
                <v-text-field
                  v-model="user.email"
                  label="Correo Electrónico"
                  type="email"
                  variant="outlined"
                  :rules="emailRules"
                  prepend-inner-icon="mdi-email"
                  required
                  class="input-field mb-4"
                ></v-text-field>

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
                  class="input-field mb-2"
                ></v-text-field>

                <div class="d-flex justify-space-between align-center mb-6">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Recordarme"
                    color="primary"
                    hide-details
                    class="mt-0"
                  ></v-checkbox>
                  <v-btn
                    variant="text"
                    color="primary"
                    class="text-caption"
                    @click="forgotPassword"
                  >
                    ¿Olvidaste tu contraseña?
                  </v-btn>
                </div>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  class="login-btn mb-4"
                  rounded
                  elevation="2"
                >
                  Iniciar Sesión
                  <v-icon right class="ml-2">mdi-login</v-icon>
                </v-btn>

                <div class="text-center mb-6">
                  <span class="text-body-2 text-medium-emphasis">¿Nuevo aquí?</span>
                  <v-btn
                    variant="text"
                    color="primary"
                    class="ml-2"
                    @click="$router.push('/register')"
                  >
                    Crear una cuenta
                  </v-btn>
                </div>

                <v-divider class="mb-6">
                  <span class="text-body-2 text-medium-emphasis">o continúa con</span>
                </v-divider>

                <div class="d-flex justify-center gap-4">
                  <v-btn
                    variant="outlined"
                    rounded
                    color="primary"
                    class="social-btn"
                    elevation="0"
                  >
                    <v-icon left>mdi-google</v-icon>
                    Google
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    rounded
                    color="primary"
                    class="social-btn"
                    elevation="0"
                  >
                    <v-icon left>mdi-facebook</v-icon>
                    Facebook
                  </v-btn>
                </div>
              </v-card>
            </v-form>

            <!-- Test Credentials Card -->
            <v-expand-transition>
              <v-card
                v-if="showTestCredentials"
                class="mt-6 test-credentials-card"
                color="info"
                variant="outlined"
                rounded="lg"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="info" class="mr-2">mdi-information</v-icon>
                    <span class="text-body-1 font-weight-medium">Credenciales de prueba</span>
                  </div>
                  <div class="text-body-2">
                    <div class="mb-1">
                      <strong>Email:</strong> test@example.com
                    </div>
                    <div>
                      <strong>Contraseña:</strong> 123456
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-expand-transition>
          </div>
        </v-col>

        <!-- Right Side - Illustration -->
        <v-col cols="12" md="6" order-md="2" order="1" class="illustration-side d-none d-md-flex">
          <div class="illustration-content pa-12">
            <div class="floating-elements">
              <!-- Stats Card 1 -->
              <v-card class="floating-card card-1" elevation="4" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon color="success" size="32" class="mr-3">mdi-calendar-check</v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">+1000</div>
                      <div class="text-caption">Viajes Planificados</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Stats Card 2 -->
              <v-card class="floating-card card-2" elevation="4" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="32" class="mr-3">mdi-map-marker-multiple</v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">50+</div>
                      <div class="text-caption">Destinos Populares</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <div class="welcome-text">
              <h2 class="text-h3 font-weight-bold text-white mb-4">
                Planifica Tus Sueños
              </h2>
              <p class="text-h6 text-white text-opacity-75">
                Descubre nuevos destinos y crea recuerdos inolvidables
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar -->
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
const TEST_USER = {
  email: "test@example.com",
  password: "123456",
};

export default {
  name: 'Login',
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      showPassword: false,
      loading: false,
      rememberMe: false,
      showTestCredentials: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      emailRules: [
        v => !!v || 'El email es requerido',
        v => /.+@.+\..+/.test(v) || 'El email debe ser válido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida'
      ]
    }
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        // Simulación de delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (
          this.user.email === TEST_USER.email &&
          this.user.password === TEST_USER.password
        ) {
          const token = "test-jwt-token-" + Date.now();
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({
            email: TEST_USER.email,
            name: "Usuario de Prueba"
          }));

          this.snackbarColor = 'success';
          this.snackbarText = '¡Bienvenido de nuevo!';
          this.snackbar = true;

          setTimeout(() => {
            this.$router.push('/trips');
          }, 500);
        } else {
          throw new Error('Credenciales inválidas');
        }
      } catch (error) {
        this.snackbarColor = 'error';
        this.snackbarText = 'Email o contraseña incorrectos';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    forgotPassword() {
      this.snackbarColor = 'info';
      this.snackbarText = 'Función de recuperación de contraseña en desarrollo';
      this.snackbar = true;
    },
    toggleTestCredentials() {
      this.showTestCredentials = !this.showTestCredentials;
    }
  }
}
</script>

<style scoped>
.login-container {
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

.login-btn {
  transition: transform 0.3s ease;
  background: linear-gradient(45deg, var(--v-theme-primary), #1976d2);
}

.login-btn:hover {
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

.test-credentials-card {
  animation: slideDown 0.3s ease-out;
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mejoras visuales en hover de elementos */
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
  .form-wrapper {
    padding: 2rem;
  }
  
  .illustration-side {
    display: none;
  }
}
</style>