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
      currentIndex: 0,
      isHovered: false,
      interval: null
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
        console.log(this.description);
        this.price = response.data.price;
        this.is_favorite = response.data.is_favorite;
        this.img_urls = response.data.img_urls;
        this.size = response.data.size;
        this.status = response.data.status;
        
        // Запускаем автопереключение после загрузки изображений
        if (this.img_urls?.length > 1) {
          this.startInterval();
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.img_urls.length;
      this.resetInterval();
    },
    
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.img_urls.length) % this.img_urls.length;
      this.resetInterval();
    },
    
    resetInterval() {
      clearInterval(this.interval);
      this.startInterval();
    },
    
    startInterval() {
      this.interval = setInterval(() => {
        if (!this.isHovered) {
          this.nextSlide();
        }
      }, 3000);
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
      this.fullscreenImage = `https://217.114.2.107:5000/images/${img}`
      this.dialog = true
    },
    
    closeFullscreen() {
      this.dialog = false
    }
  },
  
  beforeUnmount() {
    clearInterval(this.interval);
  },
  
  async mounted() {
    this.load_pic();
  },
};
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <section class="product-details" v-else>
    <div 
      class="carousel-container"
      v-if="img_urls?.length"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="carousel-slide">
        <img 
          :src="`https://217.114.2.107:5000/images/${img_urls[currentIndex]}`" 
          alt="Product image"
          class="carousel-image"
          @click="openFullscreen(img_urls[currentIndex])"
        />
        
        <!-- Стрелки навигации -->
        <button 
          v-if="img_urls.length > 1"
          class="carousel-arrow prev"
          @click.stop="prevSlide"
          :style="{ opacity: isHovered ? 1 : 0 }"
        >
          &lt;
        </button>
        <button 
          v-if="img_urls.length > 1"
          class="carousel-arrow next"
          @click.stop="nextSlide"
          :style="{ opacity: isHovered ? 1 : 0 }"
        >
          &gt;
        </button>
      </div>
      
      <!-- Индикаторы (точки) -->
      <div class="carousel-indicators" v-if="img_urls.length > 1">
        <span 
          v-for="(img, index) in img_urls" 
          :key="index"
          :class="{ active: currentIndex === index }"
          @click.stop="currentIndex = index"
        ></span>
      </div>
    </div>
    
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
      <span class="desc" v-html="description"></span>
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

/* Кастомная карусель */
.carousel-container {
  position: relative;
  width: 70%;
  height: auto;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
  cursor: zoom-in;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  color: #E8336E;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
  transition: all 0.3s ease;
  opacity: 0;
}

.carousel-arrow:hover {
  background-color: white;
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 15px;
}

.next {
  right: 15px;
}

.carousel-indicators {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background-color: #E8336E;
  transform: scale(1.2);
}

.carousel-indicators span:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 968px) {
  .product-details {
    flex-direction: column;
  }

  .info,
  .carousel-container {
    width: 100%;
  }
}
</style>