<script>
export default {
  name: "BlockAdvantages",
  components: {},
  data() {
    return {};
  },
  async mounted() {},
};
</script>
<template>
  <div class="wrapper">
    <h2>Наши преимущества</h2>
    <div class="cards">
      <div class="card">
        <img src="../assets/unique.png" alt="" class="icon" />
        <div class="title">Уникальные картины</div>
        <div class="desc">Оригинальные работы от талантливых художников.</div>
      </div>
      <div class="card">
        <img src="../assets/verify.png" alt="" class="icon" />
        <div class="title">Безопасная покупка</div>
        <div class="desc">Защищенные платежи. Гарантия сделки.</div>
      </div>
      <div class="card">
        <img src="../assets/delivery.png" alt="" class="icon" />
        <div class="title">Доставка</div>
        <div class="desc">Быстрая доставка по всему миру.</div>
      </div>
      <div class="card">
        <img src="../assets/support.png" alt="" class="icon" />
        <div class="title">Консультация</div>
        <div class="desc">Помощь эксперта в выборе искусства.</div>
      </div>
      <div class="card">
        <img src="../assets/choice.png" alt="" class="icon" />
        <div class="title">Широкий выбор</div>
        <div class="desc">Разнообразие стилей, жанров и размеров.</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h2 {
  text-align: center;
  z-index: 2;
}
.wrapper {
  margin-top: 40px;
  padding: 0 40px;
  width: 100%;
}

.cards {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.card {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
}

.title {
  color: #aa6a2a;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
}

.desc {
  color: #0f0f0f;
  opacity: 70%;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.8px;
  text-align: center;
}

.icon {
  height: 40px;
  width: 40px;
}

@media (max-width: 870px) {
  .cards {
    flex-wrap: wrap;
    justify-content: stretch;
  }
  .card {
    width: 32%;
  }

  .card:nth-last-child(2),
  .card:nth-last-child(1) {
    width: 48%;
  }
}

@media (max-width: 580px) {
  .card {
    width: 48%;
  }

  .card:nth-last-child(1) {
    width: 100%;
  }
}

@media (max-width: 400px) {
  .card {
    width: 100% !important;
  }
}
</style>
