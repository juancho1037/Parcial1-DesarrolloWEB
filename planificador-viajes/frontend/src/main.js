import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Importa los estilos de Vuetify
import 'vuetify/styles'

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')