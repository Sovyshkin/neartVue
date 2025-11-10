<script>
import AppHeader from "./components/AppHeader.vue";
import Block_1 from "./components/Block_1.vue";
import Advantages from "./components/BlockAdvantages.vue";
import Faq from "./components/BlockFaq.vue";
import GoTry from "./components/GoTry.vue";
import ResetPassword from "./components/ResetPassword.vue";
import { RouterView } from "vue-router";
import AppFooter from "./components/AppFooter.vue";
import MiniMarket from "./components/BlockMiniMarket.vue";
import Notification from './components/AppNotification.vue';
import AppLoader from './components/AppLoader.vue';
import { useMainStore } from './stores/main.js';

export default {
  name: "App",
  components: {
    AppHeader,
    Block_1,
    Faq,
    Advantages,
    GoTry,
    ResetPassword,
    RouterView,
    AppFooter,
    MiniMarket,
    Notification,
    AppLoader,
  },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      gotry: false,
      login: false,
      register: false,
      reset: false,
      deleteWallet: false,
      slider: false,
      avatar: false,
      deleteAuth: false,
      formFeedback: false,
    };
  },
  methods: {
    handleTry(gotry) {
      this.gotry = gotry;
    },
    handleLogin(login) {
      this.gotry = false;
      this.login = login;
    },
    handleRegister(register) {
      this.login = false;
      this.gotry = false;
      this.register = register;
    },
    handleReset(reset) {
      this.login = false;
      this.gotry = false;
      this.register = false;
      this.reset = reset;
    },
    handleDelete(deleteWallet) {
      this.deleteWallet = deleteWallet;
    },
    handleDeleteAuth(deleteAuth) {
      this.deleteAuth = deleteAuth;
    },
    handleAvatar(avatar) {
      this.avatar = avatar;
    },
    handleSlider(slider) {
      this.slider = slider;
    },
    handleFormFeedback(form) {
      this.formFeedback = form;
    },
    handleAuth(authData) {
      // Обработчик событий авторизации от дочерних компонентов
      console.log('Auth event received:', authData);
    },
    checkRoute() {
      try {
        if (this.$route.fullPath == "/") {
          return true;
        }
        return false;
      } catch (err) {
        console.log("ошибка тут");
        console.log(err);
      }
    },
  },
  errorCaptured(err, instance, info) {
    console.error('Error captured in App.vue:', err, info);
    if (this.mainStore) {
      this.mainStore.showErrorMsg('Ошибка в компоненте, но страница продолжит работу');
    }
    // Возвращаем false, чтобы ошибка не распространялась дальше
    return false;
  },
};
</script>
<template>
  <Notification />
  <AppLoader :show="mainStore.isPageLoading" />
  <div class="wrap" v-if="checkRoute()" style="align-items: center">
    <!-- <FormFeedback
      v-if="formFeedback"
      @updateFormFeedback="handleFormFeedback"
    /> -->
    <ResetPassword @updateReset="handleReset" v-if="reset" />
    <GoTry
      @updateGoTry="handleTry"
      @updateLogin="handleLogin"
      v-if="gotry"
    />
    <AppHeader @updateLogin="handleLogin" :login="login" />
    <Block_1
      @updateLogin="handleLogin"
      @updateFormFeedback="handleFormFeedback"
    />
    <MiniMarket />
    <Advantages id="advantages" />
    <Faq @updateLogin="handleLogin" id="faq" />
    <AppFooter />
  </div>
  <div class="wrap market" v-else>
    <main class="marketplace">
      <AppHeader @updateAuth="handleAuth" />
      <div class="content-wrapper">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <Suspense>
              <template #default>
                <component 
                  :is="Component" 
                  :key="route.path" 
                  @updateAuth="handleAuth"
                  @vue:error="(err) => {
                    console.error('Component error:', err);
                    mainStore.showErrorMsg('Ошибка загрузки компонента');
                  }"
                />
              </template>
              <template #fallback>
                <AppLoader :show="true" />
              </template>
            </Suspense>
          </transition>
        </router-view>
      </div>
      <AppFooter />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app {
  font-family: "Montserrat", sans-serif;
  width: 100%;
}

* {
  padding: 0px;
  margin: 0px;
  border: none;
  font-weight: 400;
  font-style: normal;
  scroll-behavior: smooth;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Анимации переходов между страницами */
.page-enter-active,
.page-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@font-face {
  font-family: 'Pizzicato';
  src: url('@/assets/fonts/pizzicato.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap; /* Оптимизация загрузки */
}

h2 {
  text-align: center;
}

.wrap {
  display: flex;
  flex-direction: column;
  width: 100vw;
  position: relative;
  margin: 0;
  overflow-x: hidden;
}

.market,
.more {
  width: 100%;
  max-width: none;
}

body,
#app {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f5;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Links */

a,
a:link,
a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

/* Common */

aside,
nav,
footer,
header,
section,
main {
  display: block;
}

img {
  vertical-align: top;
}

img,
svg {
  max-width: 100%;
  height: auto;
}

address {
  font-style: normal;
}

/* Form */

input,
textarea,
button,
select {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background-color: transparent;
}

input::-ms-clear {
  display: none;
}

button,
input[type="submit"] {
  display: inline-block;
  box-shadow: none;
  background-color: transparent;
  background: none;
  cursor: pointer;
}

input:focus,
input:active,
button:focus,
button:active {
  outline: none;
  box-shadow: none;
}

button::-moz-focus-inner {
  padding: 0;
  border: 0;
}

.card {
  transition: all 500ms ease;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.06);
  box-shadow: 0 0 10px 0 #00000037;
}

.market {
  flex-direction: row;
}

.marketplace {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

/* Обеспечиваем минимальную высоту для всех страниц */
.content-wrapper > * {
  flex: 1 0 auto;
}

/* Стили для всех wrapper-ов на страницах */
.content-wrapper .wrapper:not(.cards) {
  display: flex;
  flex-direction: column;
}

/* Обеспечиваем чтобы footer был всегда внизу */
.content-wrapper > * {
  flex: 1;
}

/* Особые стили для страниц с минимальным контентом */
.content-wrapper > *:not([class*="profile"]):not([class*="about"]):not([class*="product-details"]) {
  min-height: calc(100vh - 200px);
}

.bottomPanel {
  display: none;
}

.msg {
  padding: 10px 13px;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  
  width: fit-content;
  margin: 0 auto;
}

.success {
  background-color: #3cca0d;
}

.error {
  background-color: #cf0032;
}

.bx,
.btn {
  transition: all 500ms ease;
}

.bx:hover,
.btn:hover {
  box-shadow: 0 0 10px 0 #00000037;
}

.font-medium {
  font-weight: 500;
}

.justify-between {
  justify-content: space-between;
}

.flex {
  display: flex;
}

.mt-4 {
  margin-top: 1rem;
}

.items-center {
  align-items: center;
}

.font-bold {
  font-weight: 700;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-center {
  text-align: center;
}

.pb-16 {
  padding-bottom: 4rem;
}
@media (max-width: 768px) {
  .leftPanel {
    display: none;
  }

  .bottomPanel {
    display: block;
  }

  .marketplace {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .wrapper {
    margin-top: 0 !important;
    padding: 20px !important;
  }
}

/* Адаптивность для больших экранов */

/* Extra wide screens (2560px and up) */
@media (min-width: 2560px) {
  .wrap {
    max-width: 2400px;
    margin: 0 auto;
  }
  
  .marketplace {
    max-width: 2400px;
    margin: 0 auto;
  }
}

/* Ultra wide screens (1920px to 2559px) */
@media (min-width: 1920px) and (max-width: 2559px) {
  .wrap {
    max-width: 2000px;
    margin: 0 auto;
  }
  
  .marketplace {
    max-width: 2000px;
    margin: 0 auto;
  }
}

/* Large desktop optimization */
@media (min-width: 1440px) {
  body {
    font-size: 16px;
    line-height: 1.6;
  }
  
  h2 {
    font-size: clamp(2rem, 4vw, 3.5rem);
  }
}

/* Mobile fix for empty space after footer */
@media (max-width: 768px) {
  html,
  body,
  #app {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    min-height: 100vh !important;
  }
  
  body {
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch;
  }
  
  .marketplace {
    min-height: 100vh !important;
    height: auto !important;
  }
  
  .content-wrapper {
    flex: 1 0 auto !important;
    min-height: auto !important;
  }
  
  .content-wrapper > * {
    min-height: auto !important;
  }
  
  .wrap {
    min-height: 100vh !important;
    height: auto !important;
  }
}
</style>
