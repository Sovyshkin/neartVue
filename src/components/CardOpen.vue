<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
import AppLogin from "./AppLogin.vue";
import AppRegister from "./AppRegister.vue";
import { useDisplay } from 'vuetify'

export default {
  name: "CardOpen",
  components: { LoadingSpinner, AppLogin, AppRegister },
  setup() {
    const { mobile } = useDisplay()
    return { mobile }
  },
  data() {
    return {
      items: [],
      carouselRef: "",
      customer_id: "",
      isLoading: false,
      id: "",
      title: "",
      price: "",
      size: "",
      status: "",
      img_urls: [],
      description: "",
      is_favorite: false,
      message: "",
      cart_id: localStorage.getItem("cart_id"),
      showRegister: false,
      showLogin: false,
      dialog: false,
      fullscreenImage: "",
    };
  },
  methods: {
    async load_pic() {
      try {
        this.isLoading = true;
        this.customer_id = localStorage.getItem("id");
        this.id = this.$route.query.id;
        let response;
        if (this.customer_id) {
          response = await axios.get(
            `/get_picture/${this.id}?customer_id=${this.customer_id}`
          );
        } else {
          response = await axios.get(`/get_picture/${this.id}`);
        }
        console.log(response);
        this.title = response.data.title;
        this.description = response.data.description;
        this.price = response.data.price;
        this.is_favorite = response.data.is_favorite;
        this.img_urls = response.data.img_urls;
        this.size = response.data.size;
        this.status = response.data.status;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async addCart() {
      try {
        this.cart_id = localStorage.getItem("cart_id");
        this.customer_id = localStorage.getItem("id");
        if (this.cart_id && this.customer_id) {
          this.isLoading = true;
          let response = await axios.post(`/add_elem`, {
            cart_id: this.cart_id,
            picture_id: this.id,
          });
          console.log(response);
          this.message = response.data.message;
          setTimeout(() => {
            this.message = "";
          }, 3500);
        } else {
          this.showRegister = true;
        }
      } catch (err) {
        console.log(err);
        this.message = err.response.data.detail;
        setTimeout(() => {
          this.message = "";
        }, 3500);
      } finally {
        this.isLoading = false;
      }
    },

    async addFav() {
      try {
        this.cart_id = localStorage.getItem("cart_id");
        this.customer_id = localStorage.getItem("id");
        if (this.cart_id && this.customer_id) {
          this.isLoading = true;
          let response = await axios.post(`/favorites/add`, {
            customer_id: localStorage.getItem("id"),
            picture_id: this.id,
          });
          console.log(response);
          this.load_pic();
        } else {
          this.showRegister = true;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async removeFav() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/favorites/remove`, {
          customer_id: localStorage.getItem("id"),
          picture_id: this.id,
        });
        console.log(response);
        this.load_pic();
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    openDialog(type) {
      if (type == "login") {
        this.showLogin = true;
      } else {
        this.showRegister = true;
      }
    },
    handleLog() {
      this.showLogin = false;
      setTimeout(() => {
        this.showRegister = true;
      }, 300);
    },
    openFullscreen(img) {
      this.fullscreenImage = `http://217.114.2.107:5000/images/${img}`
      this.dialog = true
    },
    closeFullscreen() {
      this.dialog = false
    }
  },
  async mounted() {
    this.load_pic();
  },
};
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <section class="product-details" v-else>
    <v-carousel
      show-arrows="hover"
      cycle
      hide-delimiter-background
      class="carousel"
      height="auto"
    >
      <v-carousel-item
        v-for="img in img_urls"
        :key="img"
        :src="`http://217.114.2.107:5000/images/${img}`"
        class="carousel-item"
        aspect-ratio="4 / 3"
        @click="openFullscreen(img)"
      ></v-carousel-item>
    </v-carousel>
    <div class="info">
      <h1>{{ title }}</h1>
      <div class="status">
        <img
          src="../assets/one.png"
          v-if="status == 'Доступно под заказ'"
          alt=""
        />
        <img src="../assets/in-stock.png" v-if="status == 'В наличии'" alt="" />
        <img
          src="../assets/not-stock.png"
          v-if="status == 'Нет в наличии'"
          alt=""
        />{{ status }}
      </div>
      <div class="size">
        <span class="size-text">Размер:</span
        ><span class="size-value">{{ size }}</span>
      </div>
      <div class="product-actions">
        <span class="price">{{ price }} ₽</span>
        <img
          class="w-10"
          src="../assets/favorite.png"
          alt=""
          v-if="!is_favorite"
          @click="addFav()"
        />
        <img
          class="w-10"
          src="../assets/favoriteFill.png"
          alt=""
          v-else
          @click="removeFav()"
        />
      </div>
      <button class="btn" @click="addCart">Добавить в корзину</button>
      <span class="desc">{{ description }}</span>
    </div>
  </section>

  <!-- Диалог для полноэкранного просмотра -->
  <v-dialog
    v-model="dialog"
    fullscreen
    transition="dialog-bottom-transition"
    :scrim="false"
  >
    <v-card color="black">
      <v-toolbar dark color="black">
        <v-btn icon dark @click="closeFullscreen">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-img
        :src="fullscreenImage"
        contain
        class="fullscreen-image"
        @click="closeFullscreen"
      ></v-img>
    </v-card>
  </v-dialog>

  <v-dialog max-width="500" v-model="showLogin">
    <AppLogin @close="showLogin = false" @goReg="handleLog" />
  </v-dialog>
  <v-dialog max-width="500" v-model="showRegister">
    <AppRegister @close="showRegister = false" />
  </v-dialog>
  <div
    class="msg"
    :class="{
      success: this.message == 'Успешно',
      error: this.message != 'Успешно',
    }"
    v-if="message"
  >
    {{ message }}
  </div>
</template>

<style scoped>
.product-details {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 40px;
}

.carousel {
  width: 70%;
  cursor: pointer;
}

.carousel-item {
  cursor: zoom-in;
}

.info {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.product-actions {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.75rem;
}

.product-actions img {
  height: 40px;
  width: 40px;
  cursor: pointer;
  transition: all 500ms ease;
}

.product-actions img:hover {
  transform: translateY(-3px);
}

.btn {
  width: 100%;
  background-color: #E8336E;
  font-size: 1.25rem;
  line-height: 1.5rem;
  padding: 0.625rem 0.875rem;
  font-weight: 700;
  color: #fff;
}

.desc,
.size span,
.status {
  font-weight: 500;
  font-size: 19px;
  line-height: 22px;
}

.status img {
  height: 34px;
  width: 34px;
}

.size,
.status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-text {
  color: #717c8d;
}

.fullscreen-image {
  height: calc(100vh - 64px);
  width: 100%;
  cursor: zoom-out;
}

@media (max-width: 968px) {
  .product-details {
    flex-direction: column;
  }

  .info,
  .carousel {
    width: 100%;
  }
}
</style>