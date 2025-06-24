<script>
import axios from "axios";

export default {
  name: "AppTickets",
  components: {},
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
        let response = await axios.get(`/tickets/get/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        this.tickets = response.data.tickets;
        let res = await axios.get(`/users/${localStorage.getItem("id")}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.lang = res.data.user.lang;
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
