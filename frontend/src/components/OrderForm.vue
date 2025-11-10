<template>
  <div class="order-form-overlay" v-if="isVisible" @click.self="closeForm">
    <div class="order-form">
      <div class="form-header">
        <h2>Оформление заказа</h2>
        <button class="close-btn" @click="closeForm">×</button>
      </div>

      <!-- Шаг 1: Адрес доставки -->
      <div v-if="currentStep === 1" class="step-content">
        <h3>Адрес доставки</h3>
        <form @submit.prevent="proceedToPayment">
          <div class="form-group">
            <label>Имя получателя *</label>
            <input 
              type="text" 
              v-model="orderData.fullName" 
              required 
              placeholder="Введите полное имя"
            >
          </div>

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

          <div class="form-group">
            <label>Комментарий к заказу</label>
            <textarea 
              v-model="orderData.comment" 
              placeholder="Дополнительная информация"
              rows="2"
            ></textarea>
          </div>

          <div class="order-summary">
            <h4>Итого к оплате: {{ totalAmount }} ₽</h4>
            <p>Товаров: {{ cartItems.length }}</p>
            <div class="items-list">
              <div v-for="item in cartItems" :key="item.id" class="order-item">
                <span>{{ item.title }}</span>
                <span>{{ item.price }} ₽</span>
              </div>
            </div>
          </div>

          <button type="submit" class="proceed-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            Перейти к оплате
          </button>
        </form>
      </div>

      <!-- Шаг 2: Загрузка платежной формы -->
      <div v-if="currentStep === 2" class="step-content">
        <div class="payment-loading">
          <div class="spinner-large"></div>
          <p>Подготавливаем платежную форму...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '../stores/main.js';

export default {
  name: 'OrderForm',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    cartItems: {
      type: Array,
      default: () => []
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      currentStep: 1,
      isLoading: false,
      orderData: {
        fullName: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        comment: ''
      }
    }
  },
  methods: {
    closeForm() {
      this.$emit('close');
      this.resetForm();
    },
    
    resetForm() {
      this.currentStep = 1;
      this.isLoading = false;
      this.orderData = {
        fullName: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        comment: ''
      };
    },

    async proceedToPayment() {
      this.isLoading = true;
      
      try {
        // Создаем заказ в базе данных
        const order = await this.createOrder();
        
        // Инициируем платеж через Т-Банк
        await this.initiateTinkoffPayment(order.id);
        
      } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        if (this.mainStore) {
          this.mainStore.showErrorMsg('Ошибка при создании заказа');
        }
        this.isLoading = false;
      }
    },

    async createOrder() {
      const orderData = {
        data: {
          fullName: this.orderData.fullName,
          phone: this.orderData.phone,
          email: this.orderData.email,
          city: this.orderData.city,
          address: this.orderData.address,
          comment: this.orderData.comment,
          totalAmount: this.totalAmount,
          status: 'pending',
          user: localStorage.getItem('id'),
          items: this.cartItems.map(item => ({
            artwork: item.artworkId || item.id,
            quantity: item.quantity || 1,
            price: item.price
          }))
        }
      };

      console.log('Creating order with data:', orderData);
      const response = await this.$api.post('/orders', orderData);
      return response.data.data;
    },

    async initiateTinkoffPayment(orderId) {
      this.currentStep = 2;

      const paymentData = {
        orderId: orderId,
        amount: this.totalAmount * 100, // Т-Банк принимает сумму в копейках
        description: `Заказ №${orderId} в галерее NeerArt`,
        customerData: {
          name: this.orderData.fullName,
          email: this.orderData.email,
          phone: this.orderData.phone
        }
      };

      try {
        console.log('Initiating Tinkoff payment:', paymentData);
        
        // Отправляем запрос на наш бэкенд для создания платежа
        const response = await this.$api.post('/payment/tinkoff/init', paymentData);
        
        if (response.data.success && response.data.paymentUrl) {
          // Перенаправляем пользователя на страницу оплаты Т-Банка
          window.location.href = response.data.paymentUrl;
        } else {
          throw new Error(response.data.error || 'Не удалось получить ссылку на оплату');
        }
        
      } catch (error) {
        console.error('Ошибка при инициации платежа:', error);
        if (this.mainStore) {
          this.mainStore.showErrorMsg('Ошибка при создании платежа');
        }
        this.currentStep = 1;
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.order-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.order-form {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.form-header h2 {
  margin: 0;
  color: #333;
  font-size: 28px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #E8336E;
}

.step-content h3 {
  color: #E8336E;
  margin-bottom: 25px;
  font-size: 22px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
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
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #E8336E;
}

.order-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin: 25px 0;
}

.order-summary h4 {
  color: #E8336E;
  margin: 0 0 10px 0;
  font-size: 20px;
}

.order-summary p {
  margin: 5px 0;
  color: #666;
}

.items-list {
  margin-top: 15px;
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  color: #666;
  font-size: 14px;
}

.proceed-btn {
  width: 100%;
  background: linear-gradient(135deg, #E8336E, #d12757);
  color: white;
  border: none;
  padding: 18px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.proceed-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(232, 51, 110, 0.3);
}

.proceed-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.payment-loading {
  text-align: center;
  padding: 60px 20px;
}

.payment-loading p {
  margin-top: 20px;
  font-size: 18px;
  color: #666;
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
  width: 50px;
  height: 50px;
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

@media (max-width: 768px) {
  .order-form {
    padding: 20px;
    margin: 20px;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
}
</style>