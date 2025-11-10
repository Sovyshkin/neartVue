<script>
import { useMainStore } from '../stores/main.js';

export default {
  name: "AppLogin",
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      email: "",
      password: "",
      emailFill: false,
      auth: false,
      code: "",
      codeDigits: ['', '', '', ''], // Массив для 4 цифр кода
      codeFill: false,
      message: "",
      status: "",
      isLoading: false,
      id: "",
      resendCooldown: 0,
      resendTimer: null,
      showPassword: false, // Добавляем состояние для показа пароля
    };
  },
  props: ["visible"],
  methods: {
    close() {
      this.$emit("close", false);
    },
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateLogin", false);
    },

    async login() {
      try {
        if (this.email) {
          this.isLoading = true;
          const success = await this.mainStore.sendCode(this.email);
          if (success) {
            this.auth = true;
            this.startResendCooldown();
          }
        } else {
          this.mainStore.showErrorMsg("Введите email");
        }
      } catch (err) {
        console.log(err);
        this.mainStore.showErrorMsg("Ошибка при отправке кода");
      } finally {
        this.isLoading = false;
      }
    },

    async resendCode() {
      try {
        if (this.resendCooldown > 0) return;
        
        this.isLoading = true;
        const success = await this.mainStore.sendCode(this.email);
        if (success) {
          this.startResendCooldown();
        }
      } catch (err) {
        console.log(err);
        this.mainStore.showErrorMsg("Ошибка при отправке кода");
      } finally {
        this.isLoading = false;
      }
    },

    startResendCooldown() {
      this.resendCooldown = 60; // 60 секунд
      this.resendTimer = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) {
          clearInterval(this.resendTimer);
        }
      }, 1000);
    },

    async verify() {
      try {
        if (this.code && this.code.length === 4) {
          this.isLoading = true;
          const success = await this.mainStore.verifyCode(this.email, this.code);
          if (success) {
            // Обновляем localStorage с данными пользователя
            localStorage.setItem("id", this.mainStore.user.id.toString());
            
            // Автоматически закрываем окно после успешной авторизации
            setTimeout(() => {
              this.close(); // Закрываем модальное окно
              document.body.style.overflow = "auto"; // Восстанавливаем прокрутку
              
              // Обновляем счетчики корзины и избранного для авторизованного пользователя
              this.mainStore.triggerCartUpdate();
              this.mainStore.triggerFavoritesUpdate();
              
              // Обновляем заголовок для отображения авторизованного состояния
              this.$parent?.load_info?.();
              // Дополнительно эмитим событие для обновления родительского компонента
              this.$emit("loginSuccess");
            }, 1000);
          }
        } else {
          this.mainStore.showErrorMsg("Введите 4-значный код подтверждения");
        }
      } catch (err) {
        console.log(err);
        this.mainStore.showErrorMsg("Ошибка верификации");
      } finally {
        this.isLoading = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    getMessageClass() {
      if (this.status === '200' || this.message === 'Успешно') {
        return 'message-success';
      }
      return 'message-error';
    },

    // Методы для работы с кодом
    onCodeInput(index, event) {
      const value = event.target.value.replace(/\D/g, ''); // Только цифры
      
      if (value.length > 1) {
        // Если вставили много цифр, распределим их по полям
        const digits = value.slice(0, 4).split('');
        this.codeDigits = [...digits, '', '', '', ''].slice(0, 4);
        this.updateCodeString();
        
        // Фокус на последнее заполненное поле
        const lastIndex = Math.min(digits.length - 1, 3);
        this.$nextTick(() => {
          const inputs = this.$refs.codeInputs;
          if (inputs && inputs[lastIndex]) {
            inputs[lastIndex].focus();
          }
        });
      } else {
        // Обычный ввод одной цифры
        this.codeDigits[index] = value;
        this.updateCodeString();
        
        // Автоматически переходим к следующему полю
        if (value && index < 3) {
          this.$nextTick(() => {
            const inputs = this.$refs.codeInputs;
            if (inputs && inputs[index + 1]) {
              inputs[index + 1].focus();
            }
          });
        }
      }
    },

    onCodeKeydown(index, event) {
      // Backspace - переходим к предыдущему полю
      if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
        this.$nextTick(() => {
          const inputs = this.$refs.codeInputs;
          if (inputs && inputs[index - 1]) {
            inputs[index - 1].focus();
          }
        });
      }
      
      // ArrowLeft/ArrowRight для навигации
      if (event.key === 'ArrowLeft' && index > 0) {
        this.$nextTick(() => {
          this.$refs.codeInputs[index - 1].focus();
        });
      }
      if (event.key === 'ArrowRight' && index < 3) {
        this.$nextTick(() => {
          this.$refs.codeInputs[index + 1].focus();
        });
      }
    },

    onCodePaste(event) {
      event.preventDefault();
      const paste = (event.clipboardData || window.clipboardData).getData('text');
      const digits = paste.replace(/\D/g, '').slice(0, 4).split('');
      
      this.codeDigits = [...digits, '', '', '', ''].slice(0, 4);
      this.updateCodeString();
      
      // Фокус на последнее заполненное поле
      this.$nextTick(() => {
        const lastIndex = Math.min(digits.length - 1, 3);
        const inputs = this.$refs.codeInputs;
        if (inputs && inputs[lastIndex]) {
          inputs[lastIndex].focus();
        }
      });
    },

    updateCodeString() {
      this.code = this.codeDigits.join('');
    },
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  },
  beforeUnmount() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  },
};
</script>
<template>
  <div class="login-modal">
    <!-- Форма входа -->
    <div v-if="!auth" class="auth-card">
      <!-- Заголовок -->
      <div class="card-header">
        <div class="header-content">
          <h2 class="auth-title">Добро пожаловать</h2>
          <p class="auth-subtitle">Войдите в свой аккаунт</p>
        </div>
        <button class="close-button" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Форма -->
      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
            </svg>
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Введите ваш email"
            class="form-input"
            :class="{ 'input-error': emailFill }"
            required
          />
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading || !email"
        >
          <span v-if="!isLoading">Отправить код</span>
          <div v-else class="button-loading">
            <div class="spinner"></div>
            <span>Отправляем...</span>
          </div>
        </button>
      </form>

      <!-- Сообщение -->
      <div v-if="message" class="message" :class="getMessageClass()">
        <div class="message-icon">
          <svg v-if="status === '200'" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18203 2.99721 7.13214 4.39828 5.49883C5.79935 3.86553 7.69279 2.72636 9.79619 2.24223C11.8996 1.75809 14.1003 1.94797 16.07 2.79" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>{{ message }}</span>
      </div>

      <!-- Переключение на регистрацию -->
      <div class="auth-switch">
        <span>Ещё не зарегистрированы?</span>
        <button type="button" class="switch-button" @click="$emit('goReg', true)">
          Создать аккаунт
        </button>
      </div>
    </div>

    <!-- Форма подтверждения -->
    <div v-else class="auth-card">
      <!-- Заголовок -->
      <div class="card-header">
        <div class="header-content">
          <h2 class="auth-title">Подтверждение</h2>
          <p class="auth-subtitle">Мы отправили код на {{ email }}</p>
        </div>
        <button class="close-button" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Иконка почты -->
      <div class="verification-icon">
        <div class="icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Форма кода -->
      <form @submit.prevent="verify" class="auth-form">
        <div class="form-group">
          <label class="form-label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2"/>
            </svg>
            Введите 4-значный код
          </label>
          <div class="code-inputs">
            <input
              v-for="(digit, index) in codeDigits"
              :key="index"
              ref="codeInputs"
              type="text"
              :value="digit"
              @input="onCodeInput(index, $event)"
              @keydown="onCodeKeydown(index, $event)"
              @paste="onCodePaste"
              class="code-digit-input"
              :class="{ 'input-error': codeFill }"
              maxlength="1"
              pattern="[0-9]"
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading || code.length !== 4"
        >
          <span v-if="!isLoading">Подтвердить</span>
          <div v-else class="button-loading">
            <div class="spinner"></div>
            <span>Проверяем...</span>
          </div>
        </button>
      </form>

      <!-- Повторная отправка -->
      <div class="resend-section">
        <button 
          @click="resendCode" 
          :disabled="resendCooldown > 0 || isLoading"
          class="resend-button"
          :class="{ 'button-disabled': resendCooldown > 0 }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C9.5 21 7.26 19.94 5.86 18.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 18V12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="resendCooldown > 0">
            Повторить через {{ resendCooldown }}с
          </span>
          <span v-else>
            Отправить код повторно
          </span>
        </button>
      </div>

      <!-- Сообщение -->
      <div v-if="message" class="message" :class="getMessageClass()">
        <div class="message-icon">
          <svg v-if="status === '200'" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18203 2.99721 7.13214 4.39828 5.49883C5.79935 3.86553 7.69279 2.72636 9.79619 2.24223C11.8996 1.75809 14.1003 1.94797 16.07 2.79" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Современная модальная форма входа */
