<script>
import AppLoader from "./AppLoader.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";

export default {
  name: "ArtistProfile",
  components: { AppLoader, ProductCard, AppEmpty },
  data() {
    return {
      artist: {},
      artworks: [],
      isLoading: false,
      artistId: null,
    };
  },
  methods: {
    async loadArtist() {
      try {
        this.isLoading = true;
        this.artistId = this.$route.params.id;
        
        // Загружаем данные художника с его работами
        let response = await this.$api.users.getOne(this.artistId);
        console.log("Artist response:", response);
        
        this.artist = response.data || {};
        this.artworks = this.artist.artworks || [];
        
      } catch (err) {
        console.log("Error loading artist:", err);
        // Если художник не найден, редиректим на страницу художников
        this.$router.push({ name: 'artists' });
      } finally {
        this.isLoading = false;
      }
    },

    getArtistAvatar() {
      if (this.artist.avatar?.url) {
        return `http://localhost:1337${this.artist.avatar.url}`;
      }
      return null;
    },

    getArtistInitials() {
      if (this.artist.first_name && this.artist.last_name) {
        return `${this.artist.first_name[0]}${this.artist.last_name[0]}`.toUpperCase();
      } else if (this.artist.username) {
        return this.artist.username.substring(0, 2).toUpperCase();
      }
      return 'Х'; // Художник
    },

    getArtistName() {
      if (this.artist.first_name && this.artist.last_name) {
        return `${this.artist.first_name} ${this.artist.last_name}`;
      }
      return this.artist.username || 'Художник';
    },

    goBack() {
      this.$router.push({ name: 'artists' });
    },

    goToArtwork(artworkId) {
      this.$router.push({ name: 'art', query: { id: artworkId } });
    }
  },
  async mounted() {
    await this.loadArtist();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        if (this.$route.params.id !== this.artistId) {
          this.loadArtist();
        }
      }
    }
  }
};
</script>

<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <!-- Шапка профиля -->
    <div class="artist-header">
      <button class="back-button" @click="goBack">
        <img src="../assets/arrow-left.png" alt="Назад" />
        <span>К художникам</span>
      </button>
      
      <div class="artist-banner">
        <div class="artist-avatar-section">
          <div class="avatar-container">
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
            <div class="avatar-badge">
              <span>🎨</span>
            </div>
          </div>
        </div>
        
        <div class="artist-details">
          <h1 class="artist-name">{{ getArtistName() }}</h1>
          <p class="artist-username" v-if="artist.username">@{{ artist.username }}</p>
          
          <div class="artist-stats">
            <div class="stat-item">
              <span class="stat-number">{{ artworks.length }}</span>
              <span class="stat-label">работ</span>
            </div>
          </div>
          
          <div class="artist-description" v-if="artist.artistDescription">
            <p>{{ artist.artistDescription }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Работы художника -->
    <div class="artworks-section">
      <h2 class="section-title">Работы художника</h2>
      
      <div class="artworks-grid" v-if="artworks.length > 0">
        <ProductCard
          v-for="artwork in artworks"
          :key="artwork.id"
          :id="artwork.id"
          :title="artwork.title"
          :price="artwork.price"
          :img_urls="artwork.images"
          :description="artwork.description"
          :status="artwork.status"
          @click="goToArtwork(artwork.id)"
        />
      </div>
      
      <AppEmpty 
        v-else
        title="Работы не найдены"
        description="У этого художника пока нет опубликованных работ"
        icon="🖼️"
        :showButton="true"
        buttonText="Смотреть всех художников"
        buttonRoute="/artists"
      />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  margin-top: 40px;
  min-height: 100vh;
}

.artist-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 40px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #E8336E;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #cf0032;
}

.back-button img {
  width: 20px;
  height: 20px;
}

.artist-banner {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 0 40px 40px;
}

.artist-avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
}

.artist-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  background: linear-gradient(135deg, #E8336E, #d12757);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  background-color: #E8336E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.artist-details {
  flex: 1;
}

.artist-name {
  font-size: 36px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
}

.artist-username {
  font-size: 16px;
  color: #a5a5a5;
  margin-bottom: 20px;
}

.artist-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  background-color: #E8336E;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(232, 51, 110, 0.3);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
}

.artist-description {
  width: 100%;
}

.artist-description p {
  font-size: 16px;
  line-height: 1.6;
  color: #000;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #E8336E;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.artworks-section {
  padding: 40px 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  text-align: center;
  margin-bottom: 30px;
}

.artworks-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 60px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .artist-banner {
    flex-direction: column;
    text-align: center;
    gap: 25px;
    padding: 0 20px 30px;
  }
  
  .back-button {
    padding: 15px 20px;
  }
  
  .avatar-container {
    width: 120px;
    height: 120px;
  }
  
  .artist-name {
    font-size: 28px;
  }
  
  .artworks-section {
    padding: 30px 20px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .artist-banner {
    padding: 0 15px 20px;
  }
  
  .artist-name {
    font-size: 24px;
  }
  
  .artist-stats {
    justify-content: center;
  }
  
  .artworks-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style>