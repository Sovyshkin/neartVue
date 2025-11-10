<script>
export default {
  name: "BlockAdvantages",
  components: {},
  data() {
    return {
      visibleCards: [],
      advantages: [
        {
          icon: require("../assets/unique.png"),
          title: "Уникальные произведения",
          description: "Эксклюзивные работы от талантливых художников со всего мира"
        },
        {
          icon: require("../assets/delivery.png"),
          title: "Безопасная доставка",
          description: "Специальная упаковка и страхование на время транспортировки"
        },
        {
          icon: require("../assets/support.png"),
          title: "Экспертная поддержка",
          description: "Профессиональные консультации по выбору и покупке искусства"
        },
        {
          icon: require("../assets/choice.png"),
          title: "Широкий выбор",
          description: "Более 1000 произведений в различных стилях и жанрах"
        }
      ]
    };
  },
  async mounted() {
    this.animateCards();
  },
  methods: {
    animateCards() {
      const cards = this.$el.querySelectorAll('.advantage-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          this.visibleCards.push(index);
        }, index * 200);
      });
    }
  }
};
</script>

<template>
  <section class="advantages-section">
    <div class="container">
      <!-- Заголовок секции -->
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-accent">Почему</span> выбирают нас
        </h2>
        <p class="section-subtitle">
          Мы создаем особенный опыт для ценителей искусства
        </p>
      </div>

      <!-- Карточки преимуществ -->
      <div class="advantages-grid">
        <div 
          v-for="(advantage, index) in advantages" 
          :key="index"
          class="advantage-card"
          :class="{ 'card-visible': visibleCards.includes(index) }"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="card-inner">
            <!-- Иконка -->
            <div class="icon-wrapper">
              <div class="icon-bg"></div>
              <img :src="advantage.icon" :alt="advantage.title" class="advantage-icon" />
            </div>

            <!-- Контент -->
            <div class="card-content">
              <h3 class="advantage-title">{{ advantage.title }}</h3>
              <p class="advantage-description">{{ advantage.description }}</p>
            </div>

            <!-- Декоративные элементы -->
            <div class="card-decoration">
              <div class="decoration-circle"></div>
              <div class="decoration-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* Современная секция преимуществ */
.advantages-section {
  width: 100%;
  padding: 120px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}

.advantages-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(232, 51, 110, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(232, 51, 110, 0.03) 0%, transparent 50%);
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
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 24px 0;
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
  width: 100%;
  margin: 0 auto;
  line-height: 1.6;
}

/* Сетка преимуществ */
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

/* Карточка преимущества */
.advantage-card {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease;
  transition-delay: var(--delay);
}

.card-visible {
  opacity: 1;
  transform: translateY(0);
}

.card-inner {
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.card-inner::before {
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

.card-inner:hover::before {
  left: 0;
}

.card-inner:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(232, 51, 110, 0.15);
  border-color: #E8336E;
}

/* Иконка */
.icon-wrapper {
  position: relative;
  margin-bottom: 32px;
  z-index: 10;
}

.icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(232, 51, 110, 0.1) 0%, rgba(209, 39, 87, 0.1) 100%);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.card-inner:hover .icon-bg {
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%) scale(1.1);
}

.advantage-icon {
  width: 64px;
  height: 64px;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  filter: brightness(0) saturate(100%) invert(24%) sepia(87%) saturate(2637%) hue-rotate(323deg) brightness(89%) contrast(91%);
}

.card-inner:hover .advantage-icon {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
  transform: scale(1.05);
}

/* Контент карточки */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 10;
}

.advantage-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  transition: color 0.3s ease;
}

.card-inner:hover .advantage-title {
  color: white;
}

.advantage-description {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.card-inner:hover .advantage-description {
  color: rgba(255, 255, 255, 0.9);
}

/* Декоративные элементы */
.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
}

.decoration-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(232, 51, 110, 0.1) 0%, rgba(209, 39, 87, 0.1) 100%);
  border-radius: 50%;
  position: absolute;
  top: -30px;
  right: -30px;
  transition: all 0.3s ease;
}

.card-inner:hover .decoration-circle {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.2);
}

.decoration-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 8px; /* Увеличиваем закругление */
  transition: all 0.3s ease;
}

.card-inner:hover .decoration-line {
  background: rgba(255, 255, 255, 0.3);
  width: 60px;
}

/* Адаптивность */

/* Extra large desktop (1920px and up) */
@media (min-width: 1920px) {
  .container {
    max-width: 1800px;
    padding: 0 100px;
  }
  
  .advantages-section {
    padding: 160px 0;
  }
  
  .section-header {
    margin-bottom: 100px;
  }
  
  .section-title {
    font-size: 5rem;
  }
  
  .section-subtitle {
    font-size: 1.5rem;
    max-width: 800px;
  }
  
  .advantages-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 50px;
  }
  
  .card-inner {
    padding: 50px 40px;
  }
  
  .advantage-icon {
    width: 80px;
    height: 80px;
  }
  
  .icon-bg {
    width: 120px;
    height: 120px;
  }
  
  .advantage-title {
    font-size: 1.75rem;
  }
  
  .advantage-description {
    font-size: 1.125rem;
  }
}

/* Large desktop (1440px to 1919px) */
@media (min-width: 1440px) and (max-width: 1919px) {
  .container {
    max-width: 1400px;
    padding: 0 80px;
  }
  
  .advantages-section {
    padding: 140px 0;
  }
  
  .section-header {
    margin-bottom: 90px;
  }
  
  .section-title {
    font-size: 4.5rem;
  }
  
  .section-subtitle {
    font-size: 1.375rem;
    max-width: 700px;
  }
  
  .advantages-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }
  
  .card-inner {
    padding: 40px 32px;
  }
  
  .advantage-icon {
    width: 70px;
    height: 70px;
  }
  
  .icon-bg {
    width: 110px;
    height: 110px;
  }
  
  .advantage-title {
    font-size: 1.5rem;
  }
  
  .advantage-description {
    font-size: 1.0625rem;
  }
}

/* Desktop (1025px to 1439px) */
@media (min-width: 1025px) and (max-width: 1439px) {
  .container {
    padding: 0 60px;
  }
  
  .advantages-section {
    padding: 120px 0;
  }
  
  .advantages-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 36px;
  }
  
  .section-title {
    font-size: 3.75rem;
  }
  
  .section-subtitle {
    font-size: 1.25rem;
    max-width: 600px;
  }
  
  .card-inner {
    padding: 36px 28px;
  }
  
  .advantage-title {
    font-size: 1.375rem;
  }
  
  .advantage-description {
    font-size: 1rem;
  }
}

@media (max-width: 1024px) {
  .advantages-section {
    padding: 80px 0;
  }
  
  .container {
    padding: 0 40px;
  }
  
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .section-header {
    margin-bottom: 60px;
  }
  
  .card-inner {
    padding: 32px 24px;
  }
  
  .advantage-title {
    font-size: 1.25rem;
  }
  
  .advantage-description {
    font-size: 0.9375rem;
  }
}

@media (max-width: 768px) {
  .advantages-section {
    padding: 60px 0;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .card-inner {
    padding: 32px 24px;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 24px;
  }
  
  .card-inner {
    padding: 24px 20px;
  }
  
  .advantage-icon {
    width: 48px;
    height: 48px;
  }
  
  .icon-bg {
    width: 80px;
    height: 80px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .info-badge {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
