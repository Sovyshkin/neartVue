<script>
import AppLoader from "./AppLoader.vue";
export default {
  name: "AboutUs",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      stats: [
        { number: "500+", label: "Художников" },
        { number: "1000+", label: "Произведений" },
        { number: "50+", label: "Городов" },
        { number: "2025", label: "Год основания" }
      ],
      features: [
        {
          icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 12L11 14L15 10"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
                  <path d="M12 8V12L15 15"/>
                </svg>`,
          title: "Творческое сообщество",
          description: "Пространство для художников всех уровней, где каждый может развиваться и делиться опытом"
        },
        {
          icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>`,
          title: "Поддержка таланта",
          description: "Мы помогаем художникам находить свою аудиторию и продвигать свои работы"
        },
        {
          icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21V19C23 18.1326 22.7473 17.3274 22.2963 16.6569C21.8454 15.9865 21.2281 15.4867 20.5 15.2398"/>
                  <path d="M16 3.13C16.7275 3.37664 17.3448 3.87637 17.7957 4.54683C18.2467 5.21729 18.4993 6.02253 18.4993 6.89C18.4993 7.75747 18.2467 8.56271 17.7957 9.23317C17.3448 9.90363 16.7275 10.4034 16 10.65"/>
                </svg>`,
          title: "Единомышленники",
          description: "Объединяем людей, которые разделяют любовь к искусству и стремление к творчеству"
        },
        {
          icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22S8 18 8 14C8 11.79 9.79 10 12 10S16 11.79 16 14C16 18 12 22 12 22Z"/>
                  <circle cx="12" cy="14" r="3"/>
                  <path d="M5 3L19 3"/>
                  <path d="M5 3L7 7L12 5L17 7L19 3"/>
                  <circle cx="12" cy="14" r="1" fill="currentColor"/>
                </svg>`,
          title: "Персональный подход",
          description: "Каждый художник уникален, и мы ценим индивидуальность каждого участника"
        }
      ]
    };
  },
  methods: {},
  mounted() {
    try {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 200);
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="about-page" v-else>
    <!-- Hero секция -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            О <span class="title-accent">НеХудожнике</span>
          </h1>
          <p class="hero-subtitle">
            Вдохновляющее сообщество для творческих людей, где каждый может раскрыть свой потенциал и поделиться искусством с миром
          </p>
        </div>
        <div class="hero-image">
          <img src="../assets/aboutUs.jpg" alt="О нас" class="main-image" />
        </div>
      </div>
    </section>

    <!-- История и миссия -->
    <section class="story-section">
      <div class="container">
        <div class="story-content">
          <div class="story-text">
            <h2 class="section-title">Наша история</h2>
            <div class="text-content">
              <p>
                Сообщество <strong>"НеХудожник"</strong> родилось из простой идеи: каждый человек способен создавать прекрасное, независимо от уровня подготовки или профессионального образования.
              </p>
              <p>
                Мы объединяем людей, которые любят искусство и ищут единомышленников. Здесь профессиональные художники делятся опытом с начинающими, а любители находят вдохновение и поддержку.
              </p>
              <p>
                Вместе мы создаем сообщество, где каждый голос услышан, а каждая работа находит своего зрителя и ценителя.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Статистика -->
    <section class="stats-section">
      <div class="container">
        <h2 class="section-title">НеХудожник в цифрах</h2>
        <div class="stats-grid">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="stat-card"
          >
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Особенности -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Что нас отличает</h2>
        <div class="features-grid">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card"
          >
            <div class="feature-icon" v-html="feature.icon"></div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Призыв к действию -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Присоединяйтесь к нашему сообществу</h2>
          <p class="cta-subtitle">
            Станьте частью творческого движения и откройте новые горизонты в искусстве
          </p>
          <div class="cta-buttons">
            <router-link to="/arts" class="cta-button primary">
              Посмотреть работы
            </router-link>
            <router-link to="/artists" class="cta-button secondary">
              Познакомиться с художниками
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
/* Современная страница О нас */
.about-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 60px;
}

/* Hero секция */
.hero-section {
  padding: 120px 0;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 10;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0;
}

