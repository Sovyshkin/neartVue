# Near Vue - Галерея искусства с Strapi Backend

Этот проект был мигрирован с Python backend на Strapi CMS.

## Структура проекта

- `frontend/` - Vue.js фронтенд
- `backend/` - Strapi CMS backend

## Установка и запуск

### Требования

- Node.js 18-22.x (не 23.x из-за совместимости со Strapi)
- npm или yarn

### Установка

1. **Установите правильную версию Node.js:**
   ```bash
   nvm install 22
   nvm use 22
   ```

2. **Установите зависимости для backend (Strapi):**
   ```bash
   cd backend
   npm install
   ```

3. **Установите зависимости для frontend (Vue.js):**
   ```bash
   cd ../frontend
   npm install
   ```

### Быстрый запуск

Используйте скрипт для автоматического запуска:

```bash
./start.sh
```

Этот скрипт автоматически:
- Проверит версию Node.js
- Установит зависимости (если нужно)
- Запустит Strapi backend на порту 1337
- Запустит Vue.js frontend на порту 8080

### Ручной запуск

1. **Запустите Strapi backend:**
   ```bash
   cd backend
   export PATH="/Users/vadim/.nvm/versions/node/v22.21.0/bin:$PATH"
   npm run develop
   ```

   Strapi будет доступен по адресу: http://localhost:1337
   Админ-панель: http://localhost:1337/admin

2. **Запустите Vue.js frontend (в новом терминале):**
   ```bash
   cd frontend
   npm run serve
   ```

   Фронтенд будет доступен по адресу: http://localhost:8080

### Первичная настройка

1. **Настройка Strapi:**
   - Откройте http://localhost:1337/admin
   - Создайте первого администратора
   - Настройте разрешения в Settings > Users & Permissions > Roles > Public:
     - Разрешите доступ к Artist (find, findOne)
     - Разрешите доступ к Artwork (find, findOne)
     - Разрешите доступ к Upload (upload)

   - Настройте разрешения для Authenticated:
     - Разрешите доступ к Ticket (create, find, findOne, update)
     - Разрешите доступ к Ticket-response (create)
     - Разрешите доступ к Order (create, find, findOne)
     - Разрешите доступ к Payment (create, find, findOne)

2. **Создание контента:**
   - Создайте художников в Content Manager > Artist
   - Создайте картины в Content Manager > Artwork
   - Убедитесь, что все записи опубликованы (Published)

## Основные изменения

### Что изменилось:

1. **Backend:** Python → Strapi CMS
2. **Управление контентом:** Теперь происходит в админ-панели Strapi, а не во фронтенде
3. **API endpoints:** Изменились с кастомных на стандартные Strapi REST API
4. **Структура данных:** Адаптирована под Strapi Content Types

### Удаленные компоненты:

- `CreateArt.vue` - создание картин теперь в Strapi админке
- `EditArt.vue` - редактирование картин теперь в Strapi админке  
- `CreateArtist.vue` - создание художников теперь в Strapi админке
- `EditArtist.vue` - редактирование художников теперь в Strapi админке

### API изменения:

Все старые endpoints заменены на новые Strapi endpoints:

**Аутентификация:**
- `/login` → `/api/auth/local`
- `/register` → `/api/auth/local/register`
- `/users/resetPassword` → `/api/auth/forgot-password`

**Контент:**
- `/get_artists` → `/api/artists?populate=*`
- `/get_pictures` → `/api/artworks?populate=*`
- `/get_picture/[id]` → `/api/artworks/[id]?populate=*`

**Пользователи:**
- `/get_user/[id]` → `/api/users/me`
- `/users/[id]` → `/api/users/me`

**Тикеты:**
- `/tickets/create` → `/api/tickets`
- `/tickets/get/all` → `/api/tickets?populate=*`
- `/tickets/get?id=[id]` → `/api/tickets/[id]?populate=*`

**Новые endpoints:**
- Избранное: `/api/favorites`
- Корзина: `/api/cart-items`
- Обратная связь: `/api/feedbacks`
- Заказы: `/api/orders`
- Платежи: `/api/payments`

## Полезные команды

```bash
# Очистка кеша Strapi
cd backend && npm run strapi cache:clear

# Перестройка админ-панели Strapi
cd backend && npm run build

# Линтинг Vue кода
cd frontend && npm run lint

# Сборка production версии Vue
cd frontend && npm run build
```

## Проблемы и решения

### Node.js версия
Если получаете ошибку о несовместимой версии Node.js:
```bash
nvm install 22
nvm use 22
```

### Ошибки CORS
Если есть проблемы с CORS, проверьте настройки в `backend/config/middlewares.ts`

### База данных
Strapi использует SQLite по умолчанию. Файл БД: `backend/.tmp/data.db`

## TODO

1. [ ] Обновить все API вызовы во Vue компонентах
2. [ ] Настроить правильные разрешения в Strapi
3. [ ] Добавить валидацию форм
4. [ ] Настроить роли пользователей
5. [ ] Добавить обработку ошибок