// Для Vue 3
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia';
import i18n from "./i18n";
import router from "./router/router";
import api from "./services/api";
// import { Carousel } from "vue-carousel";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(createPinia());

// Инициализируем авторизацию после создания Pinia
import { useMainStore } from './stores/main.js';
const mainStore = useMainStore();
mainStore.initAuth();

// Глобальный обработчик ошибок - НЕ выходим из аккаунта при ошибках
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error handler:', err, info);
  // Показываем уведомление об ошибке, но НЕ выходим из аккаунта
  if (mainStore) {
    mainStore.showErrorMsg('Произошла ошибка, но вы остаетесь в системе');
  }
};

// Защита от случайного localStorage.clear()
const originalClear = localStorage.clear;
localStorage.clear = function() {
  console.warn('localStorage.clear() blocked to prevent logout');
  // Не выполняем clear, если это не явный выход
};

// Добавляем специальный метод для принудительной очистки
localStorage.forceClear = originalClear;

app.config.globalProperties.$api = api;
app.use(i18n).use(router).use(vuetify).mount("#app");
