import { factories } from '@strapi/strapi';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateSimpleCode = () => {
  const patterns = [
    () => {
      const first = Math.floor(Math.random() * 9) + 1;
      const second = Math.floor(Math.random() * 9) + 1;
      return `${first}${first}${second}${second}`;
    },
    () => {
      const first = Math.floor(Math.random() * 9) + 1;
      const second = Math.floor(Math.random() * 9) + 1;
      return `${first}${second}${second}${first}`;
    },
    () => {
      const start = Math.floor(Math.random() * 6) + 1;
      return `${start}${start + 1}${start + 2}${start + 3}`;
    },
    () => {
      const pair1 = Math.floor(Math.random() * 9) + 1;
      let pair2 = Math.floor(Math.random() * 9) + 1;
      while (pair2 === pair1) {
        pair2 = Math.floor(Math.random() * 9) + 1;
      }
      return `${pair1}${pair1}${pair2}${pair2}`;
    }
  ];

  return patterns[Math.floor(Math.random() * patterns.length)]();
};

export default {
  async sendCode(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ctx.badRequest('Invalid email format');
      }

      // Проверяем или создаем пользователя
      let user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return ctx.badRequest('Пользователь не найден, зарегистрируйтесь');
      }

      // Генерируем код
      const verificationCode = generateSimpleCode();
      const codeExpires = new Date(Date.now() + 30 * 60 * 1000); // Увеличиваем до 30 минут

      console.log('🕐 Code expires at:', codeExpires.toISOString());
      console.log('🕐 Current time:', new Date().toISOString());

      // Сохраняем хешированный код в пользователе
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: { 
          verificationCode: await bcrypt.hash(verificationCode, 10),
          codeExpires: codeExpires // Сохраняем как Date объект
        }
      });

      // Проверяем, что данные сохранились
      const updatedUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: user.id }
      });
      console.log('✅ After update - codeExpires:', updatedUser.codeExpires);
      console.log('✅ After update - user keys:', Object.keys(updatedUser));

      console.log('📧 Verification code for', email, ':', verificationCode);

      // HTML шаблон письма из рабочего кода
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0; 
                }
                .content { 
                    background: #f9f9f9; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px; 
                    border: 1px solid #ddd;
                }
                .code { 
                    background: #fff; 
                    padding: 20px; 
                    font-size: 32px; 
                    font-weight: bold; 
                    text-align: center; 
                    margin: 20px 0; 
                    border-radius: 8px; 
                    border: 2px dashed #667eea; 
                    letter-spacing: 8px;
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    font-size: 12px; 
                    color: #666; 
                }
                .warning { 
                    background: #fff3cd; 
                    border: 1px solid #ffeaa7; 
                    padding: 15px; 
                    border-radius: 5px; 
                    margin: 20px 0; 
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Код подтверждения</h1>
            </div>
            <div class="content">
                <p>Здравствуйте!</p>
                <p>Для завершения авторизации используйте следующий код подтверждения:</p>
                
                <div class="code">${verificationCode}</div>
                
                <div class="warning">
                    ⚠️ <strong>Код действителен в течение 10 минут</strong><br>
                    Не передавайте код третьим лицам
                </div>
                
                <p>Если вы не запрашивали этот код, пожалуйста, проигнорируйте это письмо.</p>
            </div>
            <div class="footer">
                <p>© 2025 BOM. Все права защищены.</p>
            </div>
        </body>
        </html>
      `;

      // Отправляем email через Beget SMTP (рабочий метод)
      try {
        await strapi.plugins['email'].services.email.send({
          to: email,
          from: process.env.SMTP_USERNAME || 'support@servicered.ru',
          subject: 'Ваш код подтверждения - нехудожник',
          text: `Ваш код подтверждения: ${verificationCode}. Код действителен 10 минут.`,
          html: emailTemplate
        });
        
        console.log('✅ Email sent successfully to:', email);

      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
        // В разработке логируем код
        console.log('Код подтверждения для', email, ':', verificationCode);
      }

      ctx.send({
        ok: true,
        success: true,
        userExists: true,
        message: 'Код отправлен на email',
        ...(process.env.NODE_ENV === 'development' && { 
          expires_in: '30 minutes',
          debug_code: verificationCode
        })
      });

    } catch (error) {
      console.error('Ошибка при отправке кода:', error);
      ctx.badRequest('Ошибка при отправке кода');
    }
  },

  async verifyCode(ctx) {
    try {
      const { email, code } = ctx.request.body;

      if (!email || !code) {
        return ctx.badRequest('Email и код обязательны');
      }

      const codeRegex = /^\d{4}$/;
      if (!codeRegex.test(code)) {
        return ctx.badRequest('Код должен состоять из 4 цифр');
      }

      // Находим пользователя
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return ctx.badRequest('Пользователь не найден');
      }

      console.log('🕐 Checking expiration - Current time:', new Date().toISOString());
      console.log('🕐 Code expires at:', user.codeExpires);
      console.log('🔍 User data keys:', Object.keys(user));

      // Проверяем, есть ли поле codeExpires в объекте пользователя
      if (!user.hasOwnProperty('codeExpires') || !user.codeExpires) {
        console.log('❌ codeExpires field is missing or null');
        return ctx.badRequest('Код не найден или истек, запросите новый');
      }

      const now = new Date();
      const expiryDate = new Date(user.codeExpires);
      
      if (now > expiryDate) {
        console.log('⏰ Code expired, current time vs expiry:', now.toISOString(), 'vs', expiryDate.toISOString());
        return ctx.badRequest('Код истек, запросите новый');
      }

      if (!user.verificationCode) {
        return ctx.badRequest('Код не найден');
      }

      // Проверяем код
      const isValidCode = await bcrypt.compare(code, user.verificationCode);

      if (!isValidCode) {
        return ctx.badRequest('Неверный код');
      }

      // Подтверждаем пользователя и очищаем код
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: { 
          confirmed: true,
          verificationCode: null,
          codeExpires: null,
          isVerified: true
        }
      });

      // Генерируем JWT токен с длительным сроком действия
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      ctx.send({
        success: true,
        jwt: token,
        refreshToken: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          confirmed: true
        },
        message: 'Successfully authenticated'
      });

    } catch (error) {
      console.error('Ошибка при проверке кода:', error);
      ctx.badRequest('Ошибка при проверке кода');
    }
  },

  async refreshToken(ctx) {
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      return ctx.badRequest('Refresh token is required');
    }

    try {
      // Проверяем refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'fallback-secret');
      
      // Проверяем, что пользователь существует
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id }
      });

      if (!user) {
        return ctx.unauthorized('User not found');
      }

      // Генерируем новый токен с длительным сроком действия
      const newToken = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      ctx.send({
        success: true,
        jwt: newToken,
        refreshToken: newToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        },
        message: 'Token refreshed successfully'
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return ctx.unauthorized('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        return ctx.unauthorized('Invalid refresh token');
      }
      
      ctx.internalServerError('Something went wrong');
    }
  }
};