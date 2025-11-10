<script>
import AppLogin from "./AppLogin.vue";
import AppLogo from "./AppLogo.vue";
import AppRegister from "./AppRegister.vue";
import { useMainStore } from '../stores/main.js';

export default {
  name: "AppHeader",
  components: { AppLogin, AppRegister, AppLogo },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      showLogin: false,
      showRegister: false,
      id: "",
      menu: false,
      isScrolled: false,
      cartCount: 0,
      favoriteCount: 0,
      avatar: null
    };
  },
  watch: {
    // Следим за изменениями в корзине
    'mainStore.cartUpdated'() {
      this.loadCounts();
    },
    // Следим за изменениями в избранном
    'mainStore.favoritesUpdated'() {
      this.loadCounts();
    }
  },
  methods: {
    load_info() {
      this.id = localStorage.getItem("id");
      // Загрузка аватара пользователя
      const userAvatar = localStorage.getItem("userAvatar");
      if (userAvatar) {
        this.avatar = userAvatar;
      }
      
      // Загрузка счетчиков
      this.loadCounts();
    },

    async loadCounts() {
      if (this.id) {
        try {
          // Загрузка количества товаров в корзине
          const cartResponse = await this.$api.cart.getAll();
          const cartItems = cartResponse.data?.data || [];
          
          // Считаем только элементы с валидным artwork (в Strapi 5 artwork напрямую)
          const validCartItems = cartItems.filter(item => {
            return item?.artwork;
          });
          
          this.cartCount = validCartItems.length;
          console.log(`Cart count updated: ${this.cartCount} valid items of ${cartItems.length} total`);
          
          // Загрузка количества избранного
          const favoriteResponse = await this.$api.favorites.getAll();
          const favoriteItems = favoriteResponse.data?.data || [];
          
          // Считаем только элементы с валидным artwork
          const validFavoriteItems = favoriteItems.filter(item => {
            return item?.artwork;
          });
          
          this.favoriteCount = validFavoriteItems.length;
          console.log(`Favorite count updated: ${this.favoriteCount} valid items of ${favoriteItems.length} total`);
        } catch (err) {
          console.log('Ошибка загрузки счетчиков:', err);
        }
      }
    },

    handleScroll() {
      this.isScrolled = window.scrollY > 20;
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
        this.menu = false; // Закрываем мобильное меню
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

    handleLoginSuccess() {
      this.showLogin = false;
      this.load_info();
    },

    handleRegisterSuccess() {
      this.showRegister = false;
      this.load_info();
    },

    logout() {
      this.mainStore.logout();
      this.id = "";
      this.avatar = null;
      this.cartCount = 0;
      this.favoriteCount = 0;
      this.showProfileMenu = false;
      this.$router.push({ name: "home" });
    },

    goToProfile() {
      this.goRoute('profile');
    },

    closeMenu() {
      this.menu = false;
    }
  },

  mounted() {
    this.load_info();
    window.addEventListener('scroll', this.handleScroll);
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.menu = false;
      }
    });
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<template>
  <header class="modern-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-container">
      <!-- Логотип -->
      <div class="logo-section">
        <AppLogo />
      </div>

      <!-- Навигация -->
      <nav class="main-navigation" :class="{ 'nav-hidden': menu }">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link 
              to="/" 
              class="nav-link"
              active-class="nav-active"
              @click="closeMenu"
            >
              <span>Главная</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/arts" 
              class="nav-link"
              active-class="nav-active"
              @click="closeMenu"
            >
              <span>Картины</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/artists" 
              class="nav-link"
              active-class="nav-active"
              @click="closeMenu"
            >
              <span>Художники</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/about-us" 
              class="nav-link"
              active-class="nav-active"
              @click="closeMenu"
            >
              <span>О нас</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Действия пользователя -->
      <div class="user-actions">
        <!-- Неавторизованный пользователь -->
        <template v-if="!id">
          <button class="auth-button" @click="openDialog('login')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="auth-text">Войти</span>
          </button>
        </template>

        <!-- Авторизованный пользователь -->
        <template v-else>
          <!-- Корзина -->
          <button class="action-button cart-button" @click="goRoute('cart')">
            <div class="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
            </div>
          </button>

          <!-- Избранное -->
          <button class="action-button favorite-button" @click="goRoute('favorite')">
            <div class="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61C20.32 4.07 19.69 3.64 18.99 3.35C18.3 3.06 17.55 2.9 16.8 2.9C16.05 2.9 15.3 3.06 14.61 3.35C13.91 3.64 13.28 4.07 12.76 4.61L12 5.37L11.24 4.61C10.18 3.55 8.73 2.96 7.2 2.96C5.67 2.96 4.22 3.55 3.16 4.61C2.1 5.67 1.51 7.12 1.51 8.65C1.51 10.18 2.1 11.63 3.16 12.69L12 21.5L20.84 12.69C21.9 11.63 22.49 10.18 22.49 8.65C22.49 7.12 21.9 5.67 20.84 4.61Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-if="favoriteCount > 0" class="badge">{{ favoriteCount }}</span>
            </div>
          </button>

          <!-- Профиль -->
          <div class="profile-section">
            <button class="profile-button" @click="goToProfile">
              <div class="avatar-wrapper">
                <img 
                  v-if="avatar" 
                  :src="avatar" 
                  alt="Профиль" 
                  class="user-avatar"
                />
                <div v-else class="default-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
            

          </div>
        </template>

        <!-- Мобильное меню -->
        <button class="mobile-menu-button" @click="menu = !menu">
          <div class="hamburger" :class="{ 'hamburger-active': menu }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Мобильное меню -->
    <transition name="mobile-menu">
      <div v-if="menu" class="mobile-menu-overlay" @click="closeMenu">
        <div class="mobile-menu-content" @click.stop>
          <!-- Профиль в мобильном меню -->
          <div v-if="id" class="mobile-profile">
            <div class="mobile-avatar">
              <img 
                v-if="avatar" 
                :src="avatar" 
                alt="Профиль"
              />
              <div v-else class="default-mobile-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <span class="mobile-profile-text">Профиль</span>
          </div>

          <!-- Навигация в мобильном меню -->
          <nav class="mobile-navigation">
            <router-link to="/" class="mobile-nav-link" @click="closeMenu">
              <div class="mobile-nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>Главная</span>
            </router-link>

            <router-link to="/arts" class="mobile-nav-link" @click="closeMenu">
              <div class="mobile-nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>Картины</span>
            </router-link>

            <router-link to="/artists" class="mobile-nav-link" @click="closeMenu">
              <div class="mobile-nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7ZM23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>Художники</span>
            </router-link>

            <router-link to="/about-us" class="mobile-nav-link" @click="closeMenu">
              <div class="mobile-nav-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>О нас</span>
            </router-link>

            <!-- Действия авторизованного пользователя в мобильном меню -->
            <template v-if="id">
              <router-link to="/profile" class="mobile-nav-link" @click="closeMenu">
                <div class="mobile-nav-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Профиль</span>
              </router-link>

              <router-link to="/cart" class="mobile-nav-link" @click="closeMenu">
                <div class="mobile-nav-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span v-if="cartCount > 0" class="mobile-badge">{{ cartCount }}</span>
                </div>
                <span>Корзина</span>
              </router-link>

              <router-link to="/favorite" class="mobile-nav-link" @click="closeMenu">
                <div class="mobile-nav-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61C20.32 4.07 19.69 3.64 18.99 3.35C18.3 3.06 17.55 2.9 16.8 2.9C16.05 2.9 15.3 3.06 14.61 3.35C13.91 3.64 13.28 4.07 12.76 4.61L12 5.37L11.24 4.61C10.18 3.55 8.73 2.96 7.2 2.96C5.67 2.96 4.22 3.55 3.16 4.61C2.1 5.67 1.51 7.12 1.51 8.65C1.51 10.18 2.1 11.63 3.16 12.69L12 21.5L20.84 12.69C21.9 11.63 22.49 10.18 22.49 8.65C22.49 7.12 21.9 5.67 20.84 4.61Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span v-if="favoriteCount > 0" class="mobile-badge">{{ favoriteCount }}</span>
                </div>
                <span>Избранное</span>
              </router-link>

              <button class="mobile-nav-link logout-button" @click="logout">
                <div class="mobile-nav-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Выйти</span>
              </button>
            </template>

            <!-- Кнопка входа в мобильном меню -->
            <template v-else>
              <button class="mobile-auth-button" @click="openDialog('login')">
                <div class="mobile-nav-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Войти</span>
              </button>
            </template>
          </nav>
        </div>
      </div>
    </transition>

    <!-- Диалоги -->
    <v-dialog v-model="showLogin" max-width="500" persistent>
      <AppLogin 
        @close="showLogin = false" 
        @goReg="handleLog" 
        @loginSuccess="handleLoginSuccess" 
      />
    </v-dialog>

    <v-dialog v-model="showRegister" max-width="500" persistent>
      <AppRegister 
        @close="showRegister = false" 
        @registerSuccess="handleRegisterSuccess" 
      />
    </v-dialog>
  </header>
