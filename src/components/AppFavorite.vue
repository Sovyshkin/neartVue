<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";
export default {
  name: "AppFavorite",
  components: { LoadingSpinner, ProductCard, AppEmpty },
  data() {
    return {
      cart_id: "",
      id: "",
      cards: [],
      message: "",
      isLoading: false,
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.cart_id = localStorage.getItem("cart_id");
        this.id = localStorage.getItem("id");
        let response = await axios.get(`/favorites/${this.id}`);
        console.log(response);
        this.cards = response.data.favorites;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1 class="text-center text-2xl">Избранное</h1>
    <div class="cards" v-if="cards.length > 0">
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
        :favorite="true"
        @checkDel="load_info"
      />
    </div>
    <AppEmpty v-else />
  </div>
</template>
<style scoped>
.wrapper {
  padding: 20px;
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
