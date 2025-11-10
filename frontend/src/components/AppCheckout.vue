<script>
import { useMainStore } from '../stores/main.js';
import DeliveryCalculator from './DeliveryCalculator.vue';

export default {
  name: 'AppCheckout',
  components: {
    DeliveryCalculator
  },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      cartItems: [],
      isLoading: true,
      currentStep: 1,
      orderData: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        comment: ''
      },
      deliveryData: {
        method: 'pickup',
        cost: 0,
        pvzCode: null,
        pvzAddress: null
      },
      isProcessing: false
    }
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) || 0);
      }, 0);
    },
    totalWithDelivery() {
      return this.totalAmount + (this.deliveryData?.cost || 0);
    },
    totalWeight() {
      // Примерный вес - 1кг на картину
      return this.cartItems.length * 1000;
    }
  },
  async mounted() {
    await this.loadCartItems();
    await this.loadUserProfile();
  },
  methods: {
    async loadCartItems() {
      try {
        if (!this.$api || !this.$api.cart) {
          console.error('API not initialized');
          this.$router.push('/cart');
          return;
        }

        const response = await this.$api.cart.getAll();
        const rawItems = response.data?.data || [];

        this.cartItems = rawItems
          .map(item => {
            const artworkData = item?.artwork;
            if (!artworkData) return null;

            const images = artworkData.images?.map(image => ({
              id: image.id,
              url: image.url || "",
              alternativeText: image.alternativeText || artworkData.title || "",
            })) || [];

            return {
              id: item.id,
              documentId: item.documentId || item.id,
              artworkId: artworkData.id,
              artworkDocumentId: artworkData.documentId || artworkData.id,
              title: artworkData.title || "Без названия",
              price: artworkData.price ?? 0,
              description: artworkData.description || "",
              img_urls: images,
            };
          })
          .filter(Boolean);

        if (this.cartItems.length === 0) {
          if (this.mainStore) {
            this.mainStore.showErrorMsg('Корзина пуста');
          }
          this.$router.push('/cart');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        if (this.mainStore) {
          this.mainStore.showErrorMsg('Ошибка загрузки корзины');
        }
        this.$router.push('/cart');
      } finally {
        this.isLoading = false;
      }
    },

    async loadUserProfile() {
      try {
        const userId = localStorage.getItem('id');
        if (!userId) return;

        // Используем правильный API метод
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:1337/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load user profile');
        }
        
        const user = await response.json();
        console.log('Loaded user profile:', user);

        // Автозаполнение формы из профиля
        // Пробуем использовать first_name/last_name, если нет - парсим username
        if (user.first_name) {
          this.orderData.firstName = user.first_name;
        } else if (user.username) {
          const nameParts = user.username.split(' ');
          this.orderData.firstName = nameParts[0] || '';
        }
        
        if (user.last_name) {
          this.orderData.lastName = user.last_name;
        } else if (user.username) {
          const nameParts = user.username.split(' ');
          this.orderData.lastName = nameParts.slice(1).join(' ') || '';
        }
        
        if (user.email) {
          this.orderData.email = user.email;
        }
        if (user.phone) {
          this.orderData.phone = user.phone;
        }
        if (user.city) {
          this.orderData.city = user.city;
        }
        if (user.address) {
          this.orderData.address = user.address;
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    },

    async proceedToPayment() {
      this.isProcessing = true;

      try {
        const order = await this.createOrder();
        await this.initiateTinkoffPayment(order.id);
      } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        if (this.mainStore) {
          this.mainStore.showErrorMsg('Ошибка при создании заказа');
        }
        this.isProcessing = false;
      }
    },

    async createOrder() {
      const orderData = {
        data: {
          fullName: `${this.orderData.firstName} ${this.orderData.lastName}`.trim(),
          phone: this.orderData.phone,
          email: this.orderData.email,
          city: this.orderData.city,
          address: this.orderData.address,
          comment: this.orderData.comment,
          totalAmount: this.totalWithDelivery,
          status: 'pending',
          deliveryMethod: this.deliveryData.method,
          deliveryCost: this.deliveryData.cost,
          cdekPvzCode: this.deliveryData.pvzCode,
          cdekPvzAddress: this.deliveryData.pvzAddress,
          user: localStorage.getItem('id'),
          items: this.cartItems.map(item => ({
            artwork: item.artworkId || item.id,
            quantity: item.quantity || 1,
            price: item.price
          }))
        }
      };

      const response = await this.$api.orders.create(orderData);
      return response.data.data;
    },

    async initiateTinkoffPayment(orderId) {
      this.currentStep = 2;

      const paymentData = {
        orderId: orderId,
        amount: this.totalWithDelivery * 100,
        description: `Заказ №${orderId} в галерее NeerArt`,
        customerData: {
          name: `${this.orderData.firstName} ${this.orderData.lastName}`.trim(),
          email: this.orderData.email,
          phone: this.orderData.phone
        }
      };

      console.log('Инициация платежа:', paymentData);

      try {
        const response = await this.$api.payment.initTinkoff(paymentData);
        console.log('Ответ от сервера платежей:', response.data);

        if (response.data.success && response.data.paymentUrl) {
          console.log('Редирект на:', response.data.paymentUrl);
          window.location.href = response.data.paymentUrl;
        } else {
          console.error('Ошибка создания платежа:', response.data);
          throw new Error(response.data.error || 'Не удалось получить ссылку на оплату');
        }
      } catch (error) {
        console.error('Ошибка при инициации платежа:', error);
        if (this.mainStore) {
          this.mainStore.showErrorMsg(error.message || 'Ошибка при создании платежа');
        }
        this.currentStep = 1;
        this.isProcessing = false;
      }
    },

    handleDeliveryUpdate(data) {
      this.deliveryData = data;
    }
  }
}
</script>

