<script>
import AppEmpty from "./AppEmpty.vue";

export default {
  name: "AppTickets",
  components: { AppEmpty },
  data() {
    return {
      id: "",
      lang: "",
      tickets: [],
    };
  },
  methods: {
    async load_info() {
      try {
        let response = await this.$api.tickets.getAll();
        console.log(response);
        this.tickets = response.data.data;
        
        let res = await this.$api.users.me();
        this.lang = res.data.lang || 'ru';
        this.$i18n.locale = this.lang;
      } catch (err) {
        console.log(err);
      }
    },

    printOpen(open) {
      if (this.lang == "RU") {
        if (open) {
          return "Открыт";
        } else {
          return "Закрыт";
        }
      } else if (this.lang == "EN") {
        if (open) {
          return "Is open";
        } else {
          return "Closed";
        }
      } else if (this.lang == "HE") {
        if (open) {
          return "פתוח";
        } else {
          return "סגור";
        }
      }
    },
  },
  async mounted() {
    this.load_info();
  },
};
</script>
<template>
  <div class="wrapper">
    <div class="wrap-title">
      <img
        @click="$router.push({ name: 'support' })"
        class="back"
        src="../assets/back.png"
        alt=""
      />
      <h1>{{ $t("myTickets") }}</h1>
    </div>
    <div
      class="ticket"
      @click="$router.push({ name: 'ticket', query: { id: ticket.id } })"
      v-for="ticket in tickets"
      :key="ticket.id"
    >
      <span class="title">{{ ticket.title }}</span>
      <div class="group">
        <span class="item-group">{{ $t("status") }}:</span>
        <span class="group-value">{{ printOpen(ticket.is_open) }}</span>
      </div>
    </div>
    
    <AppEmpty 
      v-if="tickets.length === 0"
      title="Тикеты отсутствуют"
      description="У вас пока нет созданных тикетов поддержки. Создайте тикет, если у вас есть вопросы или проблемы."
      icon="🎫"
      :showButton="true"
      buttonText="Создать тикет"
      buttonRoute="/support"
    />
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  margin-top: 40px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: calc(100vh - 200px);
}

.group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-group,
.group-value {
  font-size: 12px;
  opacity: 60%;
  font-weight: 500;
}

.ticket {
  padding: 20px;
  border: 1px solid black;
  border-radius: 16px;
  cursor: pointer;
  transition: all 500ms ease;
}

.ticket:hover {
  transform: translateY(-3px);
  background-color: #E8336E;
  color: #fff;
}

.title {
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}

.wrap-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back {
  width: 28px;
  height: 28px;
  cursor: pointer;
}
</style>
