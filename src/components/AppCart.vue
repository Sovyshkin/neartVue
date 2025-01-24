<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";
export default {
  name: "AppCart",
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
        this.cart_id = localStorage.getItem("cart_id");
        this.id = localStorage.getItem("id");
        this.isLoading = true;
        let response = await axios.get(`/cart/${this.cart_id}/items`);
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
    this.load_info();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1 class="text-center text-2xl">Корзина</h1>
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
        :cart="true"
        @checkDel="load_info"
      />
    </div>
    <AppEmpty v-else />
    <div class="wrap-btn">
      <a
        href="https://t.me/vselena_deva"
        target="_blank"
        rel="noopener noreferrer"
        class="btn"
        >Заказать</a
      >
    </div>
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

.wrap-btn {
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  border-radius: 10px;
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  background-color: #aa6a2a;
  cursor: pointer;
  outline: none;
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
