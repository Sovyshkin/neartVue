<script>
import { useMainStore } from "../stores/main.js";
import { translateStatus } from '../utils/statusTranslator.js';

export default {
  name: "ProductCard",
  components: {},
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      currentIndex: 0,
      interval: null,
      isHovered: false
    };
  },
  props: {
    id: String,
    documentId: String,
    title: String,
    price: String,
    img_urls: Array,
    description: String,
    status: String,
    size: String,
    cart: Boolean,
    favorite: Boolean,
    admin: Boolean,
    artist: Object,
    mode: {
      type: String,
      default: 'catalog', // 'catalog', 'cart', 'favorites'
    },
    // Дополнительные пропы для разных контекстов
    artworkId: String, // ID произведения искусства
    artworkDocumentId: String, // DocumentID произведения искусства
    favoriteId: String, // ID записи в избранном (для страницы избранного)
  },
  methods: {
    getStatusText(status) {
      return translateStatus(status);
    },

    async addToCart() {
      try {
        if (!localStorage.getItem("id")) {
          if (this.mainStore) {
            this.mainStore.showErrorMsg("Необходимо войти в систему");
          }
          return;
        }

        await this.$api.cart.add(this.id);
        
        if (this.mainStore) {
          this.mainStore.showSuccessMsg("Добавлено в корзину");
          this.mainStore.triggerCartUpdate();
        }
        
        // Эмитим событие для обновления родительского компонента
        this.$emit("itemAdded", { type: 'cart', id: this.documentId });
      } catch (err) {
        console.log(err);
        let errorMessage = "Ошибка при добавлении в корзину";
        if (err.response?.status === 409) {
          errorMessage = "Товар уже в корзине";
        }
        if (this.mainStore) {
          this.mainStore.showErrorMsg(errorMessage);
        }
      }
    },

    async deleteElem() {
      try {
        let response = await this.$api.cart.remove(this.documentId);
        console.log(response);
        
        // Используем глобальную систему уведомлений
        if (this.mainStore) {
          this.mainStore.showSuccessMsg("Товар удален из корзины");
          this.mainStore.triggerCartUpdate();
        }
        
        // Эмитим событие для обновления родительского компонента (без перезагрузки)
        this.$emit("itemRemoved", { type: 'cart', id: this.documentId });
      } catch (err) {
        console.log(err);
        if (this.mainStore) {
          this.mainStore.showErrorMsg("Ошибка при удалении из корзины");
        }
      }
    },

    async addToFavorites() {
      try {
        if (!localStorage.getItem("id")) {
          if (this.mainStore) {
            this.mainStore.showErrorMsg("Необходимо войти в систему");
          }
          return;
        }

        // Используем artwork ID для добавления в избранное
        const artworkId = this.artworkId || this.id;
        await this.$api.favorites.add(artworkId);
        
        if (this.mainStore) {
          this.mainStore.showSuccessMsg("Добавлено в избранное");
          this.mainStore.triggerFavoritesUpdate();
        }
        
        // Эмитим событие для обновления родительского компонента
        this.$emit("itemAdded", { type: 'favorites', id: this.documentId });
      } catch (err) {
        console.log(err);
        let errorMessage = "Ошибка при добавлении в избранное";
        if (err.response?.status === 409) {
          errorMessage = "Произведение уже в избранном";
        }
        if (this.mainStore) {
          this.mainStore.showErrorMsg(errorMessage);
        }
      }
    },

    async removeFromFavorites() {
      try {
        console.log('ProductCard removeFromFavorites called with props:', {
          id: this.id,
          documentId: this.documentId,
          artworkId: this.artworkId,
          artworkDocumentId: this.artworkDocumentId,
          favoriteId: this.favoriteId,
          mode: this.mode
        });

        // Если мы на странице избранного и есть favoriteId, используем прямое удаление
        if (this.mode === 'favorites' && this.favoriteId) {
          console.log('Removing favorite by ID:', this.favoriteId);
          const response = await this.$api.favorites.removeById(this.favoriteId);
          console.log('Remove response:', response);
        } else {
          // В других случаях используем поиск по artwork ID
          const artworkId = this.artworkId || this.id;
          const artworkDocumentId = this.artworkDocumentId || this.documentId;
          
          console.log('Attempting to remove from favorites:', { 
            artworkId, 
            artworkDocumentId,
            mode: this.mode 
          });
          
          const response = await this.$api.favorites.remove({ 
            id: artworkId, 
            documentId: artworkDocumentId 
          });
          console.log('Remove response:', response);
        }
        
        console.log('Successfully removed from favorites');
        
        if (this.mainStore) {
          this.mainStore.showSuccessMsg("Удалено из избранного");
          this.mainStore.triggerFavoritesUpdate();
        }
        
        // Эмитим событие для обновления родительского компонента
        // Для страницы избранного используем favoriteId, для других - artwork ID
        const emitId = this.mode === 'favorites' ? this.favoriteId : (this.artworkDocumentId || this.documentId);
        console.log('Emitting itemRemoved with ID:', emitId);
        this.$emit("itemRemoved", { type: 'favorites', id: emitId });
      } catch (err) {
        console.error('Error removing from favorites:', err);
        if (this.mainStore) {
          this.mainStore.showErrorMsg("Ошибка при удалении из избранного");
        }
      }
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

    goRoute() {
      try {
        if (this.admin) {
          this.$router.push({ name: "editArt", query: { documentId: this.documentId } });
        } else {
          this.$router.push({ name: "art", query: { documentId: this.documentId } });
        }
      } catch (err) {
        console.log(err);
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
      return null;
    },

    getArtistInitials() {
      if (!this.artist) return 'Х';
      
      if (this.artist.first_name && this.artist.last_name) {
        return `${this.artist.first_name[0]}${this.artist.last_name[0]}`.toUpperCase();
      } else if (this.artist.username) {
        return this.artist.username.substring(0, 2).toUpperCase();
      }
      return 'Х'; // Художник
    },

    goToArtist(event) {
      event.stopPropagation(); // Предотвращаем переход к карточке товара
      if (this.artist?.id) {
        this.$router.push({ name: 'artist', params: { id: this.artist.id } });
      }
    },
  },
  
  mounted() {
    console.log('ProductCard mounted with img_urls:', this.img_urls);
    console.log('Card title:', this.title);
    if (this.img_urls?.length > 1) {
      this.startInterval();
    }
  },

  watch: {
    'img_urls'(newVal) {
      console.log('img_urls changed:', newVal);
    }
  },
  
  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>

<template>
  <div class="card" @click="goRoute()">
    <div 
      class="carousel-container"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="carousel-slide">
        <img 
          :src="img_urls?.length && img_urls[currentIndex]?.url ? `http://localhost:1337${img_urls[currentIndex].url}` : '/logo.png'" 
          alt="Product image"
          class="carousel-image"
        />
        
        <!-- Стрелки навигации -->
        <button 
          v-if="img_urls?.length > 1 && isHovered"
          class="carousel-arrow prev"
          @click.stop="prevSlide"
        >
          &lt;
        </button>
        <button 
          v-if="img_urls?.length > 1 && isHovered"
          class="carousel-arrow next"
          @click.stop="nextSlide"
        >
          &gt;
        </button>
      </div>
      
      <!-- Индикаторы (точки) -->
      <div class="carousel-indicators" v-if="img_urls?.length > 1">
        <span 
          v-for="(img, index) in img_urls" 
          :key="index"
          :class="{ active: currentIndex === index }"
          @click.stop="currentIndex = index"
        ></span>
      </div>
    </div>
    
    <div class="info">
      <span>{{ title }}</span>
      
      <!-- Информация о художнике -->
      <div class="artist-info" v-if="artist && getArtistName()" @click.stop="goToArtist($event)">
        <img 
          v-if="getArtistAvatar()" 
          :src="getArtistAvatar()" 
          :alt="getArtistName()" 
          class="artist-avatar" 
        />
        <div 
          v-else 
          class="artist-avatar avatar-placeholder"
        >
          {{ getArtistInitials() }}
        </div>
        <div class="artist-details">
          <span class="artist-label">Художник:</span>
          <span class="artist-name">{{ getArtistName() }}</span>
        </div>
      </div>
      
      <div class="flex font-medium items-center justify-between mt-4">
        <span class="font-bold">{{ price }} ₽</span>
      </div>
      <div
        class="status"
        v-if="status"
        :class="{
          inStok: getStatusText(status) == 'В наличии',
          nonStok: getStatusText(status) == 'Нет в наличии',
          one: getStatusText(status) == 'Доступно под заказ',
        }"
      >
        {{ getStatusText(status) }}
      </div>
      
      <!-- Кнопки для корзины и избранного -->
      <div class="button-group" v-if="!admin">
        <button class="btn btn-primary" v-if="!cart" @click.stop.prevent="addToCart">
          В корзину
        </button>
        <!-- Кнопка "Убрать из корзины" - показывается только на странице корзины -->
        <button 
          class="btn btn-danger" 
          v-if="mode === 'cart' || (cart && mode === 'catalog')" 
          @click.stop.prevent="deleteElem"
        >
          Убрать из корзины
        </button>
        
        <!-- Кнопка "Убрать из избранного" - показывается только на странице избранного -->
        <button 
          class="btn btn-danger" 
          v-if="mode === 'favorites'" 
          @click.stop.prevent="removeFromFavorites"
        >
          Убрать из избранного
        </button>
        
        <!-- Кнопка избранного - показывается в каталоге и корзине -->
        <button 
          class="btn btn-favorite" 
          :class="{ active: favorite }"
          v-if="mode === 'catalog' || mode === 'cart'"
          @click.stop.prevent="favorite ? removeFromFavorites() : addToFavorites()"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {{ favorite ? 'В избранном' : 'В избранное' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 20%;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(232, 51, 110, 0.1);
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(232, 51, 110, 0.15);
  border-color: rgba(232, 51, 110, 0.3);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::before {
  opacity: 1;
}

.info {
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  gap: 16px;
  flex-grow: 1;
}

.info > span:first-child {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.4;
  margin: 0;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Современные кнопки */
.btn {
  width: 100%;
  padding: 14px 20px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.button-group .btn {
  margin-top: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d12757 0%, #b91c5c 100%);
  transition: left 0.3s ease;
}

.btn-primary:hover::before {
  left: 0;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 51, 110, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.btn-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  transition: left 0.3s ease;
}

.btn-secondary:hover::before {
  left: 0;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.btn-danger::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transition: left 0.3s ease;
}

.btn-danger:hover::before {
  left: 0;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.btn span {
  position: relative;
  z-index: 1;
}

/* Группа кнопок */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

/* Кнопка избранного */
.btn-favorite {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-favorite:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.btn-favorite.active {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #dc2626;
}

.btn-favorite.active svg {
  fill: #dc2626;
}

.btn-favorite.active:hover {
  background: linear-gradient(135deg, #fca5a5 0%, #f87171 100%);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
}

/* Современные статусы */
.status {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.inStok {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border-color: #a7f3d0;
}

.nonStok {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #991b1b;
  border-color: #fca5a5;
}

.one {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
  border-color: #E8336E;
}

/* Современная карусель изображений */
.carousel-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.card:hover .carousel-image {
  transform: scale(1.05);
}

/* Современные кнопки карусели */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 16px; /* Увеличиваем закругление */
  color: #E8336E;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.carousel-arrow:hover {
  background: #E8336E;
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 25px rgba(232, 51, 110, 0.3);
}

.prev {
  left: 12px;
}

.next {
  right: 12px;
}

/* Современные индикаторы */
.carousel-indicators {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 10;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.carousel-indicators span.active {
  background: #E8336E;
  transform: scale(1.3);
  box-shadow: 0 2px 8px rgba(232, 51, 110, 0.4);
}

.carousel-indicators span:hover {
  background: rgba(232, 51, 110, 0.8);
  transform: scale(1.1);
}

/* Информация о художнике */
.artist-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.artist-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  transition: left 0.3s ease;
  z-index: 1;
}

.artist-info:hover::before {
  left: 0;
}

.artist-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 51, 110, 0.2);
  border-color: #E8336E;
}

.artist-info > * {
  position: relative;
  z-index: 2;
}

.artist-info:hover .artist-label,
.artist-info:hover .artist-name {
  color: white;
}

.artist-avatar {
  width: 36px;
  height: 36px;
  border-radius: 16px; /* Увеличиваем закругление */
  object-fit: cover;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #E8336E, #d12757);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.artist-info:hover .artist-avatar {
  border-color: white;
  transform: scale(1.05);
}

.artist-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.artist-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: color 0.3s ease;
}

.artist-name {
  font-size: 14px;
  color: #475569;
  font-weight: 600;
  transition: color 0.3s ease;
  line-height: 1.3;
}

/* Цена и статус */
.flex.font-medium {
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.flex.font-medium span {
  font-size: 24px;
  font-weight: 700;
  color: #E8336E;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Адаптивность */

/* Extra large screens */
@media (min-width: 1400px) {
  .card {
    width: 20%;
    min-width: 340px;
  }
  
  .carousel-container {
    height: 320px;
  }
  
  .info {
    padding: 28px 24px;
    gap: 18px;
  }
  
  .info > span:first-child {
    font-size: 19px;
    line-height: 1.4;
  }
}

/* Large desktops */
@media (max-width: 1200px) {
  .card {
    width: 25%;
    min-width: 300px;
  }
  
  .carousel-container {
    height: 280px;
  }
  
  .info {
    padding: 26px 22px;
    gap: 16px;
  }
  
  .info > span:first-child {
    font-size: 18px;
  }
}

/* Medium desktops */
@media (max-width: 992px) {
  .card {
    width: 33.333%;
    min-width: 280px;
  }
  
  .carousel-container {
    height: 260px;
  }
  
  .info > span:first-child {
    font-size: 17px;
    line-height: 1.3;
  }
  
  .info {
    padding: 24px 20px;
    gap: 15px;
  }
}

/* Tablets */
@media (max-width: 768px) {
  .card {
    width: 50%;
    min-width: 260px;
  }
  
  .carousel-container {
    height: 240px;
  }
  
  .info {
    padding: 22px 18px;
    gap: 14px;
  }
  
  .info > span:first-child {
    font-size: 16px;
    line-height: 1.4;
  }
  
  .flex.font-medium span {
    font-size: 20px;
  }
  
  .rating {
    font-size: 12px;
  }
  
  .add-to-cart {
    width: 40px;
    height: 40px;
  }
  
  .add-to-cart svg {
    width: 18px;
    height: 18px;
  }
}

/* Small tablets and large phones */
@media (max-width: 640px) {
  .card {
    width: 100%;
    min-width: 280px;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .carousel-container {
    height: 280px;
  }
  
  .info {
    padding: 24px 20px;
    gap: 16px;
  }
  
  .info > span:first-child {
    font-size: 17px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .flex.font-medium span {
    font-size: 22px;
  }
  
  .rating {
    font-size: 12px;
  }
  
  .add-to-cart {
    width: 42px;
    height: 42px;
  }
  
  .add-to-cart svg {
    width: 18px;
    height: 18px;
  }
}

/* Phones */
@media (max-width: 480px) {
  .card {
    width: 100%;
    min-width: unset;
    margin: 0 auto;
    max-width: 360px;
  }
  
  .carousel-container {
    height: 260px;
  }
  
  .info {
    padding: 20px 18px;
    gap: 14px;
  }
  
  .info > span:first-child {
    font-size: 16px;
    line-height: 1.4;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  
  .flex.font-medium {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  
  .flex.font-medium span {
    font-size: 20px;
  }
  
  .rating {
    font-size: 11px;
  }
  
  .add-to-cart {
    width: 40px;
    height: 40px;
    position: static;
    margin-top: 0;
  }
  
  .add-to-cart svg {
    width: 16px;
    height: 16px;
  }
  
  .button-container {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 12px;
  }
}

/* Small phones */
@media (max-width: 375px) {
  .card {
    margin: 0 auto;
    max-width: 320px;
  }
  
  .carousel-container {
    height: 240px;
  }
  
  .info {
    padding: 18px 16px;
    gap: 12px;
  }
  
  .info > span:first-child {
    font-size: 15px;
  }
  
  .flex.font-medium span {
    font-size: 18px;
  }
  
  .add-to-cart {
    width: 38px;
    height: 38px;
  }
  
  .add-to-cart svg {
    width: 15px;
    height: 15px;
  }
}

/* Grid layout adjustments */
@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 20px;
    justify-items: center;
  }
}

@media (max-width: 640px) and (min-width: 481px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 0 16px;
    justify-items: center;
  }
}

@media (max-width: 768px) and (min-width: 641px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 20px;
  }
}

@media (max-width: 992px) and (min-width: 769px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 0 24px;
  }
}

/* Landscape orientation for phones */
@media (max-height: 500px) and (orientation: landscape) {
  .card {
    width: 33.333%;
    min-width: 240px;
    max-width: 300px;
  }
  
  .carousel-container {
    height: 160px;
  }
  
  .info {
    padding: 16px 14px;
    gap: 8px;
  }
  
  .info > span:first-child {
    font-size: 14px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  
  .flex.font-medium span {
    font-size: 16px;
  }
}
</style>