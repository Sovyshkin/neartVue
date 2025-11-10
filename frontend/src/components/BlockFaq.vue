<script>
export default {
  name: "BlockFaq",
  components: {},
  data() {
    return {
      cards: [
        {
          qst: "Как выбрать подходящую картину?",
          ans: `При выборе картины обратите внимание на следующие факторы:
          <ul class="group-list">
            <li class="group-item">Стиль и техника художника</li>
            <li class="group-item">Тематика и композиция</li>
            <li class="group-item">Цветовая гамма и настроение</li>
            <li class="group-item">Качество исполнения</li>
            <li class="group-item">Размер и формат</li>
            <li class="group-item">Цена в сравнении с другими работами художника</li>
          </ul>
          <p>Важно выбрать картину, которая вам нравится и соответствует вашим предпочтениям. Не стоит покупать что-то только потому, что оно "продаваемое".</p>`,
          open: false,
        },
        {
          qst: "Как мы определяем стоимость картины?",
          ans: `Цена картины зависит от нескольких факторов:
          <ul class="group-list">
            <li class="group-item">Техника и качество исполнения</li>
            <li class="group-item">Размер и сложность работы</li>
            <li class="group-item">Стоимость материалов</li>
            <li class="group-item">Ценовая политика галереи</li>
          </ul>`,
          open: false,
        },
        {
          qst: "Какие гарантии мы предоставляем?",
          ans: `Мы предоставляем следующие гарантии:
          <ul class="group-list">
            <li class="group-item">Качество исполнения и материалов</li>
            <li class="group-item">Автентичность произведения</li>
            <li class="group-item">Долгосрочное сохранение цвета и фактуры</li>
            <li class="group-item">Возможность реставрации при необходимости</li>
            <li class="group-item">Постпродажный сервис по консультациям и уходу</li>
            <li class="group-item">Гарантии помогают клиенту чувствовать себя уверенно при покупке картины</li>
          </ul>`,
          open: false,
        },
        {
          qst: "Как долго занимает доставка картины?",
          ans: `Срок доставки зависит от нескольких факторов:
          <ul class="group-list">
            <li class="group-item">Расстояние между местоположением галереи и клиентом</li>
            <li class="group-item">Тип транспортировки (почта, курьерская служба)</li>
            <li class="group-item">Составление заказа и обработка платежа</li>
          </ul>
          <p>В среднем доставка занимает от нескольких дней до недели. Мы предоставляем точную информацию о сроках доставки при оформлении заказа.</p>`,
          open: false,
        },
      ],
    };
  },
  methods: {
    goCreate() {
      let token = localStorage.getItem("token");
      if (token) {
        this.$router.push({ name: "createTicket" });
      } else {
        this.$emit("updateLogin", true);
      }
    },
    goTickets() {
      let token = localStorage.getItem("token");
      if (token) {
        this.$router.push({ name: "tickets" });
      } else {
        this.$emit("updateLogin", true);
      }
    },
  },
  async mounted() {},
};
</script>
<template>
  <section class="faq-section">
    <div class="container">
      <!-- Заголовок секции -->
      <div class="section-header">
        <h2 class="section-title">
          Часто задаваемые <span class="title-accent">вопросы</span>
        </h2>
        <p class="section-subtitle">
          Найдите ответы на самые популярные вопросы о нашей галерее и услугах
        </p>
      </div>

      <!-- FAQ карточки -->
      <div class="faq-container">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="faq-card"
          :class="{ 'is-open': card.open }"
          @click="card.open = !card.open"
        >
          <div class="faq-header">
            <h3 class="faq-question">{{ card.qst }}</h3>
            <div class="faq-toggle">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                class="toggle-icon"
                :class="{ 'rotated': card.open }"
              >
                <path 
                  d="M6 9L12 15L18 9" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          
          <transition name="faq-content">
            <div v-if="card.open" class="faq-content">
              <div class="faq-answer" v-html="card.ans"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* Современная секция FAQ */
.faq-section {
  width: 100%;
  padding: 120px 0 60px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
}

