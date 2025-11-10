<script>
import AppLoader from "./AppLoader.vue";
import AppLogin from "./AppLogin.vue";
import AppRegister from "./AppRegister.vue";
import { translateStatus } from '../utils/statusTranslator.js';
import { useDisplay } from 'vuetify'
import { useMainStore } from "../stores/main.js";

export default {
  name: "CardOpen",
  components: { AppLoader, AppLogin, AppRegister },
  emits: ['updateAuth', 'vnodeError'],
  setup() {
    const { mobile } = useDisplay()
    const mainStore = useMainStore()
    return { mobile, mainStore }
  },
  data() {
    return {
      items: [],
      carouselRef: "",
      customer_id: "",
      isLoading: false,
      id: "",
      artworkId: null,
      artworkDocumentId: "",
      title: "",
      price: "",
      size: "",
      status: "",
      img_urls: [],
      description: "",
      // Дополнительная информация
      aboutArtwork: "",
      technique: "",
      storageConditions: "",
      deliveryInfo: "",
      is_favorite: false,
      is_in_cart: false,
      cart_id: localStorage.getItem("cart_id"),
      showRegister: false,
      showLogin: false,
      dialog: false,
      fullscreenImage: "",
      currentIndex: 0,
      isHovered: false,
      interval: null
    };
  },
  methods: {
    async load_pic() {
      console.log('load_pic() method called');
      try {
        this.isLoading = true;
        this.customer_id = localStorage.getItem("id");
        this.id = this.$route.query.documentId;
        
        if (!this.id) {
          console.error('No documentId provided');
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Не указан ID картины');
          }
          this.$router.push('/arts');
          return;
        }
        
        if (!this.$api || !this.$api.artworks) {
          console.error('API not initialized');
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Ошибка инициализации API');
          }
          this.$router.push('/arts');
          return;
        }
        
        console.log('Loading artwork with documentId:', this.id);
        
        let response = await this.$api.artworks.getOne(this.id);
        console.log('Artwork response:', response);
        
        const artwork = response.data.data;
        
        if (!artwork) {
          console.error('Artwork not found in response');
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Картина не найдена');
          }
          this.$router.push('/arts');
          return;
        }
        
        console.log('Artwork data:', artwork);
        console.log('Available IDs - documentId:', artwork.documentId, 'id:', artwork.id);
        
        // Сохраняем оба идентификатора произведения
        this.artworkId = artwork.id;
        this.artworkDocumentId = artwork.documentId || artwork.id;
        this.title = artwork.title;
        this.description = artwork.description;
        this.price = artwork.price;
        this.size = artwork.size;
        this.status = artwork.status;
        this.unique_value = artwork.unique_value;
        this.artist = artwork.artist;
        
        // Дополнительная информация с fallback на дефолтные тексты
        this.aboutArtwork = artwork.aboutArtwork || "";
        this.technique = artwork.technique || "";
        this.storageConditions = artwork.storageConditions || "";
        this.deliveryInfo = artwork.deliveryInfo || "";
        
        // Обработка изображений
        this.img_urls = artwork.images?.map(image => 
          `${process.env.VUE_APP_STRAPI_URL}${image.url}`
        ) || [];
        
        // Проверка статуса избранного и корзины
        await this.checkFavoriteStatus();
        await this.checkCartStatus();
        
        // Запускаем автопереключение после загрузки изображений
        if (this.img_urls?.length > 1) {
          this.startInterval();
        }
      } catch (err) {
        console.error('Error loading artwork:', err);
        console.error('Requested ID:', this.id);
        console.error('Full error response:', err.response);
        
        // Если произведение не найдено (404), перенаправляем на страницу всех картин
        if (err.response && err.response.status === 404) {
          this.$router.push('/arts');
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Произведение не найдено');
          }
          return;
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    getStatusText(status) {
      return translateStatus(status);
    },
    
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.img_urls.length;
      this.resetInterval();
    },
    
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.img_urls.length) % this.img_urls.length;
      this.resetInterval();
    },
    
    resetInterval() {
      clearInterval(this.interval);
      this.startInterval();
    },
    
    startInterval() {
      this.interval = setInterval(() => {
        if (!this.isHovered) {
          this.nextSlide();
        }
      }, 3000);
    },

    async addCart(event) {
      console.log('addCart method called');
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      if (this.isLoading) {
        console.log('addCart: already loading, ignoring');
        return;
      }
      
      try {
        this.customer_id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        
        if (!this.customer_id) {
          this.showRegister = true;
          return;
        }
        
        if (!token) {
          this.mainStore.showErrorMsg("Необходимо войти в систему");
          return;
        }
        
        if (!this.artworkId) {
          this.mainStore.showErrorMsg("Ошибка: не удалось определить товар");
          return;
        }
        
        // this.isLoading = true; // ВРЕМЕННО ОТКЛЮЧЕНО
        console.log('Adding to cart with artworkId:', this.artworkId);
        let response = await this.$api.cart.add(this.artworkId);
        console.log('Cart add response:', response);
        this.mainStore.showSuccessMsg("Добавлено в корзину");
        this.is_in_cart = true;
        
        // Триггерим обновление счетчика корзины в хедере
        if (this.mainStore) {
          this.mainStore.triggerCartUpdate();
        }
      } catch (err) {
        console.error('Error adding to cart:', err);
        console.error('Error response:', err.response);
        
        let errorMessage = "Ошибка при добавлении в корзину";
        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = "Необходимо войти в систему";
              break;
            case 400:
              errorMessage = "Неверные данные для добавления в корзину";
              break;
            case 404:
              errorMessage = "Товар не найден";
              break;
            case 409:
              errorMessage = "Товар уже в корзине";
              this.is_in_cart = true;
              break;
            default:
              errorMessage = `Ошибка сервера: ${err.response.status}`;
          }
        } else if (err.request) {
          errorMessage = "Нет соединения с сервером";
        }
        
        this.mainStore.showErrorMsg(errorMessage);
      } finally {
        // this.isLoading = false; // ВРЕМЕННО ОТКЛЮЧЕНО
      }
    },

    async removeCart(event) {
      console.log('removeCart method called');
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      if (this.isLoading) {
        console.log('removeCart: already loading, ignoring');
        return;
      }
      
      try {
        // this.isLoading = true; // ВРЕМЕННО ОТКЛЮЧЕНО
        let response = await this.$api.cart.remove({ id: this.artworkId, documentId: this.artworkDocumentId });
        console.log(response);
        this.is_in_cart = false;
        this.mainStore.showSuccessMsg("Убрано из корзины");
        
        // Триггерим обновление счетчика корзины в хедере
        if (this.mainStore) {
          this.mainStore.triggerCartUpdate();
        }
      } catch (err) {
        console.error('Error removing from cart:', err);
        console.error('Error response:', err.response);
        
        let errorMessage = "Ошибка при удалении из корзины";
        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = "Необходимо войти в систему";
              break;
            case 404:
              errorMessage = "Товар не найден в корзине";
              break;
            default:
              errorMessage = `Ошибка сервера: ${err.response.status}`;
          }
        } else if (err.request) {
          errorMessage = "Нет соединения с сервером";
        }
        
        this.mainStore.showErrorMsg(errorMessage);
      } finally {
        // this.isLoading = false; // ВРЕМЕННО ОТКЛЮЧЕНО
      }
    },

    async checkFavoriteStatus() {
      try {
        if (!localStorage.getItem("id")) {
          this.is_favorite = false;
          return;
        }
        
        const response = await this.$api.favorites.getAll();
        const favorites = response.data?.data || [];
        
        // Проверяем статус избранного с учетом Strapi 5 структуры
        this.is_favorite = favorites.some(fav => {
          // Попробуем несколько вариантов структуры данных
          const favArtwork = fav?.artwork || fav?.attributes?.artwork?.data;
          
          if (!favArtwork) {
            // Если нет вложенного artwork, возможно сам fav и есть artwork
            return fav.id === this.artworkId || fav.documentId === this.artworkDocumentId;
          }
          
          // Сравниваем по id и documentId
          return favArtwork.id === this.artworkId || 
                 favArtwork.documentId === this.artworkDocumentId;
        });
      } catch (err) {
        console.error('Error checking favorite status:', err);
        this.is_favorite = false;
      }
    },

    async checkCartStatus() {
      try {
        if (!localStorage.getItem("id")) {
          this.is_in_cart = false;
          return;
        }
        
        const response = await this.$api.cart.getAll();
        const cartItems = response.data?.data || [];
        
        this.is_in_cart = cartItems.some(item => {
          const cartArtwork = item?.artwork;
          if (!cartArtwork) return false;
          return cartArtwork.id === this.artworkId || cartArtwork.documentId === this.artworkDocumentId;
        });
      } catch (err) {
        console.error('Error checking cart status:', err);
        this.is_in_cart = false;
      }
    },

    async addFav(event) {
      console.log('addFav method called');
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      if (this.isLoading) {
        console.log('addFav: already loading, ignoring');
        return;
      }
      
      try {
        this.customer_id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        
        if (!this.customer_id) {
          this.showRegister = true;
          return;
        }
        
        if (!token) {
          this.mainStore.showErrorMsg("Необходимо войти в систему");
          return;
        }
        
        if (!this.artworkId) {
          this.mainStore.showErrorMsg("Ошибка: не удалось определить товар");
          return;
        }
        
        // this.isLoading = true; // ВРЕМЕННО ОТКЛЮЧЕНО
        console.log('Adding to favorites with artworkId:', this.artworkId);
        let response = await this.$api.favorites.add(this.artworkId);
        console.log('Favorites add response:', response);
        this.mainStore.showSuccessMsg("Добавлено в избранное");
        this.is_favorite = true;
        
        // Триггерим обновление счетчика избранного в хедере
        if (this.mainStore) {
          this.mainStore.triggerFavoritesUpdate();
        }
      } catch (err) {
        console.error('Error adding to favorites:', err);
        console.error('Error response:', err.response);
        
        let errorMessage = "Ошибка при добавлении в избранное";
        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = "Необходимо войти в систему";
              break;
            case 400:
              errorMessage = "Неверные данные для добавления в избранное";
              break;
            case 404:
              errorMessage = "Произведение не найдено";
              break;
            case 409:
              errorMessage = "Произведение уже в избранном";
              break;
            default:
              errorMessage = `Ошибка сервера: ${err.response.status}`;
          }
        } else if (err.request) {
          errorMessage = "Нет соединения с сервером";
        }
        
        this.mainStore.showErrorMsg(errorMessage);
      } finally {
        // this.isLoading = false; // ВРЕМЕННО ОТКЛЮЧЕНО
      }
    },
    
    async removeFav(event) {
      console.log('removeFav method called');
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      if (this.isLoading) {
        console.log('removeFav: already loading, ignoring');
        return;
      }
      
      try {
        // this.isLoading = true; // ВРЕМЕННО ОТКЛЮЧЕНО
        let response = await this.$api.favorites.remove({ id: this.artworkId, documentId: this.artworkDocumentId });
        console.log(response);
        this.is_favorite = false;
        this.mainStore.showSuccessMsg("Удалено из избранного");
        
        // Триггерим обновление счетчика избранного в хедере
        if (this.mainStore) {
          this.mainStore.triggerFavoritesUpdate();
        }
      } catch (err) {
        console.error('Error removing from favorites:', err);
        console.error('Error response:', err.response);
        
        let errorMessage = "Ошибка при удалении из избранного";
        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = "Необходимо войти в систему";
              break;
            case 404:
              errorMessage = "Произведение не найдено в избранном";
              break;
            default:
              errorMessage = `Ошибка сервера: ${err.response.status}`;
          }
        } else if (err.request) {
          errorMessage = "Нет соединения с сервером";
        }
        
        this.mainStore.showErrorMsg(errorMessage);
      } finally {
        // this.isLoading = false; // ВРЕМЕННО ОТКЛЮЧЕНО
      }
    },
    
    openDialog(type) {
      if (type == "login") {
        this.showLogin = true;
      } else {
        this.showRegister = true;
      }
    },

    handleFavoriteClick(event) {
      console.log('handleFavoriteClick called');
      event.preventDefault();
      event.stopPropagation();
      
      if (this.is_favorite) {
        this.removeFav(event);
      } else {
        this.addFav(event);
      }
    },

    handleAddToCart(event) {
      console.log('handleAddToCart called');
      event.preventDefault();
      event.stopPropagation();
      this.addCart(event);
    },

    handleRemoveFromCart(event) {
      console.log('handleRemoveFromCart called');
      event.preventDefault();
      event.stopPropagation();
      this.removeCart(event);
    },
    
    handleLog() {
      this.showLogin = false;
      setTimeout(() => {
        this.showRegister = true;
      }, 300);
    },
    
    openFullscreen(img) {
      this.fullscreenImage = `https://217.114.2.107:5000/images/${img}`
      this.dialog = true
    },
    
    closeFullscreen() {
      this.dialog = false
    },

    toggleFullscreen() {
      this.dialog = !this.dialog;
    },

    setMainImage(index) {
      this.mainImageIndex = index;
    },

    nextImage() {
      if (this.art.images && this.art.images.length > 1) {
        this.mainImageIndex = (this.mainImageIndex + 1) % this.art.images.length;
      }
    },

    prevImage() {
      if (this.art.images && this.art.images.length > 1) {
        this.mainImageIndex = this.mainImageIndex === 0 
          ? this.art.images.length - 1 
          : this.mainImageIndex - 1;
      }
    },

    getArtistName() {
      if (!this.artist) return null;
      if (this.artist.first_name && this.artist.last_name) {
        return `${this.artist.first_name} ${this.artist.last_name}`;
      }
      return this.artist.username || 'Художник';
    },

    getArtistAvatar() {
      if (this.artist?.avatar?.url) {
        return `http://localhost:1337${this.artist.avatar.url}`;
      }
      return '/assets/avatar.jpeg';
    },

    goToArtist() {
      console.log('Artist data:', this.artist);
      if (this.artist?.id) {
        console.log('Navigating to artist with ID:', this.artist.id);
        this.$router.push({ name: 'artist', params: { id: this.artist.id } });
      } else {
        console.log('Artist ID not found');
      }
    },

    getStatusClass(status) {
      const statusText = this.getStatusText(status);
      if (statusText === 'В наличии') return 'status-available';
      if (statusText === 'Нет в наличии') return 'status-unavailable';
      if (statusText === 'Доступно под заказ') return 'status-custom';
      return 'status-default';
    },



    handleScroll() {
      // Этот метод будет обновлен в CSS, но оставляем обработчик на случай необходимости
    },

    getAboutArtworkText() {
      return this.aboutArtwork || "";
    },

    getTechniqueText() {
      return this.technique || "";
    },

    getStorageConditionsText() {
      return this.storageConditions || "";
    },

    getDeliveryInfoText() {
      return this.deliveryInfo || "";
    },

    hasAdditionalInfo() {
      return this.aboutArtwork || this.technique || this.storageConditions || this.deliveryInfo;
    },
  },
  
  created() {
    console.log('CardOpen component CREATED');
  },

  async mounted() {
    console.log('CardOpen component MOUNTED');
    this.load_pic();
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll);
    });
  },

  beforeUnmount() {
    console.log('CardOpen component BEFORE UNMOUNT');
    clearInterval(this.interval);
    window.removeEventListener('scroll', this.handleScroll);
  },

  unmounted() {
    console.log('CardOpen component UNMOUNTED');
  },

  // Route guards для отслеживания роутинга
  beforeRouteLeave(to, from, next) {
    console.log('CardOpen: beforeRouteLeave called', { to: to.path, from: from.path });
    next();
  },

  beforeRouteUpdate(to, from, next) {
    console.log('CardOpen: beforeRouteUpdate called', { to: to.path, from: from.path });
    next();
  },
};
</script>