</template>
<style scoped>
/* Современный хедер */
.modern-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  width: 100vw;
  left: 50%;
  right: 0;
  margin-left: -50vw;
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100vw;
}

.header-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  gap: 40px;
}

/* Секция логотипа */
.logo-section {
  flex-shrink: 0;
}

/* Главная навигация */
.main-navigation {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 48px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 0;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  color: #475569;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link span {
  position: relative;
  z-index: 2;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border-radius: 8px; /* Увеличиваем закругление */
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #E8336E;
}

.nav-link:hover::before,
.nav-active::before {
  width: 100%;
}

.nav-active {
  color: #E8336E;
}

/* Действия пользователя */
.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

/* Кнопка авторизации */
.auth-button {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border: none;
  border-radius: 16px;
  padding: 14px 24px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(232, 51, 110, 0.2);
}

.auth-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d12757 0%, #b91c5c 100%);
  transition: left 0.3s ease;
}

.auth-button:hover::before {
  left: 0;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(232, 51, 110, 0.3);
}

.auth-text {
  position: relative;
  z-index: 1;
}

/* Кнопки действий */
.action-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.action-button:hover {
  background: rgba(232, 51, 110, 0.1);
  border-color: #E8336E;
  color: #E8336E;
  transform: translateY(-2px);
}

