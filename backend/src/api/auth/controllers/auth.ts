import { factories } from '@strapi/strapi';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

// Временное хранилище кодов подтверждения
const passwordChangeCodes = new Map();

export default {
  
  // Отправка кода подтверждения для смены пароля
  async sendPasswordChangeCode(ctx) {
    try {
      const { email, currentPassword } = ctx.request.body;

      if (!email || !currentPassword) {
        return ctx.badRequest('Email и текущий пароль обязательны');
      }

      // Найти пользователя
      const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: { email },
      });

      if (!user || user.length === 0) {
        return ctx.badRequest('Пользователь не найден');
      }

      const foundUser = user[0];

      // Проверить текущий пароль
      const isPasswordValid = await bcrypt.compare(currentPassword, foundUser.password);
      if (!isPasswordValid) {
        return ctx.badRequest('Неверный текущий пароль');
      }

      // Генерировать 6-значный код
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Сохранить код с временем истечения (10 минут)
      passwordChangeCodes.set(email, {
        code: verificationCode,
        expires: Date.now() + 10 * 60 * 1000, // 10 минут
        userId: foundUser.id
      });

      // Настройка транспорта для отправки email
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your-email@gmail.com',
          pass: process.env.EMAIL_PASS || 'your-app-password'
        }
      });

      // HTML шаблон письма
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #E8336E, #FF6B6B); color: white; padding: 40px 30px; text-align: center; }
                .content { padding: 40px 30px; }
                .code-box { background: #f8f9fa; border: 2px dashed #E8336E; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .code { font-size: 32px; font-weight: bold; color: #E8336E; letter-spacing: 3px; }
                .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Смена пароля</h1>
                    <p>Код подтверждения для изменения пароля</p>
                </div>
                <div class="content">
                    <p>Здравствуйте!</p>
                    <p>Вы запросили смену пароля для вашего аккаунта. Используйте код ниже для подтверждения:</p>
                    
                    <div class="code-box">
                        <div class="code">${verificationCode}</div>
                    </div>
                    
                    <p><strong>Важно:</strong></p>
                    <ul>
                        <li>Код действителен в течение 10 минут</li>
                        <li>Никому не сообщайте этот код</li>
                        <li>Если вы не запрашивали смену пароля, проигнорируйте это письмо</li>
                    </ul>
                </div>
                <div class="footer">
                    <p>Это автоматическое сообщение, не отвечайте на него.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      // Отправить email
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@neartart.com',
        to: email,
        subject: '🔐 Код подтверждения для смены пароля - NeartArt',
        html: htmlContent
      });

      return ctx.send({
        message: 'Код подтверждения отправлен на ваш email',
        success: true
      });

    } catch (error) {
      console.error('Ошибка отправки кода смены пароля:', error);
      return ctx.internalServerError('Внутренняя ошибка сервера');
    }
  },

  // Смена пароля с проверкой кода
  async changePassword(ctx) {
    try {
      const { currentPassword, newPassword, verificationCode } = ctx.request.body;

      if (!currentPassword || !newPassword || !verificationCode) {
        return ctx.badRequest('Все поля обязательны');
      }

      if (newPassword.length < 6) {
        return ctx.badRequest('Новый пароль должен содержать минимум 6 символов');
      }

      // Получить пользователя из токена
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('Пользователь не авторизован');
      }

      // Найти код подтверждения
      const codeData = Array.from(passwordChangeCodes.entries()).find(([email, data]) => 
        data.userId === user.id && data.code === verificationCode
      );

      if (!codeData) {
        return ctx.badRequest('Неверный код подтверждения');
      }

      const [email, { expires }] = codeData;

      // Проверить, не истек ли код
      if (Date.now() > expires) {
        passwordChangeCodes.delete(email);
        return ctx.badRequest('Код подтверждения истек');
      }

      // Проверить текущий пароль
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return ctx.badRequest('Неверный текущий пароль');
      }

      // Хэшировать новый пароль
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Обновить пароль пользователя
      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          password: hashedNewPassword
        }
      });

      // Удалить использованный код
      passwordChangeCodes.delete(email);

      return ctx.send({
        message: 'Пароль успешно изменен',
        success: true
      });

    } catch (error) {
      console.error('Ошибка смены пароля:', error);
      return ctx.internalServerError('Внутренняя ошибка сервера');
    }
  }

};