<template>
  <div class="card-open-wrapper">
    <AppLoader v-show="isLoading" />
    <section class="product-details" v-show="!isLoading">
    <!-- Современная галерея изображений -->
    <div class="image-gallery" v-if="img_urls?.length">
      <div 
        class="main-image-container"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div class="image-wrapper">
          <img 
            :src="img_urls[currentIndex] || '/logo.png'" 
            alt="Product image"
            class="main-image"
            @click="openFullscreen(img_urls[currentIndex])"
          />
          
          <!-- Градиентные стрелки навигации -->
          <button 
            v-if="img_urls.length > 1"
            class="nav-arrow nav-arrow-prev"
            @click.stop="prevSlide"
            :style="{ opacity: isHovered ? 1 : 0 }"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            v-if="img_urls.length > 1"
            class="nav-arrow nav-arrow-next"
            @click.stop="nextSlide"
            :style="{ opacity: isHovered ? 1 : 0 }"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Современные индикаторы -->
          <div class="image-indicators" v-if="img_urls.length > 1">
            <button 
              v-for="(img, index) in img_urls" 
              :key="index"
              :class="['indicator', { active: currentIndex === index }]"
              @click.stop="currentIndex = index"
            ></button>
          </div>
          
          <!-- Zoom иконка -->
          <div class="zoom-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Информационная панель -->
    <div class="product-info">
      <div class="info-header">
        <h1 class="product-title">{{ title }}</h1>
      </div>
      
      <!-- Цена и действия -->
      <div class="price-actions">
        <div class="price-section">
          <span class="price-label">Цена</span>
          <span class="price-value">{{ price }} ₽</span>
        </div>
        <div class="action-buttons">
          <!-- Кнопка избранного - простое сердечко -->
          <button 
            type="button"
            class="heart-btn" 
            :class="{ active: is_favorite }"
            @click="handleFavoriteClick"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" :fill="is_favorite ? 'currentColor' : 'none'">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Кнопки корзины -->
          <button 
            v-if="!is_in_cart" 
            type="button"
            class="primary-btn" 
            @click="handleAddToCart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Добавить в корзину</span>
          </button>
          
          <button 
            v-else 
            type="button"
            class="danger-btn" 
            @click="handleRemoveFromCart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Удалить из корзины</span>
          </button>
        </div>
      </div>
      
      <!-- Карточка художника -->
      <div class="artist-card" v-if="artist && getArtistName()" @click="goToArtist()">
        <div class="artist-card-content">
          <div class="artist-avatar-wrapper">
            <img :src="getArtistAvatar()" :alt="getArtistName()" class="artist-avatar" />
            <div class="artist-status-indicator"></div>
          </div>
          <div class="artist-details">
            <span class="artist-label">Автор произведения</span>
            <h3 class="artist-name">{{ getArtistName() }}</h3>
          </div>
          <div class="artist-action">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Детали произведения (статус, размер) -->
      <div class="product-details-grid">
        <div class="detail-item">
          <span class="detail-label">Статус</span>
          <div class="status-badge-small" :class="getStatusClass(status || 'available')">
            <div class="status-icon"></div>
            <span class="detail-value">{{ getStatusText(status || 'available') }}</span>
          </div>
        </div>
        <div class="detail-item" v-if="size">
          <span class="detail-label">Размер</span>
          <span class="detail-value">{{ size }}</span>
        </div>
        <div class="detail-item" v-if="unique_value">
          <span class="detail-label">Особенность</span>
          <span class="detail-value unique">Уникальное произведение</span>
        </div>
      </div>
      
      <!-- Описание -->
      <div class="description-section" v-if="description">
        <h3 class="description-title">Описание</h3>
        <div class="description-content" v-html="description"></div>
      </div>
      
      <!-- Дополнительная информация (показывается только если есть данные) -->
      <div class="additional-info" v-if="hasAdditionalInfo()">
        <h3 class="section-title">Дополнительная информация</h3>
        <div class="info-block" v-if="aboutArtwork">
          <h4>О произведении</h4>
          <p>{{ getAboutArtworkText() }}</p>
        </div>
        <div class="info-block" v-if="technique">
          <h4>Техника исполнения</h4>
          <p>{{ getTechniqueText() }}</p>
        </div>
        <div class="info-block" v-if="storageConditions">
          <h4>Условия хранения</h4>
          <p>{{ getStorageConditionsText() }}</p>
        </div>
        <div class="info-block" v-if="deliveryInfo">
          <h4>Доставка и упаковка</h4>
          <p>{{ getDeliveryInfoText() }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Диалоги остаются без изменений -->
  <v-dialog
    v-model="dialog"
    fullscreen
    transition="dialog-bottom-transition"
    :scrim="false"
  >
    <v-card color="black">
      <v-toolbar dark color="black">
        <v-btn icon dark @click="closeFullscreen">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-img
        :src="fullscreenImage"
        contain
        class="fullscreen-image"
        @click="closeFullscreen"
      ></v-img>
    </v-card>
  </v-dialog>

  <v-dialog max-width="500" v-model="showLogin">
    <AppLogin @close="showLogin = false" @goReg="handleLog" />
  </v-dialog>
  <v-dialog max-width="500" v-model="showRegister">
    <AppRegister @close="showRegister = false" />
  </v-dialog>
  </div>
</template>

<style scoped>
/* Обёртка для корректной работы с Vue Transition */
.card-open-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Современный дизайн страницы произведения */
.product-details {
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  padding: 40px 60px;
  min-height: calc(100vh - 120px);
  align-items: start;
}

/* Галерея изображений */
.image-gallery {
  position: -webkit-sticky; /* Для Safari */
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  z-index: 10;
  align-self: flex-start;
  overflow-y: auto;
  will-change: transform; /* Оптимизация для анимации */
}

.main-image-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.main-image:hover {
  transform: scale(1.05);
}

/* Современные стрелки навигации */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 16px;
  color: #E8336E;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-arrow:hover {
  background: #E8336E;
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 12px 40px rgba(232, 51, 110, 0.3);
}

