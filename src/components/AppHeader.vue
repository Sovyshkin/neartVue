<script>
import AppLogin from "./AppLogin.vue";
import AppLogo from "./AppLogo.vue";
import AppRegister from "./AppRegister.vue";
export default {
  name: "AppHeader",
  components: { AppLogin, AppRegister, AppLogo },
  data() {
    return {
      showLogin: false,
      showRegister: false,
      id: "",
      menu: false,
    };
  },
  methods: {
    load_info() {
      this.id = localStorage.getItem("id");
    },
    scrollToBottom(name) {
      const element = document.getElementById(name);
      if (element) {
        window.scrollTo({ top: element.offsetTop, behavior: "smooth" });
      } else {
        this.$router.push({ name: "home" });
      }
    },
    goRoute(name) {
      try {
        this.$router.push({ name: name });
      } catch (err) {
        console.log(err);
      }
    },
    openDialog(type) {
      if (type == "login") {
        this.showLogin = true;
      } else {
        this.showRegister = true;
      }
    },
    handleLog() {
      this.showLogin = false;
      setTimeout(() => {
        this.showRegister = true;
      }, 300);
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>
<template>
  <div class="wrapper">
    <AppLogo/>
    <nav class="group-nav adap">
      <li class="item-nav" @click="goRoute('home')">Главная</li>
      <li @click="goRoute('arts')" class="item-nav">Картины</li>
      <li class="item-nav" @click="goRoute('aboutUs')">О нас</li>
    </nav>
    <v-dialog max-width="500" v-if="!id" v-model="showLogin">
      <AppLogin @close="showLogin = false" @goReg="handleLog" />
    </v-dialog>
    <v-dialog max-width="500" v-if="!id" v-model="showRegister">
      <AppRegister @close="showRegister = false" />
    </v-dialog>
    <div class="group">
      <button class="btn login adap" v-if="!id" @click="openDialog('login')">
        Авторизация
      </button>
      <img
        v-if="id"
        @click="goRoute('cart')"
        class="cart"
        src="../assets/cart.png"
        alt=""
      />
      <img
        v-if="id"
        @click="goRoute('favorite')"
        class="favorite"
        src="../assets/favorite.png"
        alt=""
      />
      <div
        class="avatar adap"
        v-if="id"
        @click="this.$router.push({ name: 'profile' })"
      >
        <img v-if="avatar" :src="avatar" alt="" />
        <img v-else src="../assets/profile.png" alt="" />
      </div>
      <div class="menu">
        <img
          @click="menu = !menu"
          class="menu-closed"
          src="../assets/menu.png"
          alt=""
        />
        <transition name="fade">
          <div class="menu-opened" v-if="menu">
            <div class="item" @click="goRoute('profile')" v-if="id">
              <img src="../assets/profile.png" alt="" />
              <span>Профиль</span>
            </div>
            <div class="item" @click="goRoute('home')">
              <img src="../assets/main.png" alt="" />
              <span>Главная</span>
            </div>
            <div class="item" @click="goRoute('arts')">
              <img src="../assets/arts.png" alt="" />
              <span>Картины</span>
            </div>
            <div class="item" @click="goRoute('aboutUs')">
              <img src="../assets/aboutUs.png" alt="" />
              <span>О нас</span>
            </div>
            <div class="item" @click="goRoute('cart')">
              <img src="../assets/cart.png" alt="" />
              <span>Корзина</span>
            </div>
            <div class="item" @click="goRoute('favorite')">
              <img src="../assets/favorite.png" alt="" />
              <span>Избранное</span>
            </div>
            <button class="btn login" v-if="!id" @click="openDialog('login')">
              Авторизация
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  min-height: 80px;
  display: flex;
  gap: 30px;
  align-items: center;
  padding: 0 40px;
  justify-content: space-between;
  background-color: white;
  margin-bottom: 0px;
}

.active-billings {
  width: 100%;
  padding: 5px 10px;
  background-color: #E8336E;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active-billings span {
  color: #fff;
}

.group-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
  transform: translateX(-60px);
}

.item-nav {
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
}

.contacts {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login {
  background-color: #E8336E;
  padding: 14px 24px;
  ;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
}

.arrow {
  height: 20px;
  width: 20px;
}

.item-nav::after {
  margin-top: 2px;
  background-color: #E8336E; /* Цвет линии при наведении на нее курсора мыши */
  display: block;
  content: "";
  height: 2px; /* Высота линии */
  width: 0%;
  -webkit-transition: width 0.4s ease-in-out;
  -moz--transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}
.item-nav:hover:after,
.item-nav:focus:after {
  width: 100%;
}

.main {
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
  color: #0f0f0f;
  display: flex;
  align-items: center;
  gap: 10px;
}

.main span {
  opacity: 30%;
}

.avatar {
  
  overflow: hidden;
  cursor: pointer;
}

.avatar img {
  height: 52px;
  width: 52px;
  object-fit: cover;
}

.group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart,
.favorite {
  height: 30px;
  cursor: pointer;
  transition: all 500ms ease;
}

.cart:hover,
.favorite:hover .avatar img:hover {
  transform: translateY(-3px);
}

.menu {
  display: none;
  position: relative;
}
.menu-closed {
  height: 35px;
  width: 35px;
  cursor: pointer;
}

.menu-opened {
  position: absolute;
  width: 142px;
  z-index: 4;
  top: 40px;
  left: -110px;
  padding: 10px;
  
  display: flex;
  flex-direction: column;
  gap: 7px;
  background-color: #f2f2f2;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: -0.1px;
  cursor: pointer;
  padding: 3px;
}

.item img {
  width: 20px;
  height: 20px;
}

@media (max-width: 1000px) {
  .login {
    padding: 7px 12px;
  }

  .group-nav {
    transform: none;
  }
}

@media (max-width: 780px) {
  .avatar img {
    height: 34px;
    width: 34px;
    object-fit: cover;
  }

  .cart,
  .favorite {
    height: 28px;
    width: 28px;
  }

  .group {
    gap: 6px;
  }

  .mainLogo {
    width: 50px;
  }

  .logoText {
    width: 130px;
  }

  .group-nav {
    gap: 12px;
  }
}

@media (max-width: 650px) {
  .wrapper {
    gap: 10px;
    padding: 0 15px;
  }

  .adap {
    display: none;
  }

  .group {
    gap: 10px;
  }
  .menu {
    display: flex;
  }
}

@media (max-width: 472px) {
  .wrapper {
    padding: 0 7px !important;
  }
}

@media (max-width: 420px) {
  .avatar img {
    height: 32px;
    width: 32px;
  }

  .arrow {
    height: 12px;
    width: 12px;
  }
}
</style>