.title-accent {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.hero-image {
  position: relative;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

/* История и миссия */
.story-section {
  padding: 120px 0;
}

.story-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 60px 0;
  text-align: center;
}

.story-text .section-title {
  margin-bottom: 40px;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.text-content p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #4a5568;
  margin: 0;
}

.text-content strong {
  color: #E8336E;
  font-weight: 600;
}

/* Статистика */
.stats-section {
  padding: 120px 0;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-top: 60px;
}

.stat-card {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(232, 51, 110, 0.15);
  border-color: rgba(232, 51, 110, 0.3);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: #64748b;
}

/* Особенности */
.features-section {
  padding: 120px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;
  margin-top: 60px;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  background: white;
  padding: 52px 44px;
  border-radius: 24px;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 380px;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  transition: left 0.5s ease;
  z-index: 1;
}

.feature-card:hover::before {
  left: 0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(232, 51, 110, 0.2);
  border-color: #E8336E;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  margin: 0 auto 32px auto;
  background: linear-gradient(135deg, rgba(232, 51, 110, 0.08) 0%, rgba(209, 39, 87, 0.12) 100%);
  border: 2px solid rgba(232, 51, 110, 0.15);
  border-radius: 24px;
  color: #E8336E;
  position: relative;
  z-index: 10;
  transition: all 0.4s ease;
  box-shadow: 0 8px 32px rgba(232, 51, 110, 0.08);
}

.feature-icon svg {
  width: 48px;
  height: 48px;
  stroke: currentColor;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
  box-shadow: 0 12px 48px rgba(255, 255, 255, 0.2);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 20px 0;
  position: relative;
  z-index: 10;
  transition: color 0.3s ease;
  line-height: 1.4;
}

.feature-card:hover .feature-title {
  color: white;
}

.feature-description {
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #64748b;
  margin: 0;
  position: relative;
  z-index: 10;
  transition: color 0.3s ease;
}

.feature-card:hover .feature-description {
  color: rgba(255, 255, 255, 0.9);
}

/* Призыв к действию */
.cta-section {
  padding: 120px 0;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin: 0 0 24px 0;
}

.cta-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 48px 0;
}

.cta-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 200px;
}

.cta-button.primary {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
  border: 2px solid transparent;
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(232, 51, 110, 0.4);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Адаптивность */
@media (min-width: 1920px) {
  .container {
    max-width: 1920px;
  }
  
  .features-grid {
    gap: 70px;
    max-width: 1800px;
  }
  
  .feature-card {
    padding: 64px 52px;
    min-height: 420px;
  }
  
  .feature-title {
    font-size: 1.625rem;
  }
  
  .feature-description {
    font-size: 1.1875rem;
  }
}

@media (min-width: 1400px) and (max-width: 1919px) {
  .container {
    max-width: 1700px;
  }
  
  .features-grid {
    gap: 56px;
    max-width: 1650px;
  }
  
  .feature-card {
    padding: 60px 48px;
    min-height: 400px;
  }
  
  .feature-title {
    font-size: 1.5rem;
  }
  
  .feature-description {
    font-size: 1.125rem;
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .container {
    max-width: 1500px;
  }
  
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 44px;
    max-width: 1450px;
  }
  
  .feature-card {
    padding: 48px 40px;
    min-height: 360px;
  }
  
  .feature-title {
    font-size: 1.375rem;
  }
  
  .feature-description {
    font-size: 1rem;
  }
}

@media (min-width: 1025px) and (max-width: 1199px) {
  .container {
    max-width: 1400px;
  }
  
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 36px;
    max-width: 1350px;
  }
  
  .feature-card {
    padding: 44px 36px;
    min-height: 340px;
  }
  
  .feature-icon {
    width: 88px;
    height: 88px;
    margin-bottom: 28px;
  }
  
  .feature-icon svg {
    width: 44px;
    height: 44px;
  }
  
  .feature-title {
    font-size: 1.25rem;
    margin-bottom: 16px;
  }
  
  .feature-description {
    font-size: 0.9375rem;
    line-height: 1.7;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }
  
  .container {
    padding: 0 40px;
  }
  
  .hero-container {
    padding: 0 40px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  
  .feature-card {
    padding: 44px 36px;
    min-height: 320px;
  }
  
  .feature-icon {
    width: 88px;
    height: 88px;
    margin-bottom: 28px;
  }
  
  .feature-icon svg {
    width: 44px;
    height: 44px;
  }
  
  .feature-title {
    font-size: 1.25rem;
  }
  
  .feature-description {
    font-size: 0.9375rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .hero-section,
  .story-section,
  .stats-section,
  .features-section,
  .cta-section {
    padding: 80px 0;
  }
  
  .container {
    padding: 0 32px;
  }
  
  .hero-container {
    padding: 0 32px;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .main-image {
    height: 300px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .feature-card {
    padding: 36px 28px;
    min-height: 280px;
  }
  
  .feature-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 24px;
  }
  
  .feature-icon svg {
    width: 40px;
    height: 40px;
  }
  
  .feature-title {
    font-size: 1.125rem;
    margin-bottom: 16px;
  }
  
  .feature-description {
    font-size: 0.875rem;
    line-height: 1.65;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 20px;
  }
  
  .hero-container {
    padding: 0 20px;
  }
  
  .hero-section,
  .story-section,
  .stats-section,
  .features-section,
  .cta-section {
    padding: 60px 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .main-image {
    height: 250px;
  }
  
  .section-title {
    font-size: 1.75rem;
    margin-bottom: 40px;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-card {
    padding: 32px 24px;
    min-height: 260px;
  }
  
  .feature-icon {
    width: 72px;
    height: 72px;
    margin-bottom: 20px;
  }
  
  .feature-icon svg {
    width: 36px;
    height: 36px;
  }
  
  .feature-title {
    font-size: 1.125rem;
    margin-bottom: 14px;
  }
  
  .feature-description {
    font-size: 0.875rem;
    line-height: 1.6;
  }
  
  .text-content p {
    font-size: 1rem;
  }
}
</style>