.nav-arrow-prev {
  left: 20px;
}

.nav-arrow-next {
  right: 20px;
}

/* Современные индикаторы */
.image-indicators {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #E8336E;
  transform: scale(1.3);
  box-shadow: 0 0 20px rgba(232, 51, 110, 0.6);
}

.indicator:hover {
  background: rgba(232, 51, 110, 0.8);
  transform: scale(1.15);
}

/* Zoom подсказка */
.zoom-hint {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(5px);
}

.main-image-container:hover .zoom-hint {
  opacity: 1;
}

/* Информационная панель */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  margin: 0;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Современный статус */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-available {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border-color: #34d399;
}

.status-available .status-icon {
  background: #10b981;
}

.status-unavailable {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #991b1b;
  border-color: #f87171;
}

.status-unavailable .status-icon {
  background: #ef4444;
}

.status-custom {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  border-color: #818cf8;
}

.status-custom .status-icon {
  background: #6366f1;
}

/* Маленький статус для сетки деталей */
.status-badge-small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  width: fit-content;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.status-badge-small .status-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-badge-small.status-available {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border-color: #34d399;
}

.status-badge-small.status-available .status-icon {
  background: #10b981;
}

.status-badge-small.status-unavailable {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #991b1b;
  border-color: #f87171;
}