.faq-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(232, 51, 110, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(232, 51, 110, 0.03) 0%, transparent 50%);
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
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* FAQ контейнер */
.faq-container {
  max-width: 800px;
  margin: 0 auto 80px auto;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

/* FAQ карточки */
.faq-card {
  background: white;
  border-radius: 20px;
  border: 2px solid transparent;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.faq-card:hover {
  border-color: rgba(232, 51, 110, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.faq-card.is-open {
  border-color: #E8336E;
  box-shadow: 0 12px 50px rgba(232, 51, 110, 0.15);
}

.faq-header {
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.faq-question {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  transition: color 0.3s ease;
}

.faq-card.is-open .faq-question {
  color: #E8336E;
}

.faq-toggle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.faq-card:hover .faq-toggle {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  transform: scale(1.1);
}

.faq-card:hover .toggle-icon {
  color: white;
}

.faq-card.is-open .faq-toggle {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
}

.toggle-icon {
  color: #64748b;
  transition: all 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
  color: white;
}

/* Контент FAQ */
.faq-content {
  overflow: hidden;
}

.faq-answer {
  padding: 0 32px 32px 32px;
  font-size: 1.125rem;
  line-height: 1.7;
  color: #475569;
}

.faq-answer h3,
.faq-answer h4 {
  color: #1a202c;
  font-weight: 600;
  margin: 24px 0 16px 0;
}

.faq-answer ul,
.faq-answer ol {
  margin: 16px 0;
  padding-left: 24px;
}

.faq-answer li {
  margin: 8px 0;
  color: #64748b;
}

.faq-answer p {
  margin: 16px 0;
}

.faq-answer p:first-child {
  margin-top: 0;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

/* Анимации */
.faq-content-enter-active,
.faq-content-leave-active {
  transition: all 0.3s ease;
}

.faq-content-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.faq-content-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.faq-content-enter-to,
.faq-content-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

/* Футер FAQ */
.faq-footer {
  display: flex;
  justify-content: center;
}

.support-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 48px 40px;
  color: white;
  text-align: center;
  max-width: 600px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.support-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.support-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  position: relative;
  z-index: 1;
}

.support-icon svg {
  color: white;
}

.support-content {
  position: relative;
  z-index: 1;
}

.support-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.support-description {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.support-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.support-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 14px 24px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.support-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.support-btn.primary {
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border-color: transparent;
}

.support-btn.primary:hover {
  background: white;
  color: #5a67d8;
  transform: translateY(-2px);
}

.support-btn svg {
  flex-shrink: 0;
}

/* Адаптивность */

/* Extra large desktop (1920px and up) */
@media (min-width: 1920px) {
  .container {
    max-width: 1800px;
    padding: 0 100px;
  }
  
  .faq-section {
    padding: 160px 0 80px 0;
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
  
  .faq-container {
    max-width: 1000px;
    margin-bottom: 100px;
  }
  
  .faq-header {
    padding: 40px;
  }
  
  .faq-question {
    font-size: 1.5rem;
  }
  
  .faq-answer {
    padding: 0 40px 40px 40px;
    font-size: 1.25rem;
  }
  
  .support-card {
    padding: 60px 50px;
  }
}

/* Large desktop (1440px to 1919px) */
@media (min-width: 1440px) and (max-width: 1919px) {
  .container {
    max-width: 1400px;
    padding: 0 80px;
  }
  
  .faq-section {
    padding: 140px 0 70px 0;
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
  
  .faq-container {
    max-width: 900px;
    margin-bottom: 90px;
  }
  
  .faq-header {
    padding: 36px;
  }
  
  .faq-answer {
    padding: 0 36px 36px 36px;
  }
  
  .support-card {
    padding: 52px 44px;
  }
}

/* Desktop (1025px to 1439px) */
@media (min-width: 1025px) and (max-width: 1439px) {
  .container {
    padding: 0 60px;
  }
  
  .faq-section {
    padding: 120px 0;
  }
  
  .section-title {
    font-size: 3.75rem;
  }
  
  .section-subtitle {
    font-size: 1.25rem;
    max-width: 600px;
  }
}

@media (max-width: 1024px) {
  .container {
    padding: 0 40px;
  }
  
  .faq-section {
    padding: 80px 0;
  }
  
  .section-header {
    margin-bottom: 60px;
  }
  
  .section-title {
    font-size: 2.75rem;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
  }
  
  .faq-container {
    margin-bottom: 60px;
  }
  
  .faq-header {
    padding: 28px;
  }
  
  .faq-question {
    font-size: 1.25rem;
  }
  
  .faq-answer {
    padding: 0 28px 28px 28px;
    font-size: 1rem;
  }
  
  .support-card {
    padding: 40px 32px;
  }
  
  .support-title {
    font-size: 1.5rem;
  }
  
  .support-description {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 32px;
  }
  
  .faq-section {
    padding: 60px 0;
  }
  
  .section-header {
    margin-bottom: 50px;
  }
  
  .section-title {
    font-size: 2.25rem;
  }
  
  .faq-header {
    padding: 24px;
    gap: 16px;
  }
  
  .faq-question {
    font-size: 1.125rem;
  }
  
  .faq-toggle {
    width: 40px;
    height: 40px;
  }
  
  .faq-answer {
    padding: 0 24px 24px 24px;
    font-size: 0.975rem;
  }
  
  .support-card {
    padding: 32px 24px;
  }
  
  .support-icon {
    width: 64px;
    height: 64px;
  }
  
  .support-actions {
    flex-direction: column;
  }
  
  .support-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 24px;
  }
  
  .faq-header {
    padding: 20px;
  }
  
  .faq-question {
    font-size: 1rem;
  }
  
  .faq-answer {
    padding: 0 20px 20px 20px;
    font-size: 0.9rem;
  }
  
  .support-card {
    padding: 28px 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 20px;
  }
  
  .faq-section {
    padding: 50px 0;
  }
  
  .section-header {
    margin-bottom: 40px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .faq-container {
    margin-bottom: 50px;
  }
  
  .faq-card {
    margin-bottom: 16px;
  }
  
  .faq-header {
    padding: 16px;
  }
  
  .faq-question {
    font-size: 0.95rem;
  }
  
  .faq-toggle {
    width: 36px;
    height: 36px;
  }
  
  .faq-answer {
    padding: 0 16px 16px 16px;
    font-size: 0.875rem;
  }
  
  .support-card {
    padding: 24px 16px;
  }
  
  .support-title {
    font-size: 1.25rem;
  }
  
  .support-description {
    font-size: 0.9rem;
  }
  
  .support-btn {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