.button-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Счетчики */
.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  animation: pulse-badge 2s ease-in-out infinite;
}

/* Профиль */
.profile-section {
  position: relative;
  display: flex;
  align-items: center;
}

.profile-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-button:hover {
  transform: scale(1.05);
}

.avatar-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  transition: border-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-button:hover .avatar-wrapper {
  border-color: #E8336E;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

/* Выпадающее меню профиля */
.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
  animation: dropdown-appear 0.2s ease-out;
}

.dropdown-item {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #E8336E;
}

.dropdown-item.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Мобильное меню */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.mobile-menu-button:hover {
  background: rgba(232, 51, 110, 0.1);
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #475569;
  border-radius: 8px;
  transition: transform 0.2s ease, opacity 0.2s ease;
  transform-origin: center;
}

.hamburger-active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Мобильное меню overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.mobile-menu-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  max-width: 85vw;
  height: 100vh;
  background: white;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: auto;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  will-change: transform;
}

/* Профиль в мобильном меню */
.mobile-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.mobile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.mobile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-mobile-avatar {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.mobile-profile-text {
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  min-width: 0;
  word-break: break-word;
}

/* Мобильная навигация */
.mobile-navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  font-size: 16px;
  border-radius: 16px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.mobile-nav-link:hover {
  background: rgba(232, 51, 110, 0.1);
  color: #E8336E;
  transform: translateX(4px);
}

.mobile-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
}

.mobile-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  background: #E8336E;
  color: white;
  border-radius: 12px; /* Увеличиваем закругление */
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.mobile-auth-button {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(232, 51, 110, 0.2);
}

