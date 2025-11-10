<script>
import AppLoader from "./AppLoader.vue";
import { useMainStore } from '../stores/main.js';

export default {
  name: "AppProfile",
  components: { AppLoader },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      active: 1,
      id: "",
      email: "",
      admin: false,
      status: "",
      message: "",
      messageType: "success", // success, error, info
      telegram: '',
      username: '',
      first_name: '',
      last_name: '',
      address: "",
      phone: '',
      isLoading: false,
      isSaving: false,
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.phone ? this.phone.replace(/[^+\d]/g, "") : "";
    },
    
    getMessageClass() {
      return {
        'message-success': this.messageType === 'success',
        'message-error': this.messageType === 'error',
        'message-info': this.messageType === 'info'
      };
    },

    hasChanges() {
      // Проверяем, есть ли изменения в форме
      return this.username || this.first_name || this.last_name || this.phone || this.address || this.telegram;
    }
  },
  methods: {
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (input.length > 12) {
        input = input.slice(0, 12);
      }
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.phone = input;
      e.target.value = this.formatPhoneNumber;
    },

    showMessage(text, type = 'info') {
      this.message = text;
      this.messageType = type;
      
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => {
        this.message = "";
      }, 3000);
    },

    async load_info() {
      try {
        this.isLoading = true;
        this.id = localStorage.getItem("id");
        if (this.id) {
          // Получаем данные пользователя напрямую из API
          try {
            let userDetails = await this.$api.users.me();
            
            // Получаем данные из API ответа
            const userData = userDetails.data;
            
            // Основные поля, которые есть в API
            this.email = userData.email || '';
            this.username = userData.username || '';
            this.admin = userData.is_admin || false;
            
            // Дополнительные поля профиля
            this.first_name = userData.first_name || '';
            this.last_name = userData.last_name || '';
            this.phone = userData.phone || '';
            this.address = userData.address || '';
            this.telegram = userData.telegram || '';
            
            // Также обновляем mainStore если данные получены
            if (this.mainStore.user) {
              this.mainStore.user.email = this.email;
              this.mainStore.user.username = this.username;
              this.mainStore.user.first_name = this.first_name;
              this.mainStore.user.last_name = this.last_name;
            }
            
          } catch (detailsError) {
            // Если ошибка аутентификации, перенаправляем на главную
            if (detailsError.response && detailsError.response.status === 401) {
              localStorage.removeItem('id');
              localStorage.removeItem('token');
              this.$router.push({ name: "home" });
              return;
            }
            
            // Устанавливаем базовые данные из localStorage если API не работает
            this.email = localStorage.getItem('email') || '';
            this.username = localStorage.getItem('username') || 'Пользователь';
            this.admin = localStorage.getItem('admin') === 'true';
            
            this.showMessage("Ошибка загрузки данных профиля", "error");
          }
        } else {
          this.$router.push({ name: "home" });
        }
      } catch (err) {
        this.showMessage("Ошибка загрузки профиля", "error");
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile() {
      try {
        this.isSaving = true;
        this.showMessage("Обновление профиля...", "info");
        
        // Создаем объект данных для обновления пользователя (без email)
        const userData = {
          username: this.username,
          first_name: this.first_name,
          last_name: this.last_name,
          phone: this.phone,
          address: this.address,
          telegram: this.telegram,
        };

        let response = await this.$api.users.updateMe(userData);
        
        // Проверяем успешность обновления
        if (response.status === 200 || response.data) {
          this.showMessage("Профиль успешно обновлен!", "success");
          
          // Обновляем данные локально из ответа сервера
          const updatedData = response.data;
          if (updatedData) {
            this.username = updatedData.username || this.username;
            this.first_name = updatedData.first_name || this.first_name;
            this.last_name = updatedData.last_name || this.last_name;
            this.phone = updatedData.phone || this.phone;
            this.address = updatedData.address || this.address;
            this.telegram = updatedData.telegram || this.telegram;
          }
          
          // Обновляем данные в mainStore
          if (this.mainStore.user) {
            this.mainStore.user.username = this.username;
            this.mainStore.user.first_name = this.first_name;
            this.mainStore.user.last_name = this.last_name;
            this.mainStore.user.phone = this.phone;
            this.mainStore.user.address = this.address;
            this.mainStore.user.telegram = this.telegram;
          }
          
        } else {
          this.showMessage("Ошибка при обновлении профиля", "error");
        }
        
      } catch (err) {
        console.error('Ошибка обновления профиля:', err);
        let errorMsg = 'Неизвестная ошибка при обновлении профиля';
        
        if (err.response?.data?.error?.message) {
          errorMsg = err.response.data.error.message;
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        this.showMessage(`Ошибка: ${errorMsg}`, "error");
      } finally {
        this.isSaving = false;
      }
    },

    exit() {
      // Используем store для корректного выхода
      this.mainStore.logout();
      this.$router.push({ name: 'home' });
    },

    setActiveTab(tabNumber) {
      this.active = tabNumber;
    },

    goChange(b) {
      this.$emit("updateAvatar", b);
    },

    check() {
      this.id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      
      if (!this.id || !token) {
        this.$router.push({ name: "home" });
      } else {
        this.load_info();
      }
    },

    goAdmin() {
      this.$router.push({ name: "admin", query: { name: "arts" } });
    },
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.check();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="profile-container" v-else>
    <!-- Основной контент -->
    <div class="profile-content">
      <!-- Карточка профиля -->
      <div class="profile-main-card">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-container">
              <div class="avatar-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="profile-basic-info">
              <h2 class="user-name">{{ username || first_name || 'Пользователь' }}</h2>
              <p class="user-email">{{ email }}</p>
              <div class="user-status">
                <div class="status-indicator"></div>
                <span>Активный пользователь</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Навигация по разделам -->
        <div class="profile-navigation">
          <button 
            @click="setActiveTab(1)"
            class="nav-item"
            :class="{ active: active === 1 }"
          >
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="nav-content">
              <span class="nav-title">Персональные данные</span>
              <span class="nav-subtitle">Основная информация</span>
            </div>
          </button>

          <button 
            @click="setActiveTab(2)"
            class="nav-item"
            :class="{ active: active === 2 }"
          >
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V8L15 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 3V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="nav-content">
              <span class="nav-title">Контактная информация</span>
              <span class="nav-subtitle">Адрес и телефон</span>
            </div>
          </button>

          <button 
            @click="exit"
            class="nav-item logout-button"
          >
            <div class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="nav-content">
              <span class="nav-title">Выйти</span>
              <span class="nav-subtitle">Завершить сессию</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Контент разделов -->
      <div class="profile-sections">
        <!-- Персональные данные -->
        <div v-if="active === 1" class="section-card">
          <div class="section-header">
            <h3 class="section-title">Персональные данные</h3>
            <p class="section-description">Обновите вашу основную информацию</p>
          </div>
          
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="username" class="form-label">Имя пользователя</label>
                <div class="input-wrapper">
                  <input
                    id="username"
                    v-model="username"
                    type="text"
                    class="form-input"
                    placeholder="Введите имя пользователя"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <div class="input-wrapper">
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-input"
                    placeholder="your@email.com"
                    disabled
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="first_name" class="form-label">Имя</label>
                <div class="input-wrapper">
                  <input
                    id="first_name"
                    v-model="first_name"
                    type="text"
                    class="form-input"
                    placeholder="Ваше имя"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="last_name" class="form-label">Фамилия</label>
                <div class="input-wrapper">
                  <input
                    id="last_name"
                    v-model="last_name"
                    type="text"
                    class="form-input"
                    placeholder="Ваша фамилия"
                  />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="isSaving || !hasChanges"
              >
                <svg v-if="isSaving" width="20" height="20" viewBox="0 0 24 24" fill="none" class="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                  <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z" opacity="0.75"/>
                </svg>
                <span v-else>Сохранить изменения</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Контактная информация -->
        <div v-if="active === 2" class="section-card">
          <div class="section-header">
            <h3 class="section-title">Контактная информация</h3>
            <p class="section-description">Укажите способы связи с вами</p>
          </div>
          
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="address" class="form-label">Адрес</label>
                <div class="input-wrapper">
                  <textarea
                    id="address"
                    v-model="address"
                    class="form-textarea"
                    placeholder="Введите ваш адрес"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Телефон</label>
                <div class="input-wrapper">
                  <input
                    id="phone"
                    v-model="phone"
                    type="tel"
                    class="form-input"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="telegram" class="form-label">Telegram</label>
                <div class="input-wrapper">
                  <input
                    id="telegram"
                    v-model="telegram"
                    type="text"
                    class="form-input"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="isSaving || !hasChanges"
              >
                <svg v-if="isSaving" width="20" height="20" viewBox="0 0 24 24" fill="none" class="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                  <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z" opacity="0.75"/>
                </svg>
                <span v-else>Сохранить изменения</span>
              </button>
            </div>
          </form>
        </div>


      </div>
    </div>

    <!-- Сообщения -->
    <div v-if="message" class="notification" :class="getMessageClass">
      <div class="notification-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path v-if="messageType === 'success'" d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
          <path v-else-if="messageType === 'error'" d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
          <path v-else d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>{{ message }}</span>
        <button @click="message = ''" class="notification-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Основной контейнер профиля */
.profile-container {
  width: 100%;
  margin: 0 auto;
  padding: 40px 60px;
  min-height: 100vh;
}

/* Основной контент */
.profile-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 32px;
}

/* Карточка профиля (навигация) */
.profile-main-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  height: fit-content;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.profile-header {
  padding: 32px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-container {
  margin-bottom: 20px;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.profile-basic-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: white;
}

.user-email {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 16px;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  opacity: 0.9;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Навигация */
.profile-navigation {
  padding: 8px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: none;
  background: transparent;
  border-radius: 20px; /* Увеличиваем закругление */
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  margin-bottom: 4px;
}

.nav-item:hover {
  background: rgba(232, 51, 110, 0.1);
}

.nav-item.active {
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
}

.nav-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(232, 51, 110, 0.1);
  border-radius: 16px; /* Увеличиваем закругление */
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon {
  background: rgba(255, 255, 255, 0.2);
}

.nav-content {
  flex: 1;
}

.nav-title {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.nav-subtitle {
  display: block;
  font-size: 0.8rem;
  opacity: 0.7;
}

.nav-item.active .nav-subtitle {
  opacity: 0.9;
}

/* Кнопка выхода */
.logout-button {
  border: 2px solid rgba(220, 38, 38, 0.2) !important;
  background: rgba(220, 38, 38, 0.05) !important;
}

.logout-button:hover {
  border-color: rgba(220, 38, 38, 0.3) !important;
  background: rgba(220, 38, 38, 0.1) !important;
  transform: translateY(-2px);
}

.logout-button .nav-icon {
  color: #dc2626 !important;
}

.logout-button .nav-title {
  color: #dc2626 !important;
}

.logout-button .nav-subtitle {
  color: #dc2626 !important;
  opacity: 0.7;
}

/* Секции контента */
.profile-sections {
  min-height: 500px;
}

.section-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.section-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* Формы */
.profile-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
}

/* Специальный стиль для полей пароля */
.password-wrapper {
  position: relative;
}

.password-input {
  padding-right: 56px !important;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 12px; /* Увеличиваем закругление */
  transition: all 0.2s ease;
  z-index: 10;
}

.password-toggle:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

.password-toggle:focus {
  outline: none;
  color: #E8336E;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 16px; /* Увеличиваем закругление */
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #E8336E;
  box-shadow: 0 0 0 3px rgba(232, 51, 110, 0.1);
}

.form-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  border-radius: 16px; /* Закругляем textarea */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  color: white;
  border: none;
  border-radius: 16px; /* Увеличиваем закругление */
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(232, 51, 110, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  padding: 12px 24px;
  background: rgba(232, 51, 110, 0.1);
  color: #E8336E;
  border: 1px solid rgba(232, 51, 110, 0.2);
  border-radius: 16px; /* Увеличиваем закругление */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(232, 51, 110, 0.2);
}

.btn-danger {
  padding: 12px 24px;
  background: #dc3545;
  color: white;
  border: 1px solid #dc3545;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #c82333;
  border-color: #c82333;
}

.security-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Секция безопасности */
.security-grid {
  display: grid;
  gap: 24px;
}

.security-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: rgba(232, 51, 110, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(232, 51, 110, 0.1);
}

/* Форма смены пароля */
.password-change-form {
  background: rgba(232, 51, 110, 0.03);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(232, 51, 110, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.form-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.btn-close {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 12px; /* Увеличиваем закругление */
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
}

.password-form,
.verification-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.verification-info {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 16px; /* Увеличиваем закругление */
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.info-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px; /* Увеличиваем закругление */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.verification-info h5 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.verification-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.btn-link {
  background: none;
  border: none;
  color: #e8336e;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  transition: opacity 0.2s ease;
}

.btn-link:hover {
  opacity: 0.8;
}

.btn-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.security-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #E8336E 0%, #d12757 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.security-content h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.security-content p {
  color: #6b7280;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

/* Уведомления */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  margin-left: auto;
}

.notification-close:hover {
  opacity: 1;
}

.message-success {
  background: rgba(34, 197, 94, 0.9);
  color: white;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.message-error {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.message-info {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 1200px) {
  .profile-container {
    padding: 32px;
  }
  
  .profile-content {
    grid-template-columns: 320px 1fr;
    gap: 24px;
  }
}

@media (max-width: 900px) {
  .profile-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .profile-container {
    padding: 20px;
  }
  
  .header-content,
  .section-card {
    padding: 24px;
  }
  
  .profile-header {
    padding: 24px;
  }
  
  .header-info h1 {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .security-item {
    flex-direction: column;
    text-align: center;
  }
  
  .form-actions {
    justify-content: stretch;
  }
  
  .btn-primary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 16px;
  }
  
  .header-content,
  .section-card,
  .profile-header {
    padding: 20px;
  }
  
  .nav-item {
    padding: 12px 16px;
  }
  
  .avatar-placeholder {
    width: 60px;
    height: 60px;
  }
}
</style>