.login-modal {
  position: relative;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

/* Карточка авторизации */
.auth-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
}

/* Заголовок */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.auth-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.auth-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.close-button {
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 16px; /* Увеличиваем закругление */
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: 16px;
}

.close-button:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
  color: #dc2626;
}

/* Иконка подтверждения */
.verification-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(232, 51, 110, 0.1) 0%, rgba(209, 39, 87, 0.1) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E8336E;
  animation: pulse-icon 2s ease-in-out infinite;
}

/* Форма */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-label svg {
  color: #E8336E;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  color: #1a202c;
  background: #f8fafc;
  transition: all 0.3s ease;
  outline: none;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  border-color: #E8336E;
  background: white;
  box-shadow: 0 0 0 4px rgba(232, 51, 110, 0.1);
  transform: translateY(-2px);
}

.input-error {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.05);
}

.input-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

/* Стили для квадратов кода */
.code-inputs {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 8px;
}

.code-digit-input {
  width: 64px;
  height: 64px;
  border: 2px solid rgba(229, 231, 235, 1);
  border-radius: 16px;
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(20px);
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
  transition: all 0.3s ease;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.code-digit-input:focus {
  border-color: #E8336E;
  background: white;
  box-shadow: 0 0 0 4px rgba(232, 51, 110, 0.15), 0 8px 25px rgba(232, 51, 110, 0.1);
  transform: translateY(-2px) scale(1.05);
}

.code-digit-input:not(:placeholder-shown) {
  border-color: #E8336E;
  background: rgba(232, 51, 110, 0.05);
}

.code-digit-input.input-error {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.05);
}

