<template>
  <!-- Уведомление об ошибке -->
  <transition name="notification">
    <div v-if="mainStore.showError" class="notification error" @click="mainStore.hideMessages">
      <div class="notification-content">
        <svg class="notification-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#EF4444"/>
          <path d="M10 6V10M10 14H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="notification-text">{{ mainStore.errorMessage }}</span>
        <button class="notification-close" @click="mainStore.hideMessages">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </transition>

  <!-- Уведомление об успехе -->
  <transition name="notification">
    <div v-if="mainStore.showSuccess" class="notification success" @click="mainStore.hideMessages">
      <div class="notification-content">
        <svg class="notification-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#10B981"/>
          <path d="M6 10L8.5 12.5L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="notification-text">{{ mainStore.successMessage }}</span>
        <button class="notification-close" @click="mainStore.hideMessages">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useMainStore } from '../stores/main.js'
const mainStore = useMainStore()
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 350px;
  min-width: 250px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  backdrop-filter: blur(10px);
  transform: translateZ(0);
  will-change: transform, opacity;
}

.notification.error {
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.95) 0%, rgba(254, 202, 202, 0.95) 100%);
  border: 1px solid rgba(248, 113, 113, 0.3);
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05);
}

.notification.success {
  background: linear-gradient(135deg, rgba(209, 250, 229, 0.95) 0%, rgba(167, 243, 208, 0.95) 100%);
  border: 1px solid rgba(52, 211, 153, 0.3);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.notification-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.notification-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  line-height: 1.3;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #6B7280;
  padding: 2px;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #374151;
  transform: scale(1.1);
}

.notification-close svg {
  width: 14px;
  height: 14px;
}

.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.notification-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}

@media (max-width: 768px) {
  .notification {
    top: 12px;
    right: 12px;
    max-width: 280px;
    min-width: 220px;
  }
  
  .notification-content {
    padding: 6px 10px;
    gap: 6px;
  }
  
  .notification-icon {
    width: 16px;
    height: 16px;
  }
  
  .notification-text {
    font-size: 12px;
    line-height: 1.2;
  }
  
  .notification-close {
    width: 18px;
    height: 18px;
  }
  
  .notification-close svg {
    width: 12px;
    height: 12px;
  }
}

@media (max-width: 480px) {
  .notification {
    top: 10px;
    right: 10px;
    max-width: 240px;
    min-width: 180px;
    border-radius: 6px;
  }
  
  .notification-content {
    padding: 5px 8px;
    gap: 5px;
  }
  
  .notification-icon {
    width: 14px;
    height: 14px;
  }
  
  .notification-text {
    font-size: 11px;
    line-height: 1.2;
  }
  
  .notification-close {
    width: 16px;
    height: 16px;
    padding: 1px;
  }
  
  .notification-close svg {
    width: 10px;
    height: 10px;
  }
}
</style>