.mobile-auth-button:hover {
  background: linear-gradient(135deg, #d12757 0%, #b91c5c 100%);
  transform: translateX(0) translateY(-2px);
}

.logout-button {
  color: #dc2626;
  margin-top: 20px;
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}

.logout-button:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

/* Анимации переходов */
.mobile-menu-enter-active {
  transition: opacity 0.2s ease-out;
}

.mobile-menu-leave-active {
  transition: opacity 0.15s ease-in;
}

.mobile-menu-enter-active .mobile-menu-content {
  animation: slideInRight 0.25s ease-out;
}

.mobile-menu-leave-active .mobile-menu-content {
  animation: slideOutRight 0.2s ease-in;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

/* Анимация пульсации для счетчиков */
@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Адаптивность */

/* Large tablets and small desktops */
@media (max-width: 1200px) {
  .header-container {
    padding: 0 40px;
    gap: 24px;
  }
  
  .nav-list {
    gap: 28px;
  }
  
  .nav-link {
    font-size: 15px;
  }
}

/* Tablets */
@media (max-width: 1024px) {
  .header-container {
    padding: 0 32px;
    gap: 20px;
  }
  
  .nav-list {
    gap: 24px;
  }
  
  .nav-link {
    font-size: 14px;
  }
  
  .action-button {
    width: 46px;
    height: 46px;
  }
  
  .avatar-wrapper {
    width: 46px;
    height: 46px;
  }
}

/* Small tablets and large phones */
@media (max-width: 768px) {
  .main-navigation {
    display: none;
  }
  
  .mobile-menu-button {
    display: flex;
  }
  
  .mobile-menu-overlay {
    display: block;
  }
  
  .header-container {
    padding: 0 24px;
    min-height: 72px;
  }
  
  .auth-button {
    padding: 12px 18px;
    font-size: 14px;
  }
  
  .auth-text {
    display: none;
  }
  
  .action-button {
    width: 44px;
    height: 44px;
  }
  
  .avatar-wrapper {
    width: 44px;
    height: 44px;
  }
  
  .user-actions {
    gap: 12px;
  }
}

/* Phones */
@media (max-width: 640px) {
  .header-container {
    padding: 0 20px;
    min-height: 68px;
    gap: 12px;
  }
  
  .user-actions {
    gap: 8px;
  }
  
  .mobile-menu-content {
    width: 85vw;
    max-width: 320px;
    padding: 24px 16px;
  }
  
  .auth-button {
    padding: 10px 14px;
    font-size: 13px;
    min-width: auto;
  }
  
  .action-button {
    width: 42px;
    height: 42px;
  }
  
  .avatar-wrapper {
    width: 42px;
    height: 42px;
  }
  
  .badge {
    font-size: 10px;
    min-width: 16px;
    height: 16px;
    top: -6px;
    right: -6px;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .header-container {
    padding: 0 16px;
    min-height: 64px;
    gap: 8px;
  }
  
  .action-button {
    width: 40px;
    height: 40px;
  }
  
  .avatar-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .auth-button {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .mobile-menu-content {
    width: 100vw;
    padding: 20px 12px;
    border-radius: 0 0 16px 16px; /* Закругляем только нижние углы */
  }
  
  .logo-section {
    flex-shrink: 1;
  }
  
  .user-actions {
    gap: 6px;
  }
  
  .badge {
    font-size: 9px;
    min-width: 14px;
    height: 14px;
    top: -5px;
    right: -5px;
  }
}

/* Extra small phones */
@media (max-width: 375px) {
  .header-container {
    padding: 0 6px;
    min-height: 60px;
  }
  
  .action-button {
    width: 36px;
    height: 36px;
  }
  
  .avatar-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .auth-button {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .mobile-menu-content {
    padding: 16px 8px;
  }
}

/* Landscape orientation for phones */
@media (max-height: 500px) and (orientation: landscape) {
  .header-container {
    min-height: 56px;
  }
  
  .mobile-menu-overlay {
    position: fixed;
    height: 100vh;
    overflow-y: auto;
  }
  
  .mobile-menu-content {
    max-height: calc(100vh - 56px);
    overflow-y: auto;
  }
}

/* Print styles */
@media print {
  .modern-header {
    display: none;
  }
}
</style>
