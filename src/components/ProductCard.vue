<script>
import axios from "axios";
export default {
  name: "ProductCard",
  components: {},
  data() {
    return {
      items: [],
      carouselRef: "",
    };
  },
  props: {
    id: String,
    title: String,
    price: String,
    img_urls: Array,
    description: String,
    status: String,
    size: String,
    cart: Boolean,
    favorite: Boolean,
    admin: Boolean,
  },
  methods: {
    async deleteElem() {
      try {
        let response = await axios.post(`/delete_elem`, {
          cart_id: localStorage.getItem("cart_id"),
          picture_id: this.id,
        });
        console.log(response);
        this.$emit("checkDel");
      } catch (err) {
        console.log(err);
      }
    },
    async deleteFav() {
      try {
        let response = await axios.post(`/favorites/remove`, {
          customer_id: localStorage.getItem("id"),
          picture_id: this.id,
        });
        console.log(response);
        this.$emit("checkDel");
      } catch (err) {
        console.log();
      }
    },
    goRoute() {
      try {
        if (this.admin) {
          this.$router.push({ name: "editArt", query: { id: this.id } });
        } else {
          this.$router.push({ name: "art", query: { id: this.id } });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  async mounted() {},
};
</script>
<template>
  <div class="card" @click="goRoute()">
    <v-carousel
      height="200"
      show-arrows="hover"
      cycle
      hide-delimiter-background
      v-if="img_urls?.length"
      class="carousel"
    >
      <v-carousel-item
        v-for="img in img_urls"
        :key="img"
        :src="`http://217.114.2.107:5000/images/${img}`"
        aspect-ratio="4 / 3"
        class="carousel-item rounded"
      ></v-carousel-item>
    </v-carousel>
    <div class="info">
      <span>{{ title }}</span>
      <div class="flex font-medium items-center justify-between mt-4">
        <span class="font-bold">{{ price }} ₽</span>
      </div>
      <div
        class="status"
        v-if="status"
        :class="{
          inStok: status == 'В наличии',
          nonStok: status == 'Нет в наличии',
          one: status == 'Доступно под заказ',
        }"
      >
        {{ status }}
      </div>
      <button class="btn mt-3" v-if="cart" @click.stop.prevent="deleteElem">
        Убрать из корзины
      </button>
      <button class="btn mt-3" v-if="favorite" @click.stop.prevent="deleteFav">
        Убрать из избранного
      </button>
    </div>
  </div>
</template>
<style scoped>
.card {
  width: 20%;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 5px 5px 20px 5px;
  background-color: #f1dbb2;
  background-color: #CBCED0;
  background-color: #fff;
  border-radius: 0;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.card:hover {
  transform: none;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
}

.btn {
  width: 100%;
  background-color: #E8336E;
  
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.v-btn {
  background-color: black;
}

.status {
  padding: 3px 6px;
  font-size: 12px;
  line-height: 14px;
}

.inStok {
  background-color: #deffe9;
  color: black;
}

.nonStok {
  background-color: #cf0032;
  color: #fff;
}

.one {
  background-color: #E8336E;
  color: #fff;
}
</style>