<template>
  <div class="checkout-wrapper">
    <div v-if="isLoading" class="loading">
      <div class="spinner-large"></div>
      <p>Загрузка...</p>
    </div>

    <div v-else class="checkout-container">
      <!-- Шаг 1: Форма заказа -->
      <div v-if="currentStep === 1" class="checkout-content">
        <h1>Оформление заказа</h1>

        <div class="checkout-grid">
          <!-- Левая колонка - форма -->
          <div class="form-section">
            <h2>Данные получателя</h2>
            <form @submit.prevent="proceedToPayment">
              <div class="form-row">
                <div class="form-group">
                  <label>Имя *</label>
                  <input 
                    type="text" 
                    v-model="orderData.firstName" 
                    required 
                    placeholder="Введите имя"
                  >
                </div>

                <div class="form-group">
                  <label>Фамилия *</label>
                  <input 
                    type="text" 
                    v-model="orderData.lastName" 
                    required 
                    placeholder="Введите фамилию"
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Телефон *</label>
                  <input 
                    type="tel" 
                    v-model="orderData.phone" 
                    required 
                    placeholder="+7 (999) 999-99-99"
                  >
                </div>

                <div class="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    v-model="orderData.email" 
                    required 
                    placeholder="example@email.com"
                  >
                </div>
              </div>

              <h2>Адрес доставки</h2>

              <div class="form-group">
                <label>Город *</label>
                <input 
                  type="text" 
                  v-model="orderData.city" 
                  required 
                  placeholder="Москва"
                >
              </div>

              <div class="form-group">
                <label>Адрес доставки *</label>
                <textarea 
                  v-model="orderData.address" 
                  required 
                  placeholder="Улица, дом, квартира"
                  rows="3"
                ></textarea>
              </div>

              <!-- Калькулятор доставки -->
              <DeliveryCalculator 
                :city="orderData.city"
                :totalWeight="totalWeight"
                @update:deliveryData="handleDeliveryUpdate"
              />

              <div class="form-group">
                <label>Комментарий к заказу</label>
                <textarea 
                  v-model="orderData.comment" 
                  placeholder="Дополнительная информация"
                  rows="2"
                ></textarea>
              </div>

              <button type="submit" class="checkout-btn" :disabled="isProcessing">
                <span v-if="isProcessing" class="spinner"></span>
                <span v-else>Перейти к оплате</span>
              </button>
            </form>
          </div>

          <!-- Правая колонка - состав заказа -->
          <div class="order-summary">
            <h2>Ваш заказ</h2>
            
            <div class="order-items">
              <div v-for="item in cartItems" :key="item.id" class="order-item">
                <img 
                  v-if="item.img_urls && item.img_urls[0]" 
                  :src="`http://localhost:1337${item.img_urls[0].url}`" 
                  :alt="item.title"
                  class="item-image"
                >
                <div class="item-details">
                  <h3>{{ item.title }}</h3>
                  <p class="item-price">{{ item.price }} ₽</p>
                </div>
              </div>
            </div>

            <div class="order-total">
              <div class="total-row">
                <span>Товаров:</span>
                <span>{{ cartItems.length }}</span>
              </div>
              <div class="total-row">
                <span>Сумма товаров:</span>
                <span>{{ totalAmount.toFixed(2) }} ₽</span>
              </div>
              <div class="total-row" v-if="deliveryData.cost > 0">
                <span>Доставка:</span>
                <span>{{ deliveryData.cost.toFixed(2) }} ₽</span>
              </div>
              <div class="total-row total-price">
                <span>Итого к оплате:</span>
                <span>{{ totalWithDelivery.toFixed(2) }} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 2: Загрузка платежа -->
      <div v-if="currentStep === 2" class="payment-processing">
        <div class="spinner-large"></div>
        <h2>Подготавливаем платежную форму...</h2>
        <p>Пожалуйста, подождите</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
}

.loading {
  text-align: center;
  padding: 100px 20px;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
}

.checkout-content h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 40px;
  text-align: center;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
}

.form-section {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-section h2 {
  color: #E8336E;
  font-size: 24px;
  margin-bottom: 25px;
  margin-top: 30px;
}

.form-section h2:first-of-type {
  margin-top: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #E8336E;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #E8336E, #d12757);
  color: white;
  border: none;
  padding: 18px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(232, 51, 110, 0.35);
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.order-summary {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.order-summary h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 25px;
}

.order-items {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 25px;
}

.order-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 15px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.item-price {
  font-size: 18px;
  color: #E8336E;
  font-weight: 600;
}

.order-total {
  padding: 20px 0;
  border-top: 2px solid #e9ecef;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 25px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
  color: #666;
}

.total-row:last-child {
  margin-bottom: 0;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: #E8336E;
  margin-top: 15px;
}

.delivery-info {
  background: #f0f9ff;
  padding: 20px;
  border-radius: 12px;
}

.delivery-info h3 {
  color: #0369a1;
  font-size: 18px;
  margin-bottom: 12px;
}

.delivery-info p {
  color: #075985;
  font-size: 14px;
  margin: 5px 0;
}

.payment-processing {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.payment-processing h2 {
  color: #333;
  font-size: 28px;
  margin: 30px 0 15px;
}

.payment-processing p {
  color: #666;
  font-size: 16px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff30;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #E8336E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 968px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .checkout-wrapper {
    padding: 20px 10px;
  }

  .form-section,
  .order-summary {
    padding: 25px 20px;
  }

  .checkout-content h1 {
    font-size: 28px;
  }
}
</style>