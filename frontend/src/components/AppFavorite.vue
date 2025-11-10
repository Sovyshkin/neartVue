<script>
import AppLoader from "./AppLoader.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";
import { useMainStore } from '../stores/main.js';

export default {
  name: "AppFavorite",
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
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.cart_id = localStorage.getItem("cart_id");
        this.id = localStorage.getItem("id");
        
        if (!this.$api || !this.$api.favorites) {
          console.error('API not initialized');
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Ошибка инициализации API');
          }
          this.cards = [];
          return;
        }
        
        let response = await this.$api.favorites.getAll();
        console.log("Favorites API Response:", response);
        console.log("Favorites API Response Data:", response.data);
        
        const rawItems = response.data?.data || [];
        console.log("Raw favorites items:", rawItems);
        console.log("Raw favorites items detailed:", rawItems.map(item => ({
          id: item.id,
          documentId: item.documentId,
          artwork: item.artwork ? { id: item.artwork.id, documentId: item.artwork.documentId } : null
        })));
        
        // Найдем элементы без artwork для удаления (Strapi 5 структура)
        const itemsWithoutArtwork = rawItems.filter(item => {
          const artworkData = item?.artwork;
          return !artworkData;
        });
        
        // Найдем дубликаты (несколько записей с одним и тем же artwork.id)
        const artworkMap = new Map();
        const duplicates = [];
        
        rawItems.forEach(item => {
          const artworkData = item?.artwork;
          if (artworkData?.id) {
            const artworkId = artworkData.id;
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
          console.log(`Found ${itemsWithoutArtwork.length} items without artwork and ${duplicates.length} duplicates in favorites, cleaning up...`);
          // Удаляем битые элементы и дубликаты
          for (const item of itemsToRemove) {
            try {
              // Strapi 5 flat structure
              const artworkData = item?.artwork;
              const artworkId = artworkData?.id;
              const artworkDocId = artworkData?.documentId || artworkId;
              
              if (artworkId || artworkDocId) {
                await this.$api.favorites.remove({ id: artworkId, documentId: artworkDocId });
                console.log(`Removed favorite item ID: ${item.id}`);
              } else {
                // Если нет artwork данных, удаляем элемент избранного напрямую по его ID
                await this.$api.favorites.removeById(item.id);
                console.log(`Removed orphaned favorite item ID: ${item.id}`);
              }
            } catch (err) {
              console.error(`Failed to remove favorite item ${item.id}:`, err);
            }
          }
          // Перезагружаем данные после очистки
          response = await this.$api.favorites.getAll();
          this.cards = this.normalizeFavoriteItems(response.data?.data || []);
          
          // Триггерим обновление счетчика в хедере
          if (this.mainStore) {
            this.mainStore.triggerFavoritesUpdate();
          }
        } else {
          this.cards = this.normalizeFavoriteItems(rawItems);
        }
        
        console.log("Normalized favorite cards:", this.cards);
      } catch (err) {
        console.error('Error loading favorites:', err);
        if (this.mainStore) {
          this.mainStore.showErrorMsg('Ошибка загрузки избранного');
        }
        this.cards = [];
      } finally {
        this.isLoading = false;
      }
    },

    // Обработчик удаления элемента без перезагрузки всего списка
    handleItemRemoved(itemData) {
      console.log('AppFavorite handleItemRemoved called with:', itemData);
      console.log('Current cards before filtering:', this.cards.map(c => ({ id: c.id, favoriteId: c.favoriteId })));
      
      if (itemData.type === 'favorites') {
        // Удаляем элемент из локального массива по favoriteId (ID записи избранного)
        const cardsBefore = this.cards.length;
        this.cards = this.cards.filter(item => 
          item.favoriteId !== itemData.id && item.id !== itemData.id
        );
        const cardsAfter = this.cards.length;
        
        console.log(`Filtered cards: ${cardsBefore} -> ${cardsAfter}`);
        console.log('Remaining cards:', this.cards.map(c => ({ id: c.id, favoriteId: c.favoriteId })));
        
        // Триггерим обновление счетчика в хедере
        if (this.mainStore) {
          this.mainStore.triggerFavoritesUpdate();
        }
      }
    },

    normalizeFavoriteItems(items) {
      console.log('Normalizing favorite items:', items);
      return items
        .map(item => {
          // Strapi 5 плоская структура
          const artworkData = item?.artwork;

          if (!artworkData) {
            console.warn('Favorite item without artwork:', item);
            return null;
          }

          console.log('Processing favorite item:', {
            favoriteId: item.id,
            favoriteDocumentId: item.documentId,
            artworkId: artworkData.id,
            artworkDocumentId: artworkData.documentId
          });

          const images = artworkData.images?.map(image => ({
            id: image.id,
            url: image.url || "",
            alternativeText: image.alternativeText || artworkData.title || "",
          })) || [];

          const artistData = artworkData.artist;

          const artist = artistData
            ? {
                id: artistData.id,
                documentId: artistData.documentId || artistData.id,
                first_name: artistData.first_name,
                last_name: artistData.last_name,
                username: artistData.username,
                avatar: artistData.avatar
                  ? {
                      url: artistData.avatar.url || "",
                      alternativeText: artistData.avatar.alternativeText || artistData.username || "",
                    }
                  : null,
              }
            : null;

          return {
            id: item.id, // ID записи избранного
            documentId: item.documentId || item.id, // DocumentID записи избранного
            favoriteId: item.id, // ID записи избранного для удаления
            artworkId: artworkData.id, // ID произведения искусства
            artworkDocumentId: artworkData.documentId || artworkData.id, // DocumentID произведения искусства
            title: artworkData.title || "Без названия",
            price: artworkData.price ?? 0,
            description: artworkData.description || "",
            status: artworkData.status || "",
            size: artworkData.size || "",
            img_urls: images,
            artist,
            cart: false,
          };
        })
        .filter(Boolean);
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
    <h1 class="text-center text-2xl">Избранное</h1>
    <div class="cards" v-if="cards.length > 0">
      <ProductCard
        class="card"
        v-for="card in cards"
        :key="card.id"
        :id="card.id"
        :document-id="card.documentId"
        :artwork-id="card.artworkId"
        :artwork-document-id="card.artworkDocumentId"
        :favorite-id="card.favoriteId"
        :title="card.title"
        :price="card.price"
        :img_urls="card.img_urls"
        :description="card.description"
        :cart="card.cart"
        :favorite="true"
        :artist="card.artist"
        :mode="'favorites'"
        @itemRemoved="handleItemRemoved"
      />
    </div>
    <AppEmpty 
      v-else
      title="Избранное пусто"
      description="Вы пока не добавили ни одной картины в избранное. Найдите картину по душе в каталоге!"
      icon="empty"
      :show-button="true"
      button-text="Посмотреть каталог"
      button-route="/arts"
    />
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

@media (max-width: 1060px) {
  .cards {
    flex-wrap: wrap;
  }
}

@media (max-width: 812px) {
  .cards {
    justify-content: center;
  }

  .card {
    flex: 50%;
    width: auto;
    max-width: 45%;
  }
}

@media (max-width: 560px) {
  .card {
    flex: 100%;
    max-width: 80%;
  }
}

@media (max-width: 430px) {
  .card {
    max-width: 100%;
  }
}
</style>
