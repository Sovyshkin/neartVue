
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api.js';

export const useMainStore = defineStore('main', () => {
  const showError = ref(false);
  const showSuccess = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const loading = ref(false);
  const isPageLoading = ref(false);
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');

  function showErrorMsg(msg) {
    errorMessage.value = msg;
    showError.value = true;
    setTimeout(hideMessages, 5000);
  }
  function showSuccessMsg(msg) {
    successMessage.value = msg;
    showSuccess.value = true;
    setTimeout(hideMessages, 4000); 
  }
  function hideMessages() {
    showError.value = false;
    showSuccess.value = false;
    errorMessage.value = '';
    successMessage.value = '';
  }

  function setPageLoading(isLoading) {
    isPageLoading.value = isLoading;
  }
  async function sendCode(email) {
    loading.value = true;
    try {
      const res = await api.auth.sendCode(email);
      showSuccessMsg(res.data.message || 'Код отправлен на email');
      return true;
    } catch (err) {
      let errorMsg = 'Ошибка отправки кода';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error?.message) {
        errorMsg = err.response.data.error.message;
      }
      showErrorMsg(errorMsg);
      return false;
    } finally {
      loading.value = false;
    }
  }
  async function verifyCode(email, code) {
    loading.value = true;
    try {
      const res = await api.auth.verifyCode(email, code);
      user.value = res.data.user;
      token.value = res.data.jwt;
      localStorage.setItem('token', res.data.jwt);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('id', res.data.user.id.toString());
      showSuccessMsg('Успешная авторизация');
      return true;
    } catch (err) {
      let errorMsg = 'Ошибка авторизации';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error?.message) {
        errorMsg = err.response.data.error.message;
      }
      showErrorMsg(errorMsg);
      return false;
    } finally {
      loading.value = false;
    }
  }
  function logout() {
    console.log('Manual logout initiated');
    user.value = null;
    token.value = '';
    // Очищаем данные пользователя из localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    localStorage.removeItem('cart_id');
    localStorage.removeItem('userAvatar');
    
    // Обновляем счетчики корзины и избранного
    triggerCartUpdate();
    triggerFavoritesUpdate();
    
    showSuccessMsg('Вы вышли из аккаунта');
  }

  // Функция для принудительного выхода (только при явном желании пользователя)
  function forceLogout() {
    logout();
  }

  // Функция для проверки токена и автоматического обновления
  async function checkAndRefreshToken() {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return false;

    try {
      // Проверяем токен через API
      const response = await api.auth.me();
      if (response.data) {
        user.value = response.data;
        return true;
      }
    } catch (err) {
      // Логируем ошибку, но НЕ выходим из аккаунта
      console.log('Token check failed:', err.response?.status || 'No status', err.response?.data || err.message || 'No error data');
      
      // Только при критических ошибках авторизации (например, токен недействителен)
      // и то только если это касается самой проверки токена, а не других API
      if (err.response?.status === 401 && err.config?.url?.includes('/users/me')) {
        try {
          const refreshResponse = await api.post('/email-auth/refresh-token', {
            refreshToken: currentToken
          });
          
          if (refreshResponse.data?.jwt) {
            token.value = refreshResponse.data.jwt;
            user.value = refreshResponse.data.user;
            localStorage.setItem('token', refreshResponse.data.jwt);
            return true;
          }
        } catch (refreshErr) {
          // Даже если обновление не удалось, НЕ выходим автоматически
          console.log('Token refresh failed, but keeping user logged in');
          return false;
        }
      }
    }
    return false;
  }

  // Инициализация при загрузке приложения
  function initAuth() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken;
        user.value = JSON.parse(savedUser);
        // Проверяем токен в фоне
        checkAndRefreshToken();
        
        // Устанавливаем периодическую проверку токена каждые 30 минут
        setInterval(() => {
          if (token.value) {
            checkAndRefreshToken();
          }
        }, 30 * 60 * 1000); // 30 минут
        
      } catch (err) {
        console.error('Error parsing saved user, but keeping token:', err);
        // Даже при ошибке парсинга не выходим, просто очищаем некорректные данные
        token.value = savedToken;
        localStorage.removeItem('user'); // Удаляем только некорректные данные пользователя
      }
    }
  }

  // Событие для обновления счетчиков в хедере
  const cartUpdated = ref(0);
  const favoritesUpdated = ref(0);

  function triggerCartUpdate() {
    cartUpdated.value++;
  }

  function triggerFavoritesUpdate() {
    favoritesUpdated.value++;
  }

  return {
    showError,
    showSuccess,
    errorMessage,
    successMessage,
    loading,
    isPageLoading,
    user,
    token,
    cartUpdated,
    favoritesUpdated,
    showErrorMsg,
    showSuccessMsg,
    hideMessages,
    setPageLoading,
    sendCode,
    verifyCode,
    logout,
    forceLogout,
    checkAndRefreshToken,
    initAuth,
    triggerCartUpdate,
    triggerFavoritesUpdate
  };
});
