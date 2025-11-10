import axios from 'axios';

// Создаем экземпляр axios с базовым URL для Strapi API
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Создаем отдельный экземпляр для auth endpoints (без /api)
const authApi = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления JWT токена к запросам (оба экземпляра)
const addTokenInterceptor = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleRequestError = (error) => {
  return Promise.reject(error);
};

api.interceptors.request.use(addTokenInterceptor, handleRequestError);
authApi.interceptors.request.use(addTokenInterceptor, handleRequestError);

// Интерцептор для обработки ответов (оба экземпляра)
const handleResponse = (response) => {
  // Если в ответе есть новый токен, обновляем его
  if (response.data?.jwt) {
    localStorage.setItem('token', response.data.jwt);
  }
  return response;
};

const handleResponseError = (error) => {
  // Убираем автоматический logout при любых ошибках
  // Пользователь остается в системе независимо от ошибок сервера
  console.log('API Error:', error.response?.status, error.response?.data);
  return Promise.reject(error);
};

api.interceptors.response.use(handleResponse, handleResponseError);
authApi.interceptors.response.use(handleResponse, handleResponseError);

const resolveArtworkReference = (artworkRef) => {
  if (artworkRef && typeof artworkRef === 'object') {
    return {
      id: artworkRef.id ?? artworkRef.attributes?.id ?? null,
      documentId: artworkRef.documentId ?? artworkRef.attributes?.documentId ?? null,
    };
  }

  if (typeof artworkRef === 'number') {
    return { id: artworkRef, documentId: null };
  }

  if (typeof artworkRef === 'string') {
    return { id: null, documentId: artworkRef };
  }

  return { id: null, documentId: null };
};

const getEntryDocumentId = (entry) => entry?.documentId || entry?.id;

const getRelatedArtworkData = (entry) => {
  if (!entry) return null;

  if (entry.artwork) {
    return entry.artwork;
  }

  const attributesArtwork = entry.attributes?.artwork;
  if (attributesArtwork?.data) {
    return {
      ...attributesArtwork.data,
      ...attributesArtwork.data.attributes,
    };
  }

  return null;
};

const apiMethods = {
  // Аутентификация (используем authApi без /api)
  auth: {
    sendCode: (email) => authApi.post('/email-auth/send-code', { email }),
    verifyCode: (email, code) => authApi.post('/email-auth/verify-code', { email, code }),
    register: (userData) => authApi.post('/auth/local/register', userData),
    resetPassword: (request_id, new_password) => authApi.post('/users/resetPassword', { request_id, new_password }),
    requireResetPassword: (email) => authApi.post(`/users/requireResetPassword?email=${email}`),
    validateToken: () => authApi.post('/auth/validate'),
    // Методы для смены пароля
    sendPasswordResetCode: (data) => authApi.post('/auth/send-password-change-code', data),
    changePassword: (data) => authApi.post('/auth/change-password', data),
  },

  // Картины
  artworks: {
    getAll: (params = {}) => api.get('/artworks', { params: { populate: ['images', 'artist.avatar'], ...params } }),
    getForHomepage: (params = {}) => api.get('/artworks', { 
      params: { 
        populate: ['images', 'artist.avatar'],
        filters: {
          showOnHomepage: true
        },
        ...params 
      } 
    }),
    getOne: (id) => api.get(`/artworks/${id}`, { params: { populate: ['images', 'artist.avatar'] } }),
    create: (data) => api.post('/artworks', { data }),
    update: (id, data) => api.put(`/artworks/${id}`, { data }),
    delete: (id) => api.delete(`/artworks/${id}`),
  },

  // Пользователи (включая художников)
  users: {
    me: () => api.get('/users/me', { params: { populate: ['avatar', 'artworks.images'] } }),
    update: (id, data) => api.put(`/users/${id}`, { data }),
    updateMe: async (data) => {
      // Получаем ID пользователя из localStorage
      const userId = localStorage.getItem('id');
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }
      
      console.log('Обновляем пользователя ID:', userId, 'с данными:', data);
      
      try {
        // Используем стандартный Strapi endpoint для обновления пользователя
        const response = await api.put(`/users/${userId}`, data);
        console.log('API response:', response);
        return response;
      } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        throw error;
      }
    },
    getArtists: (params = {}) => api.get('/users', { 
      params: { 
        filters: { isArtist: { $eq: true } },
        populate: ['avatar', 'artworks.images'], 
        ...params 
      } 
    }),
    getOne: (id) => api.get(`/users/${id}`, { params: { populate: ['avatar', 'artworks.images'] } }),
    delete: (id) => api.delete(`/users/${id}`),
  },

  // Тикеты
  tickets: {
    getAll: (params = {}) => api.get('/tickets', { params: { populate: ['responses.user'], ...params } }),
    getOne: (id) => api.get(`/tickets/${id}`, { params: { populate: ['responses.user'] } }),
    create: (data) => api.post('/tickets', { data }),
    update: (id, data) => api.put(`/tickets/${id}`, { data }),
    delete: (id) => api.delete(`/tickets/${id}`),
    getMessages: (ticket_id) => authApi.post('/tickets/messages/get/all', { ticket_id }),
    sendMessage: (ticket_id, text) => authApi.post('/tickets/messages/create', { ticket_id, text }),
    close: (id) => authApi.post('/tickets/close', { id }),
  },

  // Ответы на тикеты
  ticketResponses: {
    create: (data) => api.post('/ticket-responses', { data }),
  },

  // Заказы
  orders: {
    getAll: (params = {}) => api.get('/orders', { params: { populate: ['payment'], ...params } }),
    getOne: (id) => api.get(`/orders/${id}`, { params: { populate: ['payment'] } }),
    create: (data) => {
      // Если data уже содержит обертку { data: {...} }, используем как есть
      // Иначе оборачиваем
      const payload = data.data ? data : { data };
      return api.post('/orders', payload);
    },
    update: (id, data) => api.put(`/orders/${id}`, { data }),
    delete: (id) => api.delete(`/orders/${id}`),
  },

  // Платежи
  payments: {
    getAll: (params = {}) => api.get('/payments', { params: { populate: ['order'], ...params } }),
    getOne: (id) => api.get(`/payments/${id}`, { params: { populate: ['order.artwork'] } }),
    create: (data) => api.post('/payments', { data }),
    update: (id, data) => api.put(`/payments/${id}`, { data }),
  },

  // Загрузка файлов
  upload: {
    files: (files) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      return api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  },

  // Избранное
  favorites: {
    getAll: () => {
      const userId = localStorage.getItem('id');
      if (!userId) {
        return Promise.resolve({ data: { data: [] } });
      }
      
      return api.get('/favorites', { 
        params: { 
          filters: {
            user: { id: { $eq: userId } }
          },
          populate: ['artwork.images', 'artwork.artist.avatar'] 
        } 
      });
    },
    add: async (artworkRef) => {
      const { id, documentId } = resolveArtworkReference(artworkRef);

      if (!id && documentId) {
        throw new Error('Не удалось определить числовой ID произведения для добавления в избранное');
      }

      if (!id) {
        throw new Error('Некорректный идентификатор произведения для добавления в избранное');
      }

      // Проверяем, есть ли товар уже в избранном
      try {
        const existingItems = await api.get('/favorites', {
          params: {
            filters: { 
              artwork: { id: { $eq: id } },
              user: { id: { $eq: localStorage.getItem('id') } }
            },
            populate: ['artwork.images', 'artwork.artist.avatar']
          }
        });

        if (existingItems.data.data && existingItems.data.data.length > 0) {
          // Товар уже в избранном - возвращаем ошибку 409
          const error = new Error('Произведение уже в избранном');
          error.response = { status: 409 };
          throw error;
        }
      } catch (err) {
        // Если это наша ошибка 409, пробрасываем её дальше
        if (err.response && err.response.status === 409) {
          throw err;
        }
        // Иначе логируем и продолжаем добавление
        console.log('Ошибка при проверке избранного:', err);
      }

      return api.post('/favorites', { 
        data: { 
          artwork: id,
          user: localStorage.getItem('id')
        } 
      });
    },
    remove: (artworkRef) => {
      const { id, documentId } = resolveArtworkReference(artworkRef);

      if (!documentId && !id) {
        throw new Error('Некорректный идентификатор произведения для удаления из избранного');
      }

      const artworkFilter = documentId 
        ? { documentId: { $eq: documentId } }
        : { id: { $eq: id } };

      // Для удаления нужно найти ID записи в избранном
      return api.get('/favorites', { 
        params: { 
          filters: { artwork: artworkFilter },
          populate: ['artwork.images', 'artwork.artist.avatar']
        } 
      }).then(response => {
        const favorite = response.data.data.find(fav => {
          const artworkData = getRelatedArtworkData(fav);
          if (!artworkData) return false;

          const favoriteDocumentId = artworkData.documentId ?? artworkData.attributes?.documentId;
          const favoriteId = artworkData.id ?? artworkData.attributes?.id;

          return (documentId && favoriteDocumentId === documentId) || (id && favoriteId === id);
        });
        if (favorite) {
          return api.delete(`/favorites/${getEntryDocumentId(favorite)}`);
        }
        throw new Error('Favorite not found');
      });
    },
    removeById: (favoriteId) => {
      if (!favoriteId) {
        throw new Error('ID записи избранного не предоставлен');
      }
      return api.delete(`/favorites/${favoriteId}`);
    },
  },

  // Корзина
  cart: {
    getAll: () => {
      const userId = localStorage.getItem('id');
      if (!userId) {
        return Promise.resolve({ data: { data: [] } });
      }
      
      return api.get('/cart-items', { 
        params: { 
          filters: {
            user: { id: { $eq: userId } }
          },
          populate: {
            artwork: {
              populate: ['images', 'artist']
            }
          }
        } 
      });
    },
    add: async (artworkRef, quantity = 1) => {
      const { id, documentId } = resolveArtworkReference(artworkRef);

      if (!id && documentId) {
        throw new Error('Не удалось определить числовой ID произведения для добавления в корзину');
      }

      if (!id) {
        throw new Error('Некорректный идентификатор произведения для добавления в корзину');
      }

      // Проверяем, есть ли товар уже в корзине
      try {
        const existingItems = await api.get('/cart-items', {
          params: {
            filters: { 
              artwork: { id: { $eq: id } },
              user: { id: { $eq: localStorage.getItem('id') } }
            },
            populate: {
              artwork: {
                populate: ['images', 'artist']
              }
            }
          }
        });

        if (existingItems.data.data && existingItems.data.data.length > 0) {
          // Товар уже в корзине - возвращаем ошибку 409
          const error = new Error('Товар уже добавлен в корзину');
          error.response = { status: 409 };
          throw error;
        }
      } catch (err) {
        // Если это наша ошибка 409, пробрасываем её дальше
        if (err.response && err.response.status === 409) {
          throw err;
        }
        // Иначе логируем и продолжаем добавление
        console.log('Ошибка при проверке корзины:', err);
      }

      return api.post('/cart-items', { 
        data: { 
          artwork: id,
          user: localStorage.getItem('id'),
          quantity: quantity
        } 
      });
    },
    remove: (artworkRef) => {
      const { id, documentId } = resolveArtworkReference(artworkRef);

      if (!documentId && !id) {
        throw new Error('Некорректный идентификатор произведения для удаления из корзины');
      }

      const artworkFilter = documentId 
        ? { documentId: { $eq: documentId } }
        : { id: { $eq: id } };

      // Для удаления нужно найти ID записи в корзине
      return api.get('/cart-items', { 
        params: { 
          filters: { artwork: artworkFilter },
          populate: ['artwork.images', 'artwork.artist.avatar']
        } 
      }).then(response => {
        const cartItem = response.data.data.find(item => {
          const artworkData = getRelatedArtworkData(item);
          if (!artworkData) return false;

          const itemDocumentId = artworkData.documentId ?? artworkData.attributes?.documentId;
          const itemId = artworkData.id ?? artworkData.attributes?.id;

          return (documentId && itemDocumentId === documentId) || (id && itemId === id);
        });
        if (cartItem) {
          return api.delete(`/cart-items/${getEntryDocumentId(cartItem)}`);
        }
        throw new Error('Cart item not found');
      });
    },
  },

  // Обратная связь
  feedback: {
    create: (data) => api.post('/feedbacks', { data }),
  },

  // Платежи Tinkoff
  payment: {
    initTinkoff: (data) => api.post('/payment/tinkoff/init', data),
  },

  // Прямой доступ к методам axios
  post: (url, data) => api.post(url, data),
  get: (url, config) => api.get(url, config),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};

// Добавляем authApi в экспорт
apiMethods.authApi = authApi;

export default apiMethods;