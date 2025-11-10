<script>
import AppLoader from "./AppLoader.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";
import { useMainStore } from '../stores/main.js';

export default {
  name: "AppArts",
  components: { AppLoader, ProductCard, AppEmpty },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      isLoading: false,
      cards: [],
      cartItems: [],
      favoriteItems: [],
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        
        if (!this.$api || !this.$api.artworks) {
          console.error('API not initialized');
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Ошибка инициализации API');
          }
          return;
        }
        
        let response = await this.$api.artworks.getAll();
        console.log('Artworks response:', response);
        console.log('Artworks data:', response.data.data);
        this.cards = response.data.data || [];
        
        // Загружаем корзину и избранное, если пользователь авторизован
        if (localStorage.getItem('id')) {
          await this.loadCartAndFavorites();
        }
      } catch (err) {
        console.error('Error loading artworks:', err);
        if (this.mainStore) {
          this.mainStore.showErrorMsg('Ошибка загрузки картин');
        }
        // Устанавливаем пустой массив, чтобы показать сообщение "нет картин"
        this.cards = [];
      } finally {
        this.isLoading = false;
      }
    },

    async loadCartAndFavorites() {
      try {
        // Загружаем корзину
        const cartResponse = await this.$api.cart.getAll();
        this.cartItems = cartResponse.data?.data?.map(item => item.artwork?.id).filter(Boolean) || [];
        
        // Загружаем избранное (Strapi 5 структура)
        const favResponse = await this.$api.favorites.getAll();
        this.favoriteItems = favResponse.data?.data?.map(item => {
          const artworkData = item?.artwork;
          return artworkData?.id;
        }).filter(Boolean) || [];
        
        console.log('Cart items:', this.cartItems);
        console.log('Favorite items:', this.favoriteItems);
      } catch (err) {
        console.log('Error loading cart/favorites:', err);
      }
    },

    isInCart(artworkId) {
      return this.cartItems.includes(artworkId);
    },

    isInFavorites(artworkId) {
      return this.favoriteItems.includes(artworkId);
    },

    handleItemAdded(itemData) {
      if (itemData.type === 'cart') {
        // Находим artwork id по documentId
        const artwork = this.cards.find(c => c.documentId === itemData.id);
        if (artwork && !this.cartItems.includes(artwork.id)) {
          this.cartItems.push(artwork.id);
        }
      } else if (itemData.type === 'favorites') {
        const artwork = this.cards.find(c => c.documentId === itemData.id);
        if (artwork && !this.favoriteItems.includes(artwork.id)) {
          this.favoriteItems.push(artwork.id);
        }
      }
    },

    handleItemRemoved(itemData) {
      if (itemData.type === 'cart') {
        const artwork = this.cards.find(c => c.documentId === itemData.id);
        if (artwork) {
          this.cartItems = this.cartItems.filter(id => id !== artwork.id);
        }
      } else if (itemData.type === 'favorites') {
        const artwork = this.cards.find(c => c.documentId === itemData.id);
        if (artwork) {
          this.favoriteItems = this.favoriteItems.filter(id => id !== artwork.id);
        }
      }
    },
  },
  mounted() {
    // document.body.style.overflow = "auto";
    this.load_info();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h2>Картины</h2>
    <div v-if="cards.length > 0" class="cards">
      <ProductCard
        class="card"
        v-for="card in cards"
        :key="card.id"
        :id="card.id"
        :documentId="card.documentId"
        :title="card.title"
        :price="card.price"
        :img_urls="card.images"
        :description="card.description"
        :status="card.status"
        :size="card.size"
        :cart="isInCart(card.id)"
        :favorite="isInFavorites(card.id)"
        :artist="card.artist"
        @itemAdded="handleItemAdded"
        @itemRemoved="handleItemRemoved"
      />
    </div>
    <AppEmpty 
      v-else
      title="Картины не найдены"
      description="В данный момент в каталоге нет доступных картин. Попробуйте вернуться позже."
      icon="search"
    />
  </div>
</template>
<style scoped>
.wrapper {
  margin-top: 40px;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 70vh;
}
.cards {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
  margin: 0 auto;
  padding: 0 60px;
  justify-items: center;
}

@media (max-width: 1200px) {
  .cards {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
    padding: 0 40px;
  }
}

@media (max-width: 992px) {
  .cards {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    padding: 0 32px;
  }
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 24px;
  }
}

@media (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 20px;
  }
}

@media (max-width: 480px) {
  .cards {
    padding: 0 16px;
    gap: 18px;
  }
}
</style>
