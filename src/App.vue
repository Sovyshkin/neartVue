<script>
/* eslint-disable */
import AppHeader from "./components/AppHeader.vue";
import Block_1 from "./components/Block_1.vue";
// import Banner_1 from "./components/Banner_1.vue";
import Advantages from "./components/BlockAdvantages.vue";
import Faq from "./components/BlockFaq.vue";
import GoTry from "./components/GoTry.vue";
import ResetPassword from "./components/ResetPassword.vue";
import { RouterView } from "vue-router";
// import FormFeedback from "./components/FormFeedback.vue";
import AppFooter from "./components/AppFooter.vue";
import MiniMarket from "./components/BlockMiniMarket.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    Block_1,
    // Banner_1,
    Faq,
    Advantages,
    GoTry,
    ResetPassword,
    RouterView,
    // FormFeedback,
    AppFooter,
    MiniMarket,
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
};
</script>
<template>
  <div class="wrap" v-if="checkRoute()" style="align-items: center">
    <!-- <FormFeedback
      v-if="formFeedback"
      @updateFormFeedback="handleFormFeedback"
    /> -->
    <ResetPassword @updateReset="handleReset" v-if="reset" />
    <GoTry
      @updateGoTry="handleTry"
      @updateRegister="handleRegister"
      @updateLogin="handleLogin"
      v-if="gotry"
    />
    <AppHeader @updateLogin="handleLogin" :register="register" :login="login" />
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
      <RouterView @updateAuth="handleAuth" />
      <AppFooter />
    </main>
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap");
#app {
  font-family: "Manrope", sans-serif;
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

h2 {
  text-align: center;
}

.wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  margin: 0 auto;
}

.market,
.more {
  width: 100%;
  max-width: none;
}

body,
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f5;
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
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

.bottomPanel {
  display: none;
}

.msg {
  padding: 10px 13px;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  border-radius: 15px;
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
    padding-bottom: 80px;
  }
}

@media (max-width: 420px) {
  .wrapper {
    margin-top: 0 !important;
    padding: 20px !important;
  }
}
</style>
