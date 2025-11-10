'use strict';

import { factories } from '@strapi/strapi';
import crypto from 'crypto';

export default factories.createCoreController('api::payment.payment', ({ strapi }) => ({
  async initTinkoffPayment(ctx) {
    try {
      const { orderId, amount, description, customerData } = ctx.request.body;
      
      console.log('Tinkoff payment initialization:', { orderId, amount, description, customerData });
      
      // Настройки Т-Банка (получите их в личном кабинете)
      const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY || 'TinkoffBankTest';
      const SECRET_KEY = process.env.TINKOFF_SECRET_KEY || 'TinkoffBankTest';
      
      // Создаем уникальный OrderId с временной меткой
      const uniqueOrderId = `${orderId}-${Date.now()}`;
      
      // Генерируем токен для подписи
      const tokenData = {
        Amount: amount,
        OrderId: uniqueOrderId,
        Description: description,
        TerminalKey: TERMINAL_KEY,
        Password: SECRET_KEY
      };
      
      const token = generateToken(tokenData);
      
      // Данные для отправки в Т-Банк
      const paymentData = {
        TerminalKey: TERMINAL_KEY,
        Amount: amount,
        OrderId: uniqueOrderId,
        Description: description,
        CustomerKey: customerData.email,
        Token: token,
        SuccessURL: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success`,
        FailURL: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/error`,
        NotificationURL: `${process.env.BACKEND_URL || 'http://localhost:1337'}/api/payment/tinkoff/callback`,
        DATA: {
          Name: customerData.name,
          Email: customerData.email,
          Phone: customerData.phone
        },
        Receipt: {
          Email: customerData.email,
          Taxation: 'osn',
          Items: [
            {
              Name: description,
              Price: amount,
              Quantity: 1,
              Amount: amount,
              Tax: 'vat20'
            }
          ]
        }
      };
      
      console.log('Sending payment data to Tinkoff:', paymentData);
      
      // Отправляем запрос в Т-Банк
      const response = await fetch('https://securepay.tinkoff.ru/v2/Init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });
      
      const result = await response.json() as any;
      console.log('Tinkoff response:', result);
      
      // Проверяем различные статусы ответа
      if (result.Success === true || result.Status === 'NEW') {
        // Сохраняем PaymentId в заказе
        await strapi.entityService.update('api::order.order', orderId, {
          data: {
            paymentId: result.PaymentId,
            paymentStatus: 'pending'
          }
        });
        
        ctx.body = {
          success: true,
          paymentUrl: result.PaymentURL,
          paymentId: result.PaymentId
        };
      } else {
        console.error('Tinkoff error:', result);
        
        // Формируем читаемое сообщение об ошибке
        let errorMessage = result.Message || result.Details || 'Ошибка при создании платежа';
        if (result.ErrorCode) {
          errorMessage = `Код ошибки ${result.ErrorCode}: ${errorMessage}`;
        }
        
        ctx.body = {
          success: false,
          error: errorMessage
        };
      }
      
    } catch (error) {
      console.error('Ошибка инициации платежа:', error);
      ctx.body = {
        success: false,
        error: error.message || 'Ошибка при создании платежа'
      };
    }
  },
  
  async handleCallback(ctx) {
    try {
      const notification = ctx.request.body;
      console.log('Tinkoff callback received:', notification);
      
      // Проверяем подпись уведомления
      if (!verifyNotification(notification)) {
        console.error('Invalid notification signature');
        ctx.status = 400;
        return;
      }
      
      const { OrderId, Status, PaymentId } = notification;
      
      // Обновляем статус заказа
      const paymentStatus = Status === 'CONFIRMED' ? 'paid' : 'failed';
      const orderStatus = Status === 'CONFIRMED' ? 'paid' : 'cancelled';
      
      await strapi.entityService.update('api::order.order', OrderId, {
        data: {
          paymentStatus: paymentStatus,
          status: orderStatus
        }
      });
      
      // Если платеж успешен, очищаем корзину пользователя
      if (Status === 'CONFIRMED') {
        const order = await strapi.entityService.findOne('api::order.order', OrderId, {
          populate: ['user']
        }) as any;
        
        if (order?.user) {
          // Удаляем товары из корзины пользователя
          const cartItems = await strapi.entityService.findMany('api::cart-item.cart-item', {
            filters: { user: order.user.id }
          });
          
          for (const item of cartItems) {
            await strapi.entityService.delete('api::cart-item.cart-item', item.id);
          }
          
          console.log(`Cleared cart for user ${order.user.id} after successful payment`);
        }
      }
      
      ctx.body = 'OK';
      
    } catch (error) {
      console.error('Ошибка обработки callback:', error);
      ctx.status = 500;
    }
  }
}));

function generateToken(data: Record<string, any>): string {
  const SECRET_KEY = process.env.TINKOFF_SECRET_KEY || 'TinkoffBankTest';
  
  // Сортируем ключи и создаем строку для хеширования
  const sortedKeys = Object.keys(data).sort();
  let tokenString = '';
  
  for (const key of sortedKeys) {
    if (key !== 'Token' && data[key] !== '' && data[key] !== null && data[key] !== undefined) {
      tokenString += data[key];
    }
  }
  
  return crypto.createHash('sha256').update(tokenString).digest('hex');
}

function verifyNotification(notification: Record<string, any>): boolean {
  const SECRET_KEY = process.env.TINKOFF_SECRET_KEY || 'TinkoffBankTest';
  const receivedToken = notification.Token;
  
  // Создаем копию без токена
  const dataForToken = { ...notification };
  delete dataForToken.Token;
  dataForToken.Password = SECRET_KEY;
  
  const calculatedToken = generateToken(dataForToken);
  
  return receivedToken === calculatedToken;
}