.code-digit-input.input-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
}

/* Кнопки */
.submit-button {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border: none;
  border-radius: 16px;
  padding: 18px 24px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(232, 51, 110, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d12757 0%, #b91c5c 100%);
  transition: left 0.3s ease;
}

.submit-button:hover:not(:disabled)::before {
  left: 0;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(232, 51, 110, 0.4);
}

.submit-button:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
}

.submit-button:disabled:hover::before {
  left: -100%;
}

.submit-button span {
  position: relative;
  z-index: 1;
  transition: opacity 0.2s ease;
}

.submit-button span:not(.button-loading span) {
  animation: fadeIn 0.3s ease-in-out;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
  opacity: 1;
  animation: fadeIn 0.3s ease-in-out;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.resend-button {
  background: rgba(232, 51, 110, 0.1);
  border: 2px solid rgba(232, 51, 110, 0.2);
  border-radius: 16px;
  padding: 12px 20px;
  color: #E8336E;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.resend-button:hover:not(.button-disabled) {
  background: rgba(232, 51, 110, 0.2);
  border-color: #E8336E;
  transform: translateY(-1px);
}

.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #9ca3af;
  border-color: #e5e7eb;
  background: #f9fafb;
}

.resend-section {
  text-align: center;
  margin-bottom: 24px;
}

/* Сообщения */
.message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
  border: 2px solid transparent;
}

