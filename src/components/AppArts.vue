<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
import ProductCard from "./ProductCard.vue";

export default {
  name: "AppArts",
  components: { LoadingSpinner, ProductCard },
  data() {
    return {
      isLoading: false,
      cards: [],
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.get(`/get_pictures`);
        console.log(response);
        this.cards = response.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // document.body.style.overflow = "auto";
    this.load_info();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <h2>Картины</h2>
    <div class="cards">
      <ProductCard
        class="card"
        v-for="card in cards"
        :key="card.id"
        :id="card.id"
        :title="card.title"
        :price="card.price"
        :img_urls="card.img_urls"
        :description="card.description"
        :cart="card.cart"
        :favorite="card.favorite"
      />
    </div>
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
}
.cards {
  width: 100%;
  max-width: 1440px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 auto;
}

.card {
  width: 24%;
}

@media (max-width: 1060px) {
  .cards {
    flex-wrap: wrap;
  }
}

@media (max-width: 812px) {
  .cards {
    justify-content: center;
  }

  .card {
    flex: 50%;
    width: auto;
    max-width: 45%;
  }
}

@media (max-width: 560px) {
  .card {
    flex: 100%;
    max-width: 80%;
  }
}

@media (max-width: 430px) {
  .card {
    max-width: 100%;
  }
}
</style>
