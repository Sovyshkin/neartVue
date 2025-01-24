<script>
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  name: "AboutUs",
  components: { LoadingSpinner },
  data() {
    return {
      isLoading: false,
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
  <LoadingSpinner v-if="isLoading" />
  <section class="abousUs" v-else>
    <div class="head">
      <div class="title">
        <h1>О нас</h1>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        fill="#aa6a2a"
        preserveAspectRatio="none"
      >
        <path
          fill-opacity="1"
          d="M0,160L48,181.3C96,203,192,245,288,261.3C384,277,480,267,576,245.3C672,224,768,192,864,192C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
    <div class="info">
      <img
        class="rounded-3xl w-full h-1/4"
        src="../assets/aboutUs.jpg"
        alt=""
      />
      <span
        >Сообщество <b>"НеХудожник"</b> - вдохновляющее и поддерживающее
        пространство для непрофессиональных художников, где каждый может
        раскрыть свой творческий потенциал и поделиться своим искусством с
        миром.</span
      >
      <span
        >Мы объединяем людей, которые любят искусство ищут
        единомышленников.</span
      >
      <span
        >Вместе мы сообщество, где каждый голос услышан, а каждая картина
        находит своего зрителя.</span
      >
    </div>
  </section>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
span {
  font-family: "Roboto", serif;
  font-weight: 400;
  font-style: normal;
}
.head {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 30vh;
}

.title {
  width: 100%;
  height: 10vh;
  background-color: #aa6a2a;
  padding: 40px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

svg {
  position: absolute;
  rotate: 180deg;
  transform: translateY(3px);
  top: 80px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  font-size: 1.875rem;
  line-height: 2.25rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

img {
  border-radius: 1.5rem;
  width: 100%;
  height: 25%;
  font-family: "Unbounded", "Unbounded fallback", sans-serif;
}

@media (max-width: 600px) {
  span {
    font-size: 24px;
    line-height: 30px;
  }

  .info {
    padding: 0 20px;
  }
}

@media (max-width: 420px) {
  .wrapper {
    padding: none !important;
  }

  span {
    font-size: 18px;
    line-height: 24px;
  }
}
</style>
