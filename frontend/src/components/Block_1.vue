<script>
export default {
  name: "Block_1",
  data() {
    return {
      isVisible: false
    };
  },
  mounted() {
    // Анимация появления
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  },
  methods: {
    scrollToArts() {
      this.$router.push({ name: 'arts' });
    }
  },
};
</script>

<template>
  <div class="hero-section" :class="{ 'hero-visible': isVisible }">
    <!-- Современный фон с градиентом -->
    <div class="hero-background">
      <div class="background-image"></div>
      <div class="background-overlay"></div>
      <div class="background-pattern"></div>
    </div>

    <!-- Контент hero -->
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          <span class="title-line">Откройте для себя</span>
          <span class="title-line title-accent">уникальное искусство</span>
        </h1>
        <p class="hero-subtitle">
          Исследуйте коллекцию эксклюзивных произведений от талантливых художников
        </p>
      </div>

      <div class="hero-actions">
        <button class="cta-button" @click="scrollToArts">
          <span class="button-text">Начать знакомство</span>
          <div class="button-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>
        
        <button class="secondary-button" @click="$router.push({ name: 'about' })">
          <span>Узнать больше</span>
        </button>
      </div>

      <!-- Статистика -->
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-number">100+</div>
          <div class="stat-label">Произведений</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">50+</div>
          <div class="stat-label">Художников</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">1000+</div>
          <div class="stat-label">Клиентов</div>
        </div>
      </div>
    </div>

    <!-- Декоративные элементы -->
    <div class="floating-elements">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
    </div>

  </div>
</template>
<style scoped>
/* Современный hero-раздел */
.hero-section {
  position: relative;
  min-height: 100vh;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.hero-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Современный фон */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("https://i.imgur.com/Hg1CFFb.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  animation: subtle-zoom 20s ease-in-out infinite alternate;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(232, 51, 110, 0.8) 0%,
    rgba(209, 39, 87, 0.7) 35%,
    rgba(26, 32, 44, 0.8) 100%
  );
  backdrop-filter: blur(2px);
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(232, 51, 110, 0.1) 0%, transparent 50%);
  animation: pattern-float 15s ease-in-out infinite;
}

/* Контент hero */
.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-text {
  margin-bottom: 80px;
  width: 100%;
  text-align: center;
}

.hero-title {
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  width: 100%;
}

.title-line {
  display: block;
  opacity: 0;
  transform: translateY(50px);
  animation: title-reveal 0.8s ease forwards;
}

.title-line:nth-child(1) {
  animation-delay: 0.3s;
}

.title-line:nth-child(2) {
  animation-delay: 0.6s;
}

.title-accent {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.title-accent::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 4px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border-radius: 8px; /* Увеличиваем закругление */
  animation: underline-grow 1s ease-out 1.2s forwards;
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  line-height: 1.6;
  margin: 0 auto;
  opacity: 0.95;
  max-width: 600px;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  animation: subtitle-reveal 1s ease-out 0.9s forwards;
}

/* Кнопки действий */
.hero-actions {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
  flex-wrap: wrap;
}

.cta-button {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border: none;
  border-radius: 24px;
  padding: 20px 40px;
  color: white;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(232, 51, 110, 0.3);
  opacity: 0;
  transform: translateY(30px);
  animation: button-reveal 1s ease-out 1.2s forwards;
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

.button-text,
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

.secondary-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 18px 36px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(30px);
  animation: button-reveal 1s ease-out 1.4s forwards;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Статистика */
.hero-stats {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 60px;
  opacity: 0;
  transform: translateY(30px);
  animation: stats-reveal 1s ease-out 1.6s forwards;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 120px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  word-wrap: break-word;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

  .stat-label {
    font-size: 1.25rem;
  }

/* Плавающие элементы */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(232, 51, 110, 0.1) 100%);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation: float-1 20s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation: float-2 15s ease-in-out infinite;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation: float-3 18s ease-in-out infinite;
}



/* Анимации */
@keyframes title-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes subtitle-reveal {
  to {
    opacity: 0.9;
    transform: translateY(0);
  }
}

@keyframes button-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes stats-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



@keyframes underline-grow {
  to {
    width: 100px;
  }
}

