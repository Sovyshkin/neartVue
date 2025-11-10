<script>
import AppLoader from "./AppLoader.vue";
import ProductCard from "./ProductCard.vue";
import AppEmpty from "./AppEmpty.vue";
export default {
  name: "AppAdmin",
  components: { AppLoader, ProductCard, AppEmpty },
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
        let response = await this.$api.users.getArtists();
        console.log(response);
        this.cards = response.data.data || [];
      } catch (err) {
        console.log(err);
      }
    },

    async load_arts() {
      try {
        let response = await this.$api.artworks.getAll();
        console.log(response);
        this.cards = response.data.data || [];
      } catch (err) {
        console.log(err);
      }
    },

    async load_orders() {
      try {
        let response = await this.$api.orders.getAll();
        console.log(response);
        this.cards = response.data.data || [];
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
        let response = await this.$api.users.delete(this.mainID);
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
    
    getEmptyTitle() {
      switch(this.category) {
        case 'arts':
          return 'Картины не найдены';
        case 'artists':
          return 'Художники не найдены';
        case 'orders':
          return 'Заказы отсутствуют';
        default:
          return 'Выберите категорию';
      }
    },
    
    getEmptyDescription() {
      switch(this.category) {
        case 'arts':
          return 'В системе пока нет добавленных картин. Добавьте первую картину для отображения в каталоге.';
        case 'artists':
          return 'В системе пока нет зарегистрированных художников. Добавьте информацию о художниках.';
        case 'orders':
          return 'Новых заказов пока нет. Заказы будут отображаться здесь по мере их поступления.';
        default:
          return 'Выберите категорию для управления: картины, художники или заказы.';
      }
    },
    
    getEmptyButtonText() {
      switch(this.category) {
        case 'arts':
          return 'Добавить картину';
        case 'artists':
          return 'Стать художником';
        case 'orders':
          return 'Обновить';
        default:
          return 'Выбрать';
      }
    },
    
    getEmptyButtonRoute() {
      switch(this.category) {
        case 'arts':
          return '/create-art';
        case 'artists':
          return '/profile'; // Перенаправляем в профиль, где можно сделать себя художником
        case 'orders':
          return '/admin';
        default:
          return '/admin';
      }
    },
  },
  async mounted() {
    await this.check();
  },
};
</script>
<template>
  <div class="admin-container">
    <div class="wrap-btns">
      <button class="btn" @click="check('arts')">Картины</button>
      <button class="btn" @click="check('artists')">Художники</button>
      <button class="btn" @click="check('orders')">Заказы</button>
    </div>
  <h1>{{ name }}</h1>
  <div class="wrap-info">
    <p>Управление контентом теперь происходит в админ-панели Strapi.</p>
    <p>Перейдите по адресу: <a href="http://localhost:1337/admin" target="_blank">http://localhost:1337/admin</a></p>
  </div>
  <AppLoader v-if="isLoading" />
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
    <AppEmpty 
      v-else 
      :title="getEmptyTitle()"
      :description="getEmptyDescription()"
      icon="🛠️"
      :showButton="true"
      :buttonText="getEmptyButtonText()"
      :buttonRoute="getEmptyButtonRoute()"
    />
  </section>
  </div>
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
.admin-container {
  min-height: calc(100vh - 200px);
  padding: 20px;
}

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
  background: none;
  padding: 12px 17px;
  color: black;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  border: 1px solid black;
  border-radius: 16px;
  cursor: pointer;
  outline: none;
}

.users {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 60px;
}

.user {
  width: 100%;
  padding: 20px;
  border: 1px solid black;
  border-radius: 16px;
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
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 60px;
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
