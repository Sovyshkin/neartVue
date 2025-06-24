<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";
export default {
  name: "AppAdmin",
  components: { LoadingSpinner, ProductCard, AppEmpty },
  data() {
    return {
      active: 2,
      category: "",
      id: "",
      cards: [],
      status: "",
      message: "",
      isLoading: false,
      name: "",
      mainID: "",
      modal: false,
    };
  },
  methods: {
    async load_artists() {
      try {
        let response = await axios.get(`/get_artists`);
        console.log(response);
        this.cards = response.data || [];
      } catch (err) {
        console.log(err);
      }
    },

    async load_arts() {
      try {
        let response = await axios.get(`/get_pictures`);
        console.log(response);
        this.cards = response.data || [];
      } catch (err) {
        console.log(err);
      }
    },

    async load_orders() {
      try {
        let response = await axios.get(`/orders`);
        console.log(response);
        this.cards = response.data || [];
      } catch (err) {
        console.log(err);
      }
    },

    async check(name) {
      try {
        if (name) {
          this.category = name;
        } else {
          this.category = this.$route.query.name;
        }
        if (this.category == "arts") {
          await this.load_arts();
          this.name = "Картины";
        } else if (this.category == "artists") {
          await this.load_artists();
          this.name = "Художники";
        } else if (this.category == "orders") {
          await this.load_orders();
          this.name = "Заказы";
        }
      } catch (err) {
        console.log(err);
      }
    },

    async goDelete() {
      try {
        let response = await axios.delete(`/artist/${this.mainID}`);
        if (response.status == 200) {
          this.modal = false;
          this.load_artists();
        }
        this.message = response.data.message;
      } catch (err) {
        console.log(err);
      }
    },
    openModal(b, id) {
      this.modal = b;
      this.mainID = id;
    },
  },
  async mounted() {
    await this.check();
  },
};
</script>
<template>
  <div class="wrap-btns">
    <button class="btn" @click="check('arts')">Картины</button>
    <button class="btn" @click="check('artists')">Художники</button>
    <button class="btn" @click="check('orders')">Заказы</button>
  </div>
  <h1>{{ name }}</h1>
  <div class="wrap-btns" v-if="category != 'orders'">
    <router-link v-if="category == 'artists'" class="btn" to="/admin/add/artist"
      >Добавить художника</router-link
    >
    <router-link v-if="category == 'arts'" class="btn" to="/admin/add/art"
      >Добавить картину</router-link
    >
  </div>
  <LoadingSpinner v-if="isLoading" />
  <section v-else>
    <div class="users" v-if="category == 'artists'">
      <div class="user" v-for="card in cards" :key="card.id">
        <span class="username">{{ card.username }}</span>
        <div class="user-wrap-btns">
          <img
            @click="
              $router.push({ name: 'editArtist', query: { id: card.id } })
            "
            src="../assets/edit.png"
            alt=""
          />
          <img
            @click="openModal(true, card.id)"
            src="../assets/delete.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="cards" v-else-if="category == 'arts' && cards?.length">
      <ProductCard
        v-for="card in cards"
        :key="card.id"
        :id="card.id"
        :title="card.title"
        :price="card.price"
        :img_urls="card.img_urls"
        :description="card.description"
        :admin="true"
      />
    </div>
    <AppEmpty v-else />
  </section>
  <v-dialog class="modal" v-model="modal">
    <div class="modal-card">
      <img
        @click="modal = false"
        class="close"
        src="../assets/close.png"
        alt=""
      />
      <h1>Вы уверены?</h1>
      <div class="wrap-btns">
        <button class="btn yes" @click="goDelete()">Да</button>
        <button class="btn no" @click="modal = false">Нет</button>
      </div>
    </div>
  </v-dialog>
</template>
<style scoped>
.wrap-btns {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
}

.user-wrap-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.btn {
  
  padding: 12px 17px;
  color: black;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  border: 1px solid black;
  cursor: pointer;
  outline: none;
}

.users {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.user {
  width: 100%;
  padding: 20px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  
  cursor: pointer;
  transition: all 500ms ease;
}

.user:hover {
  transform: translateY(-3px);
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

h1 {
  text-align: center;
  font-size: 26px;
}

.yes {
  background-color: #b4181f;
  border: 1px solid transparent;
  color: #fff;
}

.user-wrap-btns img {
  width: 25px;
}

.modal-card {
  position: relative;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #fff;
  margin: 0 auto;
  
  padding: 40px 20px 20px 20px;
}
.close {
  position: absolute;
  top: 5%;
  right: 5%;
  cursor: pointer;
  width: 30px;
}
</style>