@keyframes subtle-zoom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes pattern-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes float-1 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-40px) rotate(-180deg);
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(90deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Адаптивность */



/* Extra large desktop (1920px and up) */
@media (min-width: 1920px) {
  .hero-content {
    max-width: 1400px;
    padding: 0 100px;
  }
  
  .hero-title {
    font-size: 5.5rem;
    line-height: 1.05;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    max-width: 700px;
    margin: 0 auto 3rem auto;
  }
  
  .hero-actions {
    gap: 32px;
  }
  
  .cta-button,
  .secondary-button {
    padding: 24px 48px;
    font-size: 20px;
  }
  
  .hero-stats {
    gap: 40px;
    margin-top: 4rem;
  }
  
  .stat-item {
    padding: 32px;
  }
  
  .stat-number {
    font-size: 3.5rem;
  }
  
  .stat-label {
    font-size: 1.25rem;
  }
}

/* Large desktop (1440px to 1919px) */
@media (min-width: 1440px) and (max-width: 1919px) {
  .hero-content {
    max-width: 1200px;
    padding: 0 80px;
    margin: 0 auto;
  }
  
  .hero-title {
    font-size: 4.5rem;
    line-height: 1.1;
  }
  
  .hero-subtitle {
    font-size: 1.375rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .hero-actions {
    gap: 28px;
    justify-content: center;
  }
  
  .cta-button,
  .secondary-button {
    padding: 22px 44px;
    font-size: 18px;
  }
  
  .hero-stats {
    gap: 30px;
    margin-top: 3.5rem;
    justify-content: center;
  }
  
  .stat-item {
    padding: 28px;
  }
  
  .stat-number {
    font-size: 3rem;
  }
  
  .stat-label {
    font-size: 1.125rem;
  }
  

}

/* Desktop (1024px to 1439px) */
@media (min-width: 1025px) and (max-width: 1439px) {
  .hero-content {
    padding: 0 60px;
  }
  
  .hero-title {
    font-size: 3.5rem;
    line-height: 1.15;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    max-width: 550px;
    margin: 0 auto 2rem auto;
  }
  
  .floating-circle {
    transform: scale(0.9);
  }
  

}

/* Large tablets */
@media (max-width: 1024px) {
  .hero-section {
    padding: 100px 0;
    min-height: 100vh;
  }
  
  .hero-content {
    padding: 0 60px;
    max-width: 800px;
  }
  
  .hero-title {
    font-size: 3.5rem;
    line-height: 1.1;
    margin-bottom: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    max-width: 600px;
  }
  
  .hero-actions {
    flex-direction: row;
    gap: 20px;
    justify-content: flex-start;
  }
  
  .cta-button,
  .secondary-button {
    width: auto;
    min-width: 180px;
    padding: 18px 36px;
  }
  
  .hero-stats {
    margin-top: 4rem;
    gap: 24px;
  }
  
  .floating-circle {
    transform: scale(0.8);
  }
}

/* Tablets */
@media (max-width: 768px) {
  .hero-section {
    padding: 120px 0;
    width: 100%;
    margin-left: 0;
    min-height: 100vh;
  }
  
  .hero-content {
    padding: 0 50px;
    text-align: center;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 600px;
  }
  
  .hero-title {
    font-size: 3rem;
    line-height: 1.15;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    margin: 0 auto 2.5rem auto;
    text-align: center;
    max-width: 500px;
    line-height: 1.6;
  }
  
  .hero-actions {
    flex-direction: row;
    gap: 20px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .cta-button,
  .secondary-button {
    width: auto;
    min-width: 160px;
    justify-content: center;
    padding: 18px 32px;
    font-size: 16px;
  }
  
  .hero-stats {
    gap: 32px;
    flex-wrap: nowrap;
    justify-content: center;
    margin-top: 3.5rem;
  }
  
  .stat-item {
    flex: 1;
    min-width: 140px;
    max-width: 160px;
    text-align: center;
    padding: 20px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .stat-number {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.95rem;
  }
  
  .floating-circle {
    transform: scale(0.7);
    opacity: 0.5;
  }
}

/* Medium tablets (portrait) */
@media (max-width: 820px) and (orientation: portrait) {
  .hero-section {
    padding: 100px 0;
  }
  
  .hero-content {
    padding: 0 40px;
    max-width: 500px;
  }
  
  .hero-title {
    font-size: 2.75rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 320px;
  }
  
  .cta-button,
  .secondary-button {
    width: 100%;
    min-width: auto;
  }
  
  .hero-stats {
    gap: 24px;
    margin-top: 3rem;
  }
  
  .stat-item {
    min-width: 100px;
    max-width: 120px;
  }
}

/* Small tablets and large phones */
@media (max-width: 640px) {
  .hero-section {
    padding: 80px 0;
    width: 100%;
    margin-left: 0;
    min-height: 100vh;
  }
  
  .hero-content {
    padding: 0 32px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }
  
  .hero-title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    margin: 0 auto 2rem auto;
    line-height: 1.6;
    text-align: center;
    max-width: 400px;
  }
  
  .cta-button,
  .secondary-button {
    padding: 16px 32px;
    font-size: 16px;
    min-height: 56px;
  }
  
  .hero-stats {
    gap: 24px;
    margin-top: 3rem;
  }
  
  .stat-item {
    min-width: 100px;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  

  
  .scroll-text {
    font-size: 12px;
  }
  
  .scroll-arrow svg {
    width: 20px;
    height: 20px;
  }
}

/* Phones */
@media (max-width: 480px) {
  .hero-section {
    padding: 40px 0;
    width: 100%;
    margin-left: 0;
    min-height: 100vh;
  }
  
  .hero-content {
    padding: 0 20px;
    gap: 24px;
  }
  
  .hero-title {
    font-size: 2.25rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    max-width: 320px;
  }
  
  .hero-actions {
    gap: 16px;
    width: 100%;
    max-width: 320px;
  }
  
  .cta-button,
  .secondary-button {
    padding: 16px 32px;
    font-size: 15px;
    width: 100%;
    min-height: 52px;
  }
  
  .hero-stats {
    gap: 12px;
    margin-top: 2rem;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    max-width: 100%;
    padding: 0 10px;
  }
  
  .stat-item {
    flex: 1;
    min-width: 80px;
    max-width: 100px;
    padding: 12px 8px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  
  .stat-number {
    font-size: 1.35rem;
    margin-bottom: 0.25rem;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .stat-label {
    font-size: 0.7rem;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .floating-circle {
    display: none;
  }
}

/* Small phones */
@media (max-width: 375px) {
  .hero-section {
    padding: 32px 0;
  }
  
  .hero-content {
    padding: 0 20px;
  }
  
  .hero-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    max-width: 280px;
  }
  
  .cta-button,
  .secondary-button {
    padding: 14px 28px;
    font-size: 14px;
    min-height: 48px;
    max-width: 250px;
  }
  
  .stat-item {
    padding: 12px 8px;
    max-width: 100px;
    min-width: 70px;
  }
  
  .stat-number {
    font-size: 1.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .stat-label {
    font-size: 0.65rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .hero-stats {
    margin-top: 1.5rem;
    gap: 8px;
    padding: 0 5px;
  }
  

}

/* Landscape orientation for phones */
@media (max-height: 500px) and (orientation: landscape) {
  .hero-section {
    padding: 30px 0;
  }
  
  .hero-title {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  
  .hero-subtitle {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  
  .hero-actions {
    gap: 10px;
  }
  
  .hero-stats {
    margin-top: 1.5rem;
    flex-direction: row;
    gap: 12px;
  }
  
  .stat-item {
    padding: 8px 12px;
    min-width: 80px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}

/* Extra small phones (320px and smaller) */
@media (max-width: 360px) {
  .hero-content {
    padding: 0 16px;
  }
  
  .hero-title {
    font-size: 1.85rem;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
    max-width: 260px;
  }
  
  .hero-stats {
    gap: 8px;
    margin-top: 1.5rem;
    padding: 0 8px;
  }
  
  .stat-item {
    flex: 1;
    min-width: 65px;
    max-width: 85px;
    padding: 10px 6px;
    border-radius: 10px;
  }
  
  .stat-number {
    font-size: 1.15rem;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }
  
  .stat-label {
    font-size: 0.6rem;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* Super small phones (iPhone SE, 320px) */
@media (max-width: 320px) {
  .hero-stats {
    gap: 6px;
    padding: 0 6px;
  }
  
  .stat-item {
    min-width: 60px;
    max-width: 75px;
    padding: 8px 4px;
  }
  
  .stat-number {
    font-size: 1rem;
  }
  
  .stat-label {
    font-size: 0.55rem;
  }
}
</style>
