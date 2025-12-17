'use strict';

import crypto from 'crypto';

// Типы для CDEK API
interface CdekTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface CdekTariff {
  tariff_code: number;
  delivery_sum: number;
  period_min: number;
  period_max: number;
}

interface CdekCalculateResponse {
  tariff_codes: CdekTariff[];
}

interface CdekOrderResponse {
  entity: {
    uuid: string;
  };
  requests?: Array<{
    request_uuid: string;
    type: string;
    state: string;
  }>;
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

export default {
  async getToken(ctx) {
    try {
      const token = await getAccessToken();
      
      ctx.body = {
        success: true,
        token: token,
        expires_in: tokenExpiry ? Math.floor((tokenExpiry - Date.now()) / 1000) : 3600
      };
    } catch (error) {
      console.error('CDEK token error:', error);
      ctx.body = {
        success: false,
        error: 'Ошибка получения токена СДЭК',
        details: error.message
      };
    }
  },

  async getDeliveryPoints(ctx) {
    try {
      const { city, type } = ctx.query;
      const API_URL = process.env.CDEK_API_URL || 'https://api.edu.cdek.ru/v2';
      
      // Получаем токен
      const token = await getAccessToken();
      
      let url = `${API_URL}/deliverypoints`;
      const params = new URLSearchParams();
      
      if (city) params.append('city', city);
      if (type) params.append('type', type);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      ctx.body = {
        success: true,
        points: data
      };
    } catch (error) {
      console.error('CDEK delivery points error:', error);
      ctx.body = {
        success: false,
        error: 'Ошибка получения пунктов выдачи'
      };
    }
  },

  async calculateDelivery(ctx) {
    try {
      const { from_location, to_location, packages } = ctx.request.body;
      const API_URL = process.env.CDEK_API_URL || 'https://api.edu.cdek.ru/v2';
      
      // Получаем токен
      const token = await getAccessToken();
      console.log('Using CDEK token for calculation:', token.substring(0, 20) + '...');

      console.log('CDEK Calculate request:', { from_location, to_location, packages });

      const requestData = {
        type: 1, // Доставка до склада (ПВЗ)
        currency: 1, // RUB
        lang: 'rus',
        from_location: from_location || {
          code: 44, // Москва по умолчанию
        },
        to_location: to_location,
        packages: packages || [
          {
            weight: 1000, // 1 кг
            length: 50,
            width: 40,
            height: 10
          }
        ]
      };

      console.log('Sending to CDEK:', JSON.stringify(requestData, null, 2));

      const response = await fetch(`${API_URL}/calculator/tarifflist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`CDEK API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as any;
      console.log('CDEK response:', JSON.stringify(data, null, 2));
      
      ctx.body = {
        success: true,
        tariffs: data.tariff_codes || [],
        rawResponse: data // Для отладки
      };
    } catch (error) {
      console.error('CDEK calculation error:', error);
      ctx.body = {
        success: false,
        error: 'Ошибка расчета стоимости доставки',
        details: error.message
      };
    }
  },

  async createOrder(ctx) {
    try {
      const orderData = ctx.request.body;
      const API_URL = process.env.CDEK_API_URL || 'https://api.edu.cdek.ru/v2';
      
      // Получаем токен
      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json() as CdekOrderResponse;
      
      if (response.ok) {
        ctx.body = {
          success: true,
          order: data
        };
      } else {
        ctx.body = {
          success: false,
          error: data.errors || 'Ошибка создания заказа в СДЭК'
        };
      }
    } catch (error) {
      console.error('CDEK create order error:', error);
      ctx.body = {
        success: false,
        error: 'Ошибка создания заказа в СДЭК'
      };
    }
  },

  async getOrderStatus(ctx) {
    try {
      const { uuid } = ctx.params;
      const API_URL = process.env.CDEK_API_URL || 'https://api.edu.cdek.ru/v2';
      
      // Получаем токен
      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/orders/${uuid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      ctx.body = {
        success: true,
        order: data
      };
    } catch (error) {
      console.error('CDEK order status error:', error);
      ctx.body = {
        success: false,
        error: 'Ошибка получения статуса заказа'
      };
    }
  }
};

// Вспомогательная функция для получения токена
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  // Проверяем кэшированный токен
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('Using cached CDEK token');
    return cachedToken;
  }

  const CDEK_ACCOUNT = process.env.CDEK_ACCOUNT || 'z9GRRu7FxmO53CQ9cFfI6qiy32wpfTkd';
  const CDEK_PASSWORD = process.env.CDEK_PASSWORD || 'w24JTCv4MnAcuRTx0oHjHLDtyt3I3vfz';
  const API_URL = process.env.CDEK_API_URL || 'https://api.edu.cdek.ru/v2';

  console.log('Getting new CDEK token with credentials:', { 
    CDEK_ACCOUNT, 
    CDEK_PASSWORD: CDEK_PASSWORD.substring(0, 10) + '...', 
    API_URL 
  });

  const response = await fetch(`${API_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CDEK_ACCOUNT,
      client_secret: CDEK_PASSWORD,
    }).toString()
  });
  const data = await response.json() as any;
  console.log('CDEK token response:', data);
  if (!data.access_token) {
    // Сбрасываем кэш при ошибке
    cachedToken = null;
    tokenExpiry = null;
    throw new Error('Failed to get CDEK access token: ' + JSON.stringify(data));
  }
  
  cachedToken = data.access_token;
  // Токен действителен expires_in секунд, кэшируем на 1 минуту меньше
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  
  console.log('CDEK token cached successfully, expires at:', new Date(tokenExpiry));
  return cachedToken;
}
