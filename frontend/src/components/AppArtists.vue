<script>
import AppLoader from "./AppLoader.vue";
import AppEmpty from "./AppEmpty.vue";
import { useMainStore } from '../stores/main.js';

export default {
  name: "AppArtists",
  components: { AppLoader, AppEmpty },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      artists: [],
      isLoading: false,
    };
  },
  methods: {
    async loadArtists() {
      try {
        this.isLoading = true;
        let response = await this.$api.users.getArtists();
        
        if (response.data && response.data.data) {
          this.artists = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          this.artists = response.data;
        } else {
          this.artists = [];
        }
      } catch (err) {
        console.log("Error loading artists:", err);
        this.mainStore.showErrorMsg('Ошибка загрузки художников');
      } finally {
        this.isLoading = false;
      }
    },

    getArtistAvatar(artist) {
      if (artist.avatar?.url) {
        return `http://localhost:1337${artist.avatar.url}`;
      }
      // Возвращаем null для создания красивой заглушки
      return null;
    },

    getArtistName(artist) {
      if (artist.first_name && artist.last_name) {
        return `${artist.first_name} ${artist.last_name}`;
      }
      return artist.username || 'Художник';
    },

    getArtistInitials(artist) {
      if (artist.first_name && artist.last_name) {
        return `${artist.first_name[0]}${artist.last_name[0]}`.toUpperCase();
      } else if (artist.username) {
        return artist.username.substring(0, 2).toUpperCase();
      }
      return 'Х'; // Художник
    },

    getArtworkCount(artist) {
      return artist.artworks?.length || 0;
    },

    goToArtist(artistId) {
      this.$router.push({ name: 'artist', params: { id: artistId } });
    }
  },
  async mounted() {
    await this.loadArtists();
  },
};
</script>

<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <div class="header">
      <h1 class="page-title">Наши художники</h1>
      <p class="page-subtitle">Познакомьтесь с талантливыми творцами нашей галереи</p>
    </div>

    <div class="artists-grid" v-if="artists.length > 0">
      <div 
        class="artist-card" 
        v-for="artist in artists" 
        :key="artist.id"
        @click="goToArtist(artist.id)"
      >
        <div class="artist-avatar">
          <img 
            v-if="getArtistAvatar(artist)" 
            :src="getArtistAvatar(artist)" 
            :alt="getArtistName(artist)" 
          />
          <div 
            v-else 
            class="avatar-placeholder"
          >
            {{ getArtistInitials(artist) }}
          </div>
          <div class="avatar-overlay">
            <span class="view-profile">Смотреть профиль</span>
          </div>
        </div>
        
        <div class="artist-info">
          <h3 class="artist-name">{{ getArtistName(artist) }}</h3>
          <p class="artist-description" v-if="artist.artistDescription">
            {{ artist.artistDescription.substring(0, 100) }}{{ artist.artistDescription.length > 100 ? '...' : '' }}
          </p>
          <div class="artist-stats">
            <div class="stat">
              <span class="stat-number">{{ getArtworkCount(artist) }}</span>
              <span class="stat-label">работ</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppEmpty 
      v-else
      title="Художники не найдены"
      description="В нашей галерее пока нет зарегистрированных художников. Следите за обновлениями!"
      icon="🎨"
      :showButton="true"
      buttonText="К картинам"
      buttonRoute="/arts"
    />
  </div>
</template>

<style scoped>
.wrapper {
  margin-top: 40px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 80vh;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: #000;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 18px;
  color: #a5a5a5;
  font-weight: 400;
  width: 100%;
  margin: 0 auto;
  line-height: 1.6;
}

.artists-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 60px;
}

.artist-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.artist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.artist-avatar {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.artist-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E8336E, #d12757);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.artist-card:hover .avatar-placeholder {
  transform: scale(1.05);
}

.artist-card:hover .artist-avatar img {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artist-card:hover .avatar-overlay {
  opacity: 1;
}

.view-profile {
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
}

.artist-info {
  padding: 20px;
}

.artist-name {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
}

.artist-description {
  color: #a5a5a5;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  min-height: 42px;
}

.artist-stats {
  display: flex;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  background-color: #E8336E;
  border-radius: 16px; /* Увеличиваем закругление */
  min-width: 60px;
}

.stat-number {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .wrapper {
    padding: 20px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
  }
  
  .artist-avatar {
    height: 180px;
  }
  
  .artist-info {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .wrapper {
    padding: 15px;
  }
  
  .artists-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .artist-avatar {
    height: 160px;
  }
}
</style>