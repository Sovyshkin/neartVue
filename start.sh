#!/bin/bash

echo "🚀 Запуск проекта Near Vue с Strapi backend"

# Проверяем версию Node.js
NODE_VERSION=$(node --version)
echo "Текущая версия Node.js: $NODE_VERSION"

if [[ ! $NODE_VERSION =~ ^v22\. ]]; then
    echo "⚠️  Внимание: Для Strapi рекомендуется Node.js версии 22.x"
    echo "Попытка переключиться на Node.js 22..."
    
    if command -v nvm &> /dev/null; then
        source ~/.nvm/nvm.sh
        nvm use 22 2>/dev/null || nvm install 22
    else
        echo "❌ NVM не найден. Установите Node.js 22.x вручную"
        exit 1
    fi
fi

# Функция для запуска backend
start_backend() {
    echo "🔧 Запуск Strapi backend..."
    cd backend
    export PATH="/Users/vadim/.nvm/versions/node/v22.21.0/bin:$PATH"
    
    if [ ! -d "node_modules" ]; then
        echo "📦 Установка зависимостей backend..."
        npm install
    fi
    
    echo "🚀 Запуск Strapi в режиме разработки..."
    npm run develop &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
}

# Функция для запуска frontend
start_frontend() {
    echo "🎨 Запуск Vue.js frontend..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        echo "📦 Установка зависимостей frontend..."
        npm install
    fi
    
    echo "🚀 Запуск Vue.js в режиме разработки..."
    npm run serve &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
}

# Функция для остановки процессов
cleanup() {
    echo "🛑 Остановка серверов..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Обработка сигналов для корректной остановки
trap cleanup SIGINT SIGTERM

# Запуск серверов
start_backend
sleep 5  # Даем время backend запуститься
start_frontend

echo ""
echo "✅ Серверы запущены!"
echo "📍 Strapi Admin: http://localhost:1337/admin"
echo "📍 Vue.js App: http://localhost:8080"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Ожидание
wait