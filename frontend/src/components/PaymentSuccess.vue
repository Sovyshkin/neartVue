<template>
  <div class="payment-result">
    <div class="success-container">
      <div class="success-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>
      
      <h1>Оплата прошла успешно!</h1>
      <p class="success-message">
        Ваш заказ № {{ orderId }} успешно оформлен и оплачен.<br>
        В ближайшее время с вами свяжется наш менеджер для уточнения деталей доставки.
      </p>
      
      <div class="order-info" v-if="orderData">
        <h3>Детали заказа:</h3>
        <div class="info-row">
          <span>Сумма:</span>
          <span>{{ orderData.totalAmount }} ₽</span>
        </div>
        <div class="info-row">
          <span>Email:</span>
          <span>{{ orderData.email }}</span>
        </div>
        <div class="info-row">
          <span>Телефон:</span>
          <span>{{ orderData.phone }}</span>
        </div>
        <div class="info-row">
          <span>Адрес доставки:</span>
          <span>{{ orderData.city }}, {{ orderData.address }}</span>
        </div>
      </div>
      
      <div class="next-steps">
        <h3>Что дальше?</h3>
        <ul>
          <li>На указанный email отправлено подтверждение заказа</li>
          <li>Менеджер свяжется с вами в течение 24 часов</li>
          <li>Доставка осуществляется в течение 3-7 рабочих дней</li>
          <li>Вы получите трек-номер для отслеживания посылки</li>
        </ul>
      </div>
      
      <div class="action-buttons">
        <router-link to="/" class="btn btn-primary">
          На главную
        </router-link>
        <router-link to="/arts" class="btn btn-secondary">
          Смотреть каталог
        </router-link>
        <a href="https://t.me/vselena_deva" target="_blank" class="btn btn-contact">
          Связаться с нами
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentSuccess',
  data() {
    return {
      orderId: null,
      orderData: null,
      isLoading: true
    }
  },
  async mounted() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    this.orderId = urlParams.get('OrderId');
    
    if (this.orderId) {
      await this.loadOrderData();
    }
    
    this.isLoading = false;
  },
  methods: {
    async loadOrderData() {
      try {
        const response = await this.$api.get(`/orders/${this.orderId}`, {
          params: {
            populate: ['items', 'items.artwork']
          }
        });
        
        this.orderData = response.data.data;
      } catch (error) {
        console.error('Error loading order data:', error);
      }
    }
  }
}
</script>

<style scoped>
.payment-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.success-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.success-icon {
  color: #22c55e;
  margin-bottom: 30px;
}

.success-icon svg {
  margin: 0 auto;
}

h1 {
  color: #22c55e;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 700;
}

.success-message {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.order-info {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  text-align: left;
}

.order-info h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row span:first-child {
  color: #666;
  font-weight: 500;
}

.info-row span:last-child {
  color: #333;
  font-weight: 600;
}

.next-steps {
  text-align: left;
  margin-bottom: 40px;
}

.next-steps h3 {
  color: #333;
  font-size: 20px;
  margin-bottom: 15px;
}

.next-steps ul {
  color: #666;
  line-height: 1.8;
}

.next-steps li {
  margin-bottom: 8px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: #E8336E;
  color: white;
}

.btn-primary:hover {
  background: #d12757;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(232, 51, 110, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(108, 117, 125, 0.3);
}

.btn-contact {
  background: #0088cc;
  color: white;
}

.btn-contact:hover {
  background: #0077b3;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 136, 204, 0.3);
}

@media (max-width: 768px) {
  .success-container {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 28px;
  }
  
  .success-message {
    font-size: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>