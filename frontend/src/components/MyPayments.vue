<script>
import AppLoader from "./AppLoader.vue";
import AppEmpty from "./AppEmpty.vue";
import axios from "axios";

export default {
  name: "MyPayments",
  components: { AppLoader, AppEmpty },
  data() {
    return {
      payments: [],
      isLoading: false,
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await this.$api.payments.getAll();
        this.payments = response.data.data || [];
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    printType(type) {
      if (type == "hosting") {
        return "Плата за хостинг";
      } else if (type == "buy_request") {
        return "Покупка";
      }
      return "";
    },

    checkSum(sum) {
      if (sum) {
        sum = Number(sum);
        if (sum > 0) {
          return true;
        }
        return false;
      }
    },

    printStatus(state) {
      if (this.$i18n.locale == "RU") {
        if (state == "waiting") {
          return "В ожидании";
        } else if (state == "invoiced") {
          return "Запрос";
        } else if (state == "confirmation") {
          return "На подтверждении";
        } else if (state == "completed") {
          return "Оплачен";
        } else if (state == "canceled") {
          return "Отменен";
        }
      } else if (this.$i18n.locale == "EN") {
        if (state == "waiting") {
          return "Waiting";
        } else if (state == "invoiced") {
          return "Invoiced";
        } else if (state == "confirmation") {
          return "Confirmation";
        } else if (state == "completed") {
          return "Completed";
        } else if (state == "canceled") {
          return "Canceled";
        }
      } else if (this.$i18n.locale == "HE") {
        if (state == "waiting") {
          return "מחכה";
        } else if (state == "invoiced") {
          return "בקשה";
        } else if (state == "confirmation") {
          return "על אישור";
        } else if (state == "completed") {
          return "שולם";
        } else if (state == "canceled") {
          return "בוטל";
        }
      }
    },

    getStatusClass(state) {
      switch (state) {
        case 'completed':
          return 'status-success';
        case 'waiting':
        case 'confirmation':
          return 'status-pending';
        case 'canceled':
          return 'status-error';
        case 'invoiced':
          return 'status-info';
        default:
          return 'status-default';
      }
    },

    viewPaymentDetails(payment) {
      this.$router.push({ name: 'payment', query: { id: payment.id } });
    }
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.load_info();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="payments-container" v-else>
    <!-- Заголовок страницы -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">История платежей</h1>
        <p class="page-subtitle">Просматривайте все ваши транзакции и их статусы</p>
      </div>
      
      <!-- Статистика -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18203 2.99721 7.13214 4.39828 5.49883C5.79935 3.86553 7.69279 2.72636 9.79619 2.24223C11.8996 1.75809 14.1003 1.94797 16.07 2.79" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ payments.filter(p => p.state === 'completed').length }}</div>
            <div class="stat-label">Завершено</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ payments.filter(p => p.state === 'waiting' || p.state === 'confirmation').length }}</div>
            <div class="stat-label">В обработке</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ payments.length }}</div>
            <div class="stat-label">Всего</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Контент -->
    <div class="payments-content" v-if="payments.length > 0">
      <!-- Таблица платежей -->
      <div class="payments-table-container">
        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Список транзакций</h3>
            <div class="table-controls">
              <!-- Здесь можно добавить фильтры в будущем -->
            </div>
          </div>
          
          <div class="table-wrapper">
            <table class="payments-table">
              <thead>
                <tr>
                  <th class="col-date">
                    <div class="th-content">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      Дата
                    </div>
                  </th>
                  <th class="col-type">
                    <div class="th-content">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8M16 4V2M16 4V6M8 4V2M8 4V6" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      Тип
                    </div>
                  </th>
                  <th class="col-amount">
                    <div class="th-content">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
                        <path d="M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      Сумма
                    </div>
                  </th>
                  <th class="col-status">
                    <div class="th-content">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Статус
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="payment in payments" 
                  :key="payment.id"
                  class="payment-row"
                  @click="viewPaymentDetails(payment)"
                >
                  <td class="col-date">
                    <div class="date-info">
                      <div class="payment-date">{{ payment.date }}</div>
                      <div class="payment-time">{{ payment.time }}</div>
                    </div>
                  </td>
                  
                  <td class="col-type">
                    <div class="type-info">
                      <div class="type-icon">
                        <svg v-if="payment.type === 'buy_request'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" stroke-width="2"/>
                          <path d="M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
                          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </div>
                      <div class="type-text">{{ printType(payment.type) }}</div>
                    </div>
                  </td>
                  
                  <td class="col-amount">
                    <div class="amount-info">
                      <div class="amount-value">{{ payment.value }} {{ payment.currency }}</div>
                      <div v-if="payment.hash_rate" class="amount-details">{{ payment.hash_rate }}</div>
                    </div>
                  </td>
                  
                  <td class="col-status">
                    <div class="status-wrapper">
                      <div class="status-badge" :class="getStatusClass(payment.state)">
                        <div class="status-indicator"></div>
                        <span class="status-text">{{ printStatus(payment.state) }}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <AppEmpty 
      v-else
      title="Платежи отсутствуют"
      description="У вас пока нет совершенных платежей. История всех ваших транзакций будет отображаться здесь."
      icon="💳"
      :showButton="true"
      buttonText="К покупкам"
      buttonRoute="/arts"
    />
  </div>
</template>
<style scoped>
.payments-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%);
  padding: 2rem;
}

.payments-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 60px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #E8336E, #d12757);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.125rem;
  font-weight: 400;
}

.payments-statistics {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #E8336E, #d12757);
  border-radius: 20px 20px 0 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  padding: 15px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total {
  background: linear-gradient(135deg, #E8336E, #d12757);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
}

.stat-icon.canceled {
  background: linear-gradient(135deg, #dc3545, #6f42c1);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payments-content {
  margin-bottom: 2rem;
}

.payments-table-container {
  width: 100%;
}

.table-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.table-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
}

.payments-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.payments-table th {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  font-weight: 600;
  padding: 1.25rem 1rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.8rem;
}

.payments-table th:first-child {
  border-radius: 15px 0 0 0;
}

.payments-table th:last-child {
  border-radius: 0 15px 0 0;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.th-content svg {
  width: 16px;
  height: 16px;
  color: #E8336E;
}

.payments-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
  transition: background-color 0.2s ease;
}

.payment-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-row:hover td {
  background-color: rgba(232, 51, 110, 0.05);
}

.payment-row:last-child td {
  border-bottom: none;
}

.col-date {
  min-width: 140px;
}

.col-type {
  min-width: 160px;
}

.col-amount {
  min-width: 120px;
}

.col-status {
  min-width: 130px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.payment-date {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.payment-time {
  color: #6c757d;
  font-size: 0.85rem;
}

.type-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.type-icon {
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E8336E, #d12757);
}

.type-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.type-text {
  font-weight: 500;
  color: #2c3e50;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.amount-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
}

.amount-details {
  color: #6c757d;
  font-size: 0.85rem;
}

.status-wrapper {
  display: flex;
  justify-content: flex-start;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 100px;
  justify-content: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-success {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(32, 201, 151, 0.15));
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.status-pending {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(253, 126, 20, 0.15));
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-error {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.15), rgba(111, 66, 193, 0.15));
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.status-info {
  background: linear-gradient(135deg, rgba(23, 162, 184, 0.15), rgba(32, 201, 151, 0.15));
  color: #17a2b8;
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.status-default {
  background: linear-gradient(135deg, rgba(108, 117, 125, 0.15), rgba(173, 181, 189, 0.15));
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

@media (max-width: 768px) {
  .payments-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .table-card {
    padding: 1.5rem;
  }
  
  .table-wrapper {
    border-radius: 10px;
  }
  
  .payments-table th,
  .payments-table td {
    padding: 1rem 0.75rem;
  }
  
  .payments-table th:first-child,
  .payments-table th:last-child {
    border-radius: 10px 10px 0 0;
  }
  
  /* Hide less important columns on tablets */
  .col-type {
    display: none;
  }
  
  .payment-date {
    font-size: 0.9rem;
  }
  
  .amount-value {
    font-size: 1rem;
  }
  
  .status-badge {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 640px) {
  .payments-page {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1.25rem;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 0;
    flex-shrink: 0;
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-number {
    font-size: 2rem;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
  
  .table-card {
    padding: 1rem;
  }
  
  .table-title {
    font-size: 1.25rem;
  }
  
  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .payments-table {
    min-width: 600px;
  }
  
  .payments-table th,
  .payments-table td {
    padding: 0.75rem 0.5rem;
    white-space: nowrap;
  }
  
  .payment-date {
    font-size: 0.85rem;
  }
  
  .payment-time {
    font-size: 0.75rem;
  }
  
  .amount-value {
    font-size: 0.95rem;
  }
  
  .status-badge {
    font-size: 0.7rem;
    padding: 0.35rem 0.7rem;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .payments-page {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 45px;
    height: 45px;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .stat-label {
    font-size: 0.85rem;
  }
  
  .table-card {
    padding: 0.75rem;
    margin: 0;
    border-radius: 16px;
  }
  
  .table-title {
    font-size: 1.125rem;
  }
  
  /* Switch to card layout on mobile */
  .table-wrapper {
    border-radius: 12px;
  }
  
  .payments-table {
    display: none;
  }
  
  /* Mobile card layout */
  .mobile-payments-list {
    display: block;
    gap: 1rem;
  }
  
  .mobile-payment-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid #f1f3f4;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .mobile-payment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }
  
  .mobile-payment-date {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }
  
  .mobile-payment-time {
    color: #6c757d;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .mobile-payment-amount {
    font-weight: 700;
    color: #2c3e50;
    font-size: 1.1rem;
    text-align: right;
  }
  
  .mobile-payment-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .mobile-payment-type {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #6c757d;
  }
  
  .mobile-type-icon {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #E8336E, #d12757);
    border-radius: 12px; /* Увеличиваем закругление */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .mobile-type-icon svg {
    width: 12px;
    height: 12px;
  }
}

/* Extra small phones */
@media (max-width: 375px) {
  .payments-page {
    padding: 0.25rem;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.375rem;
  }
  
  .stat-card {
    padding: 0.875rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  
  .table-card {
    padding: 0.5rem;
  }
  
  .mobile-payment-card {
    padding: 0.875rem;
  }
  
  .mobile-payment-date {
    font-size: 0.85rem;
  }
  
  .mobile-payment-amount {
    font-size: 1rem;
  }
  
  .mobile-payment-type {
    font-size: 0.8rem;
  }
  
  .status-badge {
    font-size: 0.65rem;
    padding: 0.3rem 0.6rem;
    min-width: 70px;
  }
}

/* Landscape orientation for phones */
@media (max-height: 500px) and (orientation: landscape) {
  .payments-page {
    padding: 0.5rem;
  }
  
  .page-header {
    margin-bottom: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
  
  .stat-card {
    padding: 0.75rem;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    width: 35px;
    height: 35px;
    margin-bottom: 0.5rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}
</style>