.status-badge-small.status-unavailable .status-icon {
  background: #ef4444;
}

.status-badge-small.status-custom {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  border-color: #818cf8;
}

.status-badge-small.status-custom .status-icon {
  background: #6366f1;
}

/* Карточка художника */
.artist-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.artist-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  transition: left 0.4s ease;
  z-index: 1;
}

.artist-card:hover::before {
  left: 0;
}

.artist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(232, 51, 110, 0.2);
  border-color: #E8336E;
}

.artist-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 2;
}

.artist-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.artist-avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  object-fit: cover;
  border: 3px solid #e2e8f0;
  transition: all 0.3s ease;
}

.artist-card:hover .artist-avatar {
  border-color: white;
  transform: scale(1.05);
}

.artist-status-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
}

.artist-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.artist-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.artist-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  transition: color 0.3s ease;
}

.artist-card:hover .artist-label,
.artist-card:hover .artist-name {
  color: white;
}

.artist-action {
  color: #E8336E;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.artist-card:hover .artist-action {
  color: white;
  transform: translateX(4px);
}

/* Детали произведения */
.product-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.detail-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.detail-value.unique {
  color: #E8336E;
  font-weight: 700;
}

/* Цена и действия */
.price-actions {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

/* Стили для кнопки-сердечка */
.heart-btn {
  width: 56px;
  height: 56px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  background: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.heart-btn:hover {
  border-color: #fca5a5;
  color: #dc2626;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.2);
}

.heart-btn.active {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

.heart-btn.active:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

.primary-btn {
  flex: 1;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d12757 0%, #b91c5c 100%);
  transition: left 0.3s ease;
}

.primary-btn:hover::before {
  left: 0;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(232, 51, 110, 0.4);
}

.primary-btn span,
.primary-btn svg {
  position: relative;
  z-index: 1;
}

.danger-btn {
  flex: 1;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.danger-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transition: left 0.3s ease;
}

.danger-btn:hover::before {
  left: 0;
}

.danger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.4);
}

.danger-btn span,
.danger-btn svg {
  position: relative;
  z-index: 1;
}

/* Описание */
.description-section {
  background: #f8fafc;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #e2e8f0;
}

.description-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.description-content {
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
}

/* Дополнительная информация */
.additional-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.info-block {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.info-block h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.info-block p {
  font-size: 16px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}



/* Адаптивность */
@media (max-width: 1024px) {
  .product-details {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
  }
  
  .image-gallery {
    position: sticky;
    top: 10px;
    z-index: 10;
  }
  
  .product-title {
    font-size: 2rem;
  }
  
  .price-value {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .product-details {
    gap: 24px;
    padding: 15px;
  }
  
  .artist-card {
    padding: 12px;
  }
  
  .artist-card-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .product-details-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .primary-btn,
  .danger-btn {
    width: 100%;
    height: 48px;
    justify-content: center;
    font-size: 16px;
  }
  
  .heart-btn {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
  }
  
  .nav-arrow {
    width: 44px;
    height: 44px;
  }
  
  .nav-arrow-prev {
    left: 15px;
  }
  
  .nav-arrow-next {
    right: 15px;
  }
}

/* Медиа-запросы для компактных уведомлений */
@media (max-width: 1024px) and (min-width: 769px) {
  .notification {
    top: 15px;
    right: 15px;
    max-width: 220px;
    padding: 5px 8px;
    font-size: 11px;
    gap: 5px;
  }
  
  .notification-icon {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 768px) {
  .notification {
    top: 15px;
    right: 15px;
    max-width: 200px;
    padding: 5px 8px;
    font-size: 11px;
    border-radius: 5px;
    gap: 5px;
  }
  
  .notification-icon {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .notification {
    top: 10px;
    right: 10px;
    max-width: 180px;
    padding: 4px 8px;
    font-size: 10px;
    border-radius: 4px;
    gap: 4px;
  }
  
  .notification-icon {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
  
  .notification-text {
    word-break: break-word;
    hyphens: auto;
    line-height: 1.15;
  }
}

@media (max-width: 320px) {
  .notification {
    top: 8px;
    right: 8px;
    max-width: 160px;
    padding: 4px 6px;
    font-size: 9px;
    border-radius: 4px;
    gap: 3px;
  }
  
  .notification-icon {
    width: 12px;
    height: 12px;
  }
}

/* Стили для остальных элементов на мобильных */
@media (max-width: 480px) {
  .product-title {
    font-size: 1.75rem;
  }
  
  .price-value {
    font-size: 2rem;
  }
  
  .artist-avatar {
    width: 60px;
    height: 60px;
  }
  
  .image-gallery {
    position: relative;
    top: 0;
  }
}

/* Полноэкранное изображение остается без изменений */
.fullscreen-image {
  height: calc(100vh - 64px);
  width: 100%;
  cursor: zoom-out;
}
</style>