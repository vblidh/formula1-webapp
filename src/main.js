import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VDataTable } from 'vuetify/labs/VDataTable'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi' 
import colors from 'vuetify/lib/util/colors'
import "@mdi/font/css/materialdesignicons.css";

import App from './App.vue'
import router from './router'


const vuetify = createVuetify({
  components: { ...components, VDataTable },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.blue.lighten1
        }
      }
    }
  },
  directives
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
