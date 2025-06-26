<script>
import axios from "axios";
export default {
  name: "ProductCard",
  components: {},
  data() {
    return {
      currentIndex: 0,
      interval: null,
      isHovered: false
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
  
  mounted() {
    if (this.img_urls?.length > 1) {
      this.startInterval();
    }
  },
  
  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>

<template>
  <div class="card" @click="goRoute()">
    <div 
      class="carousel-container"
      v-if="img_urls?.length"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="carousel-slide">
        <img 
          :src="`http://217.114.2.107:5000/images/${img_urls[currentIndex]}`" 
          alt="Product image"
          class="carousel-image"
        />
        
        <!-- Стрелки навигации -->
        <button 
          v-if="img_urls.length > 1 && isHovered"
          class="carousel-arrow prev"
          @click.stop="prevSlide"
        >
          &lt;
        </button>
        <button 
          v-if="img_urls.length > 1 && isHovered"
          class="carousel-arrow next"
          @click.stop="nextSlide"
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

/* Кастомная карусель */
.carousel-container {
  position: relative;
  width: 100%;
  height: 200px;
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
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  color: #E8336E;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: all 0.3s ease;
}

.carousel-arrow:hover {
  background-color: white;
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}

.carousel-indicators span {
  width: 8px;
  height: 8px;
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
</style>