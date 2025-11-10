<script>
export default {
  name: "ResetPassword",
  data() {
    return {
      email: "",
      send: false,
      isLoading: false,
      message: "",
      hasError: false
    };
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateReset", false);
    },

    close() {
      this.$emit("close", false);
    },

    async reset() {
      try {
        if (!this.email) {
          this.message = "Введите email адрес";
          this.hasError = true;
          return;
        }

        this.isLoading = true;
        this.hasError = false;
        this.message = "";

        await this.$api.auth.requireResetPassword(this.email);
        
        this.send = true;
        this.message = "Ссылка для восстановления отправлена";
        this.hasError = false;
        
      } catch (err) {
        console.log(err);
        this.message = err.response?.data?.error?.message || "Ошибка при отправке письма";
        this.hasError = true;
      } finally {
        this.isLoading = false;
      }
    },

    closeModal() {
      this.$emit("updateReset", false);
      document.body.style.overflow = "auto";
    },

    getMessageClass() {
      return this.hasError ? 'message-error' : 'message-success';
    }
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  },
};
</script>
<template>
  <div class="reset-modal">
    <!-- Форма восстановления пароля -->
    <div v-if="!send" class="auth-card">
      <!-- Заголовок -->
      <div class="card-header">
        <div class="header-content">
          <h2 class="auth-title">Восстановление пароля</h2>
          <p class="auth-subtitle">Введите ваш email для получения ссылки восстановления</p>
        </div>
        <button class="close-button" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Иконка -->
      <div class="reset-icon">
        <div class="icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M1 12S4 4 12 4S23 12 23 12S20 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div class="lock-overlay">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Форма -->
      <form @submit.prevent="reset" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Email адрес
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Введите ваш email"
            class="form-input"
            :class="{ 'input-error': hasError && !email }"
            required
          />
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading || !email"
        >
          <span v-if="!isLoading">Отправить ссылку</span>
          <div v-else class="button-loading">
            <div class="spinner"></div>
            <span>Отправляем...</span>
          </div>
        </button>
      </form>

      <!-- Сообщение об ошибке -->
      <div v-if="message && hasError" class="message message-error">
        <div class="message-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>{{ message }}</span>
      </div>

      <!-- Информация -->
      <div class="help-info">
        <div class="info-content">
          <h4>Что дальше?</h4>
          <ul>
            <li>Проверьте ваш email на наличие письма с ссылкой восстановления</li>
            <li>Перейдите по ссылке и создайте новый пароль</li>
            <li>Если письмо не пришло, проверьте папку "Спам"</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Сообщение об успешной отправке -->
    <div v-else class="auth-card success-card">
      <!-- Заголовок -->
      <div class="card-header">
        <div class="header-content">
          <h2 class="auth-title">Письмо отправлено!</h2>
          <p class="auth-subtitle">Проверьте ваш email</p>
        </div>
        <button class="close-button" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Иконка успеха -->
      <div class="success-icon">
        <div class="icon-wrapper success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="check-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18203 2.99721 7.13214 4.39828 5.49883C5.79935 3.86553 7.69279 2.72636 9.79619 2.24223C11.8996 1.75809 14.1003 1.94797 16.07 2.79" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Сообщение об успехе -->
      <div class="success-content">
        <p class="success-message">
          Мы отправили ссылку для восстановления пароля на 
          <strong class="email-highlight">{{ email }}</strong>
        </p>
        
        <div class="next-steps">
          <h4>Следующие шаги:</h4>
          <div class="steps-list">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <span>Откройте ваш email</span>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <span>Найдите письмо от нас</span>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <span>Перейдите по ссылке и создайте новый пароль</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка закрытия -->
      <button class="submit-button" @click="closeModal">
        <span>Понятно</span>
      </button>

      <!-- Дополнительная помощь -->
      <div class="additional-help">
        <p>Не получили письмо? Проверьте папку "Спам" или обратитесь в службу поддержки</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  to {
    transform: scale(1);
  }
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.reset-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-card {
  background: white;
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.95);
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  position: relative;
}

.auth-card.success-card {
  text-align: center;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header .header-content {
  flex: 1;
}

.card-header .close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem 1rem;
  border-radius: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-header .close-button:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.auth-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.reset-icon {
  display: flex;
  justify-content: center;
  padding: 1rem 2rem;
}

.reset-icon .icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(232, 51, 110, 0.1), rgba(209, 39, 87, 0.1));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #E8336E;
}

.reset-icon .icon-wrapper .lock-overlay {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 16px; /* Увеличиваем закругление */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #E8336E;
}

.success-icon {
  display: flex;
  justify-content: center;
  padding: 1rem 2rem;
}

.success-icon .icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #10b981;
}

.success-icon .icon-wrapper.success {
  animation: successPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.success-icon .icon-wrapper .check-mark {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 16px; /* Увеличиваем закругление */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #10b981;
}

.auth-form {
  padding: 0 2rem 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-label svg {
  color: #6b7280;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #E8336E;
  background: white;
  box-shadow: 0 0 0 3px rgba(232, 51, 110, 0.1);
}

.form-input.input-error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-input.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.submit-button {
  width: 100%;
  background: linear-gradient(135deg, #E8336E, #d12757);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(232, 51, 110, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.submit-button .button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button .spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 1rem 2rem;
}

.message.message-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message .message-icon {
  flex-shrink: 0;
}

.help-info {
  padding: 0 2rem 2rem;
}

.help-info .info-content {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.help-info .info-content h4 {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.help-info .info-content ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #6b7280;
}

.help-info .info-content ul li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.help-info .info-content ul li:last-child {
  margin-bottom: 0;
}

.success-content {
  padding: 0 2rem 1rem;
}

.success-content .success-message {
  font-size: 1.125rem;
  color: #374151;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.success-content .success-message .email-highlight {
  color: #E8336E;
  font-weight: 600;
}

.success-content .next-steps h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem;
  text-align: left;
}

.success-content .next-steps .steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.success-content .next-steps .steps-list .step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.success-content .next-steps .steps-list .step-item .step-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #E8336E, #d12757);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.success-content .next-steps .steps-list .step-item .step-content {
  flex: 1;
  color: #6b7280;
  font-size: 0.875rem;
}

.additional-help {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.additional-help p {
  margin: 0;
  font-size: 0.875rem;
  color: #9ca3af;
  text-align: center;
  line-height: 1.5;
}

/* Адаптивность */
@media (max-width: 640px) {
  .reset-modal {
    padding: 1rem;
  }

  .auth-card {
    border-radius: 20px;
    margin: 0;
  }

  .card-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .auth-form {
    padding: 0 1.5rem 1rem;
  }

  .help-info {
    padding: 0 1.5rem 1.5rem;
  }

  .success-content {
    padding: 0 1.5rem 1rem;
  }

  .additional-help {
    padding: 1rem 1.5rem 1.5rem;
  }

  .message {
    margin: 1rem 1.5rem;
  }

  .reset-icon,
  .success-icon {
    padding: 1rem 1.5rem;
  }

  .reset-icon .icon-wrapper,
  .success-icon .icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .reset-icon .icon-wrapper .lock-overlay,
  .success-icon .icon-wrapper .check-mark {
    width: 28px;
    height: 28px;
  }
}
</style>
