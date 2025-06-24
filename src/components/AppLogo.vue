<script>
export default {
  name: "AppLogo",
  props: {
    color: String,
  },
};
</script>
<template>
  <div class="logo" @click="$router.push({ name: 'home' })">
    <img class="logo-img" src="../assets/logo.png" alt="Логотип НХ" />
    <div class="logo-text" :class="{ white: color == 'white' }">НЕХУДОЖНИК</div>
  </div>
</template>
<style scoped>
.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%; /* Занимает всю высоту хедера */
}

.logo-img {
  width: auto;
  height: 100%;
  max-height: 70px; /* Максимальная высота */
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text {
  font-family: "Pizzicato", sans-serif;
  font-weight: bold;
  color: #000;
  white-space: nowrap; /* Текст в одну строку */
}

.white {
  color: #fff;
}

/* Адаптация для разных экранов */
@media (min-width: 1201px) {
  .logo-text {
    font-size: 36px;
  }
}

@media (max-width: 1200px) {
  .logo-text {
    font-size: 32px;
  }
}

@media (max-width: 1000px) {
  .logo-text {
    font-size: 28px;
  }
  .logo-img {
    max-height: 60px;
  }
}

@media (max-width: 780px) {
  .logo-text {
    font-size: 24px;
  }
  .logo-img {
    max-height: 50px;
  }
  .logo {
    gap: 8px;
  }
}

@media (max-width: 650px) {
  .logo-text {
    font-size: 20px;
  }
  .logo-img {
    max-height: 45px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 18px;
  }
  .logo-img {
    max-height: 40px;
  }
  .logo {
    gap: 5px;
  }
}

@media (max-width: 380px) {
  .logo-text {
    font-size: 16px;
  }
  .logo-img {
    max-height: 35px;
  }
}
</style>
