<template>
  <div class="payment-result">
    <div class="error-container">
      <div class="error-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      
      <h1>Ошибка оплаты</h1>
      <p class="error-message">
        К сожалению, не удалось обработать ваш платеж.<br>
        Средства не были списаны с вашего счета.
      </p>
      
      <div class="error-details" v-if="errorCode">
        <h3>Код ошибки:</h3>
        <p>{{ errorCode }}</p>
      </div>
      
      <div class="next-steps">
        <h3>Что можно сделать?</h3>
        <ul>
          <li>Проверьте правильность введенных данных карты</li>
          <li>Убедитесь, что на карте достаточно средств</li>
          <li>Попробуйте использовать другую карту</li>
          <li>Обратитесь в службу поддержки вашего банка</li>
          <li>Свяжитесь с нами для получения помощи</li>
        </ul>
      </div>
      
      <div class="action-buttons">
        <router-link to="/cart" class="btn btn-primary">
          Вернуться в корзину
        </router-link>
        <router-link to="/arts" class="btn btn-secondary">
          Продолжить покупки
        </router-link>
        <a href="https://t.me/vselena_deva" target="_blank" class="btn btn-contact">
          Обратиться в поддержку
        </a>
      </div>
      
      <div class="alternative-payment">
        <h3>Альтернативные способы оплаты:</h3>
        <p>
          Вы также можете связаться с нами напрямую через Telegram 
          для оформления заказа другим способом.
        </p>
        <a href="https://t.me/vselena_deva" target="_blank" class="telegram-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.79-.896 6.728-.896 6.728-.381 1.591-.712 1.809-1.177 1.809-.514 0-.86-.486-.86-1.201 0-.715-.169-5.553-.169-6.105 0-.604.234-.918.717-.918.483 0 .838.299.838.838 0 .486-.21 2.487-.21 3.064 0 .514.169.771.507.771.338 0 .676-.321.676-.771 0-.514-.169-2.232-.169-2.746 0-.486.169-.838.506-.838.338 0 .507.338.507.838z"/>
          </svg>
          Написать в Telegram
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentError',
  data() {
    return {
      errorCode: null,
      orderId: null
    }
  },
  mounted() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    this.errorCode = urlParams.get('ErrorCode');
    this.orderId = urlParams.get('OrderId');
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

.error-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.error-icon {
  color: #ef4444;
  margin-bottom: 30px;
}

.error-icon svg {
  margin: 0 auto;
}

h1 {
  color: #ef4444;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 700;
}

.error-message {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.error-details {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
}

.error-details h3 {
  color: #ef4444;
  margin-bottom: 10px;
  font-size: 18px;
}

.error-details p {
  color: #991b1b;
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
}

.next-steps {
  text-align: left;
  margin-bottom: 30px;
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
  margin-bottom: 30px;
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
  background: #ef4444;
  color: white;
}

.btn-contact:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
}

.alternative-payment {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 15px;
  padding: 25px;
  text-align: left;
}

.alternative-payment h3 {
  color: #0369a1;
  margin-bottom: 15px;
  font-size: 18px;
}

.alternative-payment p {
  color: #075985;
  line-height: 1.6;
  margin-bottom: 20px;
}

.telegram-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #0088cc;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.telegram-link:hover {
  background: #0077b3;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 136, 204, 0.3);
}

@media (max-width: 768px) {
  .error-container {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 28px;
  }
  
  .error-message {
    font-size: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
  
  .telegram-link {
    width: 100%;
    justify-content: center;
  }
}
</style>