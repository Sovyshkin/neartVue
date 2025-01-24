<script>
import axios from "axios";
import ProductCard from "./ProductCard.vue";

export default {
  name: "MiniMarket",
  components: {
    ProductCard,
  },
  data() {
    return {
      cards: [],
      cart: false,
    };
  },
  methods: {
    open(id) {
      this.$router.push({ name: "product", query: { id: id } });
    },

    async load_info() {
      try {
        let response = await axios.get(`/get_pictures`);
        console.log(response);
        this.cards = response.data;
        this.cards = this.cards.slice(0, 6);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.load_info();
  },
};
</script>
<template>
  <div class="wrapper">
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
.card {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.cards::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
.wrapper {
  padding: 20px 40px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
}
.cards {
  width: 100%;
  max-width: 1440px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
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
