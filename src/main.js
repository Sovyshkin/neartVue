// Для Vue 3
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router/router";
import axios from "axios";
// import { Carousel } from "vue-carousel";

axios.defaults.baseURL = "http://45.12.238.27:5000/";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(router).use(vuetify).use(i18n).mount("#app");