.message-success {
  background: linear-gradient(135d, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border-color: #34d399;
}

.message-error {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #991b1b;
  border-color: #f87171;
}

.message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Переключение режимов */
.auth-switch {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.switch-button {
  background: none;
  border: none;
  color: #E8336E;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 12px; /* Увеличиваем закругление */
}

.switch-button:hover {
  background: rgba(232, 51, 110, 0.1);
}

/* Анимации */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Адаптивность */

/* Tablets */
@media (max-width: 768px) {
  .auth-overlay {
    padding: 20px;
  }
  
  .auth-card {
    max-width: 90vw;
    width: 100%;
    padding: 36px 28px;
  }
  
  .auth-title {
    font-size: 1.85rem;
  }
  
  .icon-wrapper {
    width: 70px;
    height: 70px;
  }
}

/* Small tablets and large phones */
@media (max-width: 640px) {
  .auth-overlay {
    padding: 16px;
  }
  
  .auth-card {
    padding: 32px 24px;
    border-radius: 20px;
    max-width: 95vw;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
  
  .card-header {
    margin-bottom: 24px;
  }
  
  .auth-form {
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .code-inputs {
    gap: 12px;
  }
  
  .code-digit-input {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
  
  .form-input {
    padding: 14px 18px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .submit-button {
    padding: 16px 20px;
    min-height: 52px;
    font-size: 16px;
  }
  
  .icon-wrapper {
    width: 65px;
    height: 65px;
  }
}

/* Phones */
@media (max-width: 480px) {
  .auth-overlay {
    padding: 12px;
  }
  
  .auth-card {
    padding: 24px 20px;
    max-width: 100vw;
    border-radius: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
  
  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    margin: 0;
    width: 36px;
    height: 36px;
  }
  
  .close-button svg {
    width: 18px;
    height: 18px;
  }
  
  .auth-title {
    font-size: 1.5rem;
    margin: 0;
  }
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .verification-icon {
    margin-bottom: 20px;
  }
  
  .auth-form {
    gap: 18px;
    margin-bottom: 20px;
  }
  
  .form-input {
    padding: 12px 16px;
    border-radius: 12px;
  }
  
  .code-inputs {
    gap: 8px;
  }
  
  .code-digit-input {
    width: 48px;
    height: 48px;
    font-size: 20px;
    border-radius: 12px;
  }
  
  .submit-button {
    padding: 14px 18px;
    min-height: 48px;
    border-radius: 12px;
  }
  
  .auth-links {
    gap: 12px;
  }
  
  .auth-link {
    font-size: 14px;
  }
  
  .error-message {
    padding: 12px;
    font-size: 14px;
    border-radius: 10px;
  }
}

/* Small phones */
@media (max-width: 375px) {
  .auth-overlay {
    padding: 8px;
  }
  
  .auth-card {
    padding: 20px 16px;
    border-radius: 12px;
  }
  
  .auth-title {
    font-size: 1.375rem;
  }
  
  .icon-wrapper {
    width: 56px;
    height: 56px;
  }
  
  .form-input {
    padding: 10px 14px;
    font-size: 16px;
  }
  
  .submit-button {
    padding: 12px 16px;
    min-height: 44px;
    font-size: 15px;
  }
  
  .close-button {
    width: 32px;
    height: 32px;
    top: 12px;
    right: 12px;
  }
  
  .close-button svg {
    width: 16px;
    height: 16px;
  }
}

/* Landscape orientation for phones */
@media (max-height: 500px) and (orientation: landscape) {
  .auth-overlay {
    padding: 8px;
    overflow-y: auto;
  }
  
  .auth-card {
    margin: 8px auto;
    padding: 20px;
    max-height: calc(100vh - 16px);
    overflow-y: auto;
  }
  
  .card-header {
    margin-bottom: 16px;
  }
  
  .icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .auth-title {
    font-size: 1.25rem;
  }
  
  .auth-form {
    gap: 14px;
    margin-bottom: 16px;
  }
}
</style>
