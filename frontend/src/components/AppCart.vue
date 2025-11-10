<script>
import AppLoader from "./AppLoader.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";
import { useMainStore } from '../stores/main.js';

export default {
  name: "AppCart",
  components: { AppLoader, ProductCard, AppEmpty },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      cart_id: "",
      id: "",
      cards: [],
      message: "",
      isLoading: false,
    };
  },
  computed: {
    validCards() {
      return this.cards.filter(card => card && card.title);
    },
    totalAmount() {
      return this.validCards.reduce((total, item) => {
        return total + (parseFloat(item.price) || 0);
      }, 0);
    }
  },
  methods: {
    async load_info() {
      try {
        this.cart_id = localStorage.getItem("cart_id");
        this.id = localStorage.getItem("id");
        this.isLoading = true;
        
        if (!this.$api || !this.$api.cart) {
          console.error('API not initialized');
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Ошибка инициализации API');
          }
          this.cards = [];
          return;
        }
        
        let response = await this.$api.cart.getAll();
        console.log("Cart API Response:", response);
        console.log("Cart data array:", response.data?.data);
        console.log("Cart data length:", response.data?.data?.length);
        
        const rawItems = response.data?.data || [];
        console.log("Raw items before normalization:", rawItems);
        
        // Найдем элементы без artwork для удаления
        const itemsWithoutArtwork = rawItems.filter(item => {
          // В Strapi 5 artwork напрямую в item
          const hasArtwork = item?.artwork;
          return !hasArtwork;
        });
        
        // Найдем дубликаты (несколько записей с одним и тем же artwork.id)
        const artworkMap = new Map();
        const duplicates = [];
        
        rawItems.forEach(item => {
          if (item?.artwork?.id) {
            const artworkId = item.artwork.id;
            if (artworkMap.has(artworkId)) {
              // Это дубликат - добавляем в список на удаление
              duplicates.push(item);
            } else {
              // Первая запись с этим artwork - сохраняем
              artworkMap.set(artworkId, item);
            }
          }
        });
        
        const itemsToRemove = [...itemsWithoutArtwork, ...duplicates];
        
        if (itemsToRemove.length > 0) {
          console.log(`Found ${itemsWithoutArtwork.length} items without artwork and ${duplicates.length} duplicates, cleaning up...`);
          // Удаляем битые элементы и дубликаты
          for (const item of itemsToRemove) {
            try {
              await this.$api.cart.remove(item.id);
              console.log(`Removed cart item ID: ${item.id}`);
            } catch (err) {
              console.error(`Failed to remove cart item ${item.id}:`, err);
            }
          }
          // Перезагружаем данные после очистки
          response = await this.$api.cart.getAll();
          this.cards = this.normalizeCartItems(response.data?.data || []);
          
          // Триггерим обновление счетчика в хедере
          this.mainStore.triggerCartUpdate();
        } else {
          this.cards = this.normalizeCartItems(rawItems);
        }
        
        console.log("Normalized cards:", this.cards);
        console.log("Cards length:", this.cards.length);
      } catch (err) {
        console.error("Error loading cart:", err);
        if (this.mainStore) {
          this.mainStore.showErrorMsg('Ошибка загрузки корзины');
        }
        this.cards = [];
      } finally {
        this.isLoading = false;
      }
    },

    // Обработчик удаления элемента без перезагрузки всего списка
    handleItemRemoved(itemData) {
      if (itemData.type === 'cart') {
        // Удаляем элемент из локального массива
        this.cards = this.cards.filter(item => item.documentId !== itemData.id);
        
        // Триггерим обновление счетчика в хедере
        if (this.mainStore) {
          this.mainStore.triggerCartUpdate();
        }
      }
    },

    normalizeCartItems(items) {
      console.log("Starting normalization, items count:", items.length);
      
      const normalized = items
        .map((item, index) => {
          console.log(`Processing item ${index}:`, item);
          
          // В Strapi 5 структура плоская - artwork напрямую в item, не в attributes
          let artworkData = item?.artwork;
          
          console.log(`Item ${index} artworkData:`, artworkData);
          
          if (!artworkData) {
            console.warn(`Item ${index} SKIPPED - no artworkData, cart item ID:`, item.id);
            return null;
          }

          // Проверяем что у artwork есть хотя бы id или documentId
          const artworkId = artworkData.id;
          const artworkDocId = artworkData.documentId || artworkId;
          
          if (!artworkId && !artworkDocId) {
            console.warn(`Item ${index} SKIPPED - artwork has no ID`);
            return null;
          }

          // images тоже напрямую в artwork
          const images = artworkData.images?.map(image => ({
            id: image.id,
            url: image.url || "",
            alternativeText: image.alternativeText || artworkData.title || "",
          })) || [];

          // artist тоже напрямую
          const artistData = artworkData.artist;

          const artist = artistData
            ? {
                id: artistData.id,
                documentId: artistData.documentId || artistData.id,
                first_name: artistData.first_name,
                last_name: artistData.last_name,
                username: artistData.username,
                avatar: artistData.avatar?.url
                  ? {
                      url: artistData.avatar.url,
                      alternativeText: artistData.avatar.alternativeText || artistData.username || "",
                    }
                  : null,
              }
            : null;

          const normalizedItem = {
            id: item.id,
            documentId: artworkDocId,
            title: artworkData.title || "Без названия",
            price: artworkData.price ?? 0,
            description: artworkData.description || "",
            status: artworkData.status_art || "",
            size: artworkData.size || "",
            quantity: item.quantity ?? 1,
            img_urls: images,
            artist,
            cart: true,
            cartItemId: item.id, // ID самой записи корзины для удаления
          };
          
          console.log(`Item ${index} normalized successfully:`, normalizedItem);
          return normalizedItem;
        })
        .filter(item => {
          if (!item) {
            console.log("Filtered out null item");
            return false;
          }
          return true;
        });
      
      console.log(`Normalization complete: ${normalized.length} of ${items.length} items`);
      return normalized;
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1 class="text-center text-2xl">Корзина</h1>
    <div class="cards" v-if="cards.length > 0">
      <ProductCard
        class="card"
        v-for="card in cards"
        :key="card.id"
        :id="card.id"
        :document-id="card.documentId"
        :title="card.title"
        :price="card.price"
        :img_urls="card.img_urls"
        :description="card.description"
        :cart="true"
        :artist="card.artist"
        :mode="'cart'"
        @itemRemoved="handleItemRemoved"
      />
    </div>
    <AppEmpty 
      v-else
      title="Корзина пуста"
      description="Вы пока не добавили ни одной картины в корзину. Посмотрите наш каталог!"
      icon="cart"
      :show-button="true"
      button-text="Перейти к каталогу"
      button-route="/arts"
    />
    <!-- Секция оформления заказа -->
    <div class="cart-actions" v-if="validCards.length > 0">
      <div class="total-section">
        <h3>Итого: {{ totalAmount.toFixed(2) }} ₽</h3>
        <p>Товаров: {{ validCards.length }}</p>
      </div>
      <router-link to="/checkout" class="checkout-btn">
        Оформить заказ
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  padding: 20px;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}
.cards {
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 auto;
  padding: 0 60px;
}

.card {
  width: 24%;
}

.wrap-btn {
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  background-color: #E8336E;
  cursor: pointer;
  outline: none;
}

@media (max-width: 1060px) {
  .cards {
    flex-wrap: wrap;
  }
}

@media (max-width: 812px) {
  .cards {
    justify-content: center;
    padding: 0 30px;
  }

  .card {
    flex: 0 0 calc(50% - 10px);
    width: calc(50% - 10px);
    max-width: calc(50% - 10px);
  }
}

@media (max-width: 560px) {
  .cards {
    padding: 0 20px;
  }
  
  .card {
    flex: 0 0 100%;
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 430px) {
  .cards {
    padding: 0 15px;
  }
  
  .card {
    flex: 0 0 100%;
    width: 100%;
    max-width: 100%;
  }
}

.cart-actions {
  margin-top: 30px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.total-section {
  margin-bottom: 20px;
  text-align: center;
}

.total-section h3 {
  color: #E8336E;
  font-size: 28px;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.total-section p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #E8336E, #d12757);
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: block;
  text-align: center;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(232, 51, 110, 0.35);
  background: linear-gradient(135deg, #d12757, #b91f47);
}
</style>
