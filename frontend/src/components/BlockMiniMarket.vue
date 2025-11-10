<script>
import ProductCard from "./ProductCard.vue";

export default {
  name: "MiniMarket",
  components: {
    ProductCard,
  },
  data() {
    return {
      cards: [],
      isLoading: true,
      visibleCards: []
    };
  },
  methods: {
    open(id) {
      this.$router.push({ name: "product", query: { id: id } });
    },

    async load_info() {
      try {
        this.isLoading = true;
        let response = await this.$api.artworks.getForHomepage();
        console.log('BlockMiniMarket response:', response);
        console.log('BlockMiniMarket data:', response.data.data);
        
        // Если нет картин, отмеченных для главной страницы, берем первые 4 из всех
        if (response.data.data.length === 0) {
          console.log('No artworks marked for homepage, getting first 4 from all');
          response = await this.$api.artworks.getAll();
          this.cards = response.data.data.slice(0, 4);
        } else {
          this.cards = response.data.data;
        }
        
        if (this.cards.length > 0) {
          console.log('First card structure:', this.cards[0]);
          console.log('First card images:', this.cards[0].images);
        }
        
        // Анимация появления карточек
        setTimeout(() => {
          this.animateCards();
        }, 100);
        
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    animateCards() {
      this.cards.forEach((_, index) => {
        setTimeout(() => {
          this.visibleCards.push(index);
        }, index * 150);
      });
    },

    viewAllArtworks() {
      this.$router.push({ name: 'arts' });
    }
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.load_info();
  },
};
</script>

<template>
  <section class="market-section">
    <div class="container">
      <!-- Заголовок секции -->
      <div class="section-header">
        <div class="header-content">
          <h2 class="section-title">
            Популярные <span class="title-accent">произведения</span>
          </h2>
          <p class="section-subtitle">
            Откройте для себя самые востребованные работы нашей коллекции
          </p>
        </div>
        <button class="view-all-btn" @click="viewAllArtworks">
          <span>Смотреть все</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Загрузка -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-grid">
          <div v-for="n in 6" :key="n" class="loading-card">
            <div class="loading-image"></div>
            <div class="loading-content">
              <div class="loading-title"></div>
              <div class="loading-price"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Сетка произведений -->
      <div v-else class="artworks-grid">
        <div 
          v-for="(card, index) in cards" 
          :key="card.id"
          class="artwork-wrapper"
          :class="{ 'card-visible': visibleCards.includes(index) }"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <ProductCard
            :id="card.id"
            :documentId="card.documentId"
            :title="card.title"
            :price="card.price"
            :img_urls="card.images"
            :description="card.description"
            :status="card.status"
            :size="card.size"
            :cart="card.cart"
            :favorite="card.favorite"
            :artist="card.artist"
          />
        </div>
      </div>

      <!-- Призыв к действию -->
      <div class="cta-section">
        <div class="cta-content">
          <h3 class="cta-title">Не нашли то, что искали?</h3>
          <p class="cta-description">
            Исследуйте нашу полную коллекцию из более чем 1000 уникальных произведений
          </p>
          <button class="cta-button" @click="viewAllArtworks">
            <span>Посмотреть все произведения</span>
            <div class="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* Современная секция маркета */
.market-section {
  width: 100%;
  padding: 120px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
}

.market-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(232, 51, 110, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(232, 51, 110, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 60px;
  position: relative;
  z-index: 10;
}

/* Заголовок секции */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  gap: 40px;
}

.header-content {
  flex: 1;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.title-accent {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  width: 100%;
}

.view-all-btn {
  background: rgba(232, 51, 110, 0.1);
  border: 2px solid #E8336E;
  border-radius: 16px;
  padding: 12px 24px;
  color: #E8336E;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.view-all-btn:hover {
  background: #E8336E;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 51, 110, 0.3);
}

.view-all-btn svg {
  transition: transform 0.3s ease;
}

.view-all-btn:hover svg {
  transform: translateX(4px);
}

/* Состояние загрузки */
.loading-state {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.loading-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-image {
  width: 100%;
  height: 250px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.loading-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-title {
  height: 24px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  border-radius: 16px; /* Увеличиваем закругление */
  animation: shimmer 1.5s ease-in-out infinite;
}

.loading-price {
  height: 20px;
  width: 60%;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  border-radius: 16px; /* Увеличиваем закругление */
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Сетка произведений */
.artworks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
}

.artwork-wrapper {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease;
  transition-delay: var(--delay);
}

.card-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Призыв к действию */
.cta-section {
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 24px;
  padding: 60px 40px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(232, 51, 110, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(232, 51, 110, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.cta-content {
  position: relative;
  z-index: 10;
  width: 100%;
  margin: 0 auto;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.cta-description {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.cta-button {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border: none;
  border-radius: 20px;
  padding: 18px 36px;
  color: white;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(232, 51, 110, 0.3);
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d12757 0%, #b91c5c 100%);
  transition: left 0.4s ease;
}

.cta-button:hover::before {
  left: 0;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(232, 51, 110, 0.4);
}

.cta-button span,
.button-icon {
  position: relative;
  z-index: 1;
}

.button-icon {
  transition: transform 0.3s ease;
}

.cta-button:hover .button-icon {
  transform: translateX(4px);
}

/* Анимации */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Адаптивность */

/* Large desktop (1440px and up) */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
    padding: 0 80px;
  }
  
  .market-section {
    padding: 140px 0;
  }
  
  .section-header {
    margin-bottom: 80px;
  }
  
  .section-title {
    font-size: 4rem;
  }
  
  .section-subtitle {
    font-size: 1.375rem;
    max-width: 600px;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-bottom: 100px;
  }
  
  .cta-section {
    padding: 60px;
    margin-top: 40px;
  }
  
  .cta-title {
    font-size: 2.5rem;
  }
  
  .cta-description {
    font-size: 1.25rem;
    max-width: 700px;
  }
}

/* Extra large desktop (1920px and up) */
@media (min-width: 1920px) {
  .container {
    max-width: 1800px;
    padding: 0 100px;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 50px;
  }
  
  .section-title {
    font-size: 4.5rem;
  }
  
  .section-subtitle {
    font-size: 1.5rem;
    max-width: 800px;
  }
}

/* Desktop (1024px to 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .container {
    padding: 0 60px;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 32px;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 24px;
    align-items: center;
  }
  
  .header-content {
    text-align: center;
  }
}

/* Tablet */
@media (max-width: 1023px) {
  .market-section {
    padding: 80px 0;
  }
  
  .container {
    padding: 0 40px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 40px;
  }
  
  .view-all-btn {
    align-self: flex-start;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 60px;
  }
}

/* Tablet */
@media (max-width: 1023px) {
  .container {
    padding: 0 40px;
  }
  
  .market-section {
    padding: 80px 0;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 24px;
    align-items: center;
    margin-bottom: 50px;
  }
  
  .header-content {
    text-align: center;
  }
  
  .section-title {
    font-size: 2.75rem;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
    margin-bottom: 60px;
  }
  
  .cta-section {
    padding: 40px 24px;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-description {
    font-size: 1.125rem;
  }
  
  .loading-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
  }
}

@media (max-width: 768px) {
  .market-section {
    padding: 60px 0;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .cta-section {
    padding: 40px 24px;
  }
  
  .cta-title {
    font-size: 1.75rem;
  }
  
  .cta-description {
    font-size: 1rem;
  }
  
  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .artworks-grid {
    grid-template-columns: 1fr;
  }
  
  .loading-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
  }
  
  .view-all-btn {
    width: 100%;
    justify-content: center;
  }
  
  .cta-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 24px;
  }
  
  .cta-section {
    padding: 32px 20px;
  }
  
  .section-header {
    margin-bottom: 32px;
  }
  
  .artworks-grid {
    margin-bottom: 40px;
  }
}
</style>
