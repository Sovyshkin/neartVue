<script>
export default {
  name: "AppEmpty",
  props: {
    title: {
      type: String,
      default: "Ничего не найдено"
    },
    description: {
      type: String,
      default: "Здесь пока нет элементов"
    },
    icon: {
      type: String,
      default: "empty"
    },
    showButton: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: "Перейти к каталогу"
    },
    buttonRoute: {
      type: String,
      default: "/arts"
    }
  },
  methods: {
    handleButtonClick() {
      if (this.showButton && this.buttonRoute) {
        this.$router.push(this.buttonRoute);
      }
    }
  }
};
</script>
<template>
  <div class="empty-state">
    <div class="empty-content">
      <!-- Иконка -->
      <div class="empty-icon">
        <img v-if="icon === 'empty'" src="../assets/empty.png" alt="Empty" />
        <svg v-else-if="icon === 'search'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <svg v-else-if="icon === 'heart'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <svg v-else-if="icon === 'cart'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <svg v-else width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12l2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>
      
      <!-- Заголовок -->
      <h3 class="empty-title">{{ title }}</h3>
      
      <!-- Описание -->
      <p class="empty-description">{{ description }}</p>
      
      <!-- Кнопка действия (опционально) -->
      <button 
        v-if="showButton" 
        @click="handleButtonClick"
        class="empty-button"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
<style scoped>
.empty-state {
  width: 100%;
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.empty-content {
  text-align: center;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.empty-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #9ca3af;
  transition: all 0.3s ease;
}

.empty-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.empty-icon img {
  width: 48px;
  height: 48px;
  opacity: 0.7;
}

.empty-icon svg {
  width: 48px;
  height: 48px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  line-height: 1.4;
}

.empty-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  opacity: 0.8;
}

.empty-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.empty-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.empty-button:active {
  transform: translateY(0);
}

/* Анимация появления */
.empty-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .empty-state {
    min-height: 50vh;
    padding: 1rem;
  }
  
  .empty-title {
    font-size: 1.25rem;
  }
  
  .empty-description {
    font-size: 0.9rem;
  }
  
  .empty-icon {
    width: 64px;
    height: 64px;
  }
  
  .empty-icon img,
  .empty-icon svg {
    width: 36px;
    height: 36px;
  }
}
</style>
