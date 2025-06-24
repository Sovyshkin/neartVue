<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "AppTicket",
  components: { LoadingSpinner },
  data() {
    return {
      title: "",
      text: "",
      id: "",
      lang: "",
      ticket: {},
      messages: [],
      isLoading: false,
    };
  },
  methods: {
    async load_info() {
      try {
        this.id = this.$route.query.id;
        let response = await axios.get(`/tickets/get?id=${this.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("TICKET INFO", response);
        this.ticket = response.data.ticket;
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

    async load_messages() {
      try {
        this.id = this.$route.query.id;
        let response = await axios.post(
          `/tickets/messages/get/all`,
          {
            ticket_id: this.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        this.messages = response.data.messages.reverse();
      } catch (err) {
        console.log(err);
      }
    },

    async sendMessage() {
      try {
        let response = await axios.post(
          `/tickets/messages/create`,
          {
            ticket_id: this.id,
            text: this.text,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        let status = response.data.status;
        if (status == "ok") {
          this.text = "";
        }
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

    async closeTicket() {
      try {
        this.isLoading = true;
        let response = await axios.post(
          `/tickets/close`,
          {
            id: this.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        let status = response.data.status;
        if (status == "ok") {
          this.$router.go(-1);
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  async mounted() {
    this.load_info();
    this.load_messages();
    setTimeout(() => {
      let chat = document.querySelector(`.chat`);
      if (chat) {
        console.log(chat);
        console.log(chat.scrollTop);
        console.log(chat.scrollHeight);
        chat.scrollTop = chat.scrollHeight;
        console.log(chat.scrollTop);
      }
    }, 500);
    setInterval(() => {
      this.load_messages();
    }, 2500);
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <div class="wrap-title">
      <div class="title">
        <img
          @click="$router.push({ name: 'tickets' })"
          class="back"
          src="../assets/back.png"
          alt=""
        />
        <h1>{{ ticket.title }}</h1>
      </div>
      <button v-if="ticket.is_open" class="btn" @click="closeTicket()">
        {{ $t("closeTicket") }}
      </button>
    </div>
    <div class="info">
      <div class="group">
        <span class="item-group">{{ $t("status") }}:</span>
        <span class="group-value">{{ printOpen(ticket.is_open) }}</span>
      </div>
      <div class="group">
        <span class="item-group">{{ $t("dateCreate") }}:</span>
        <span class="group-value">{{ ticket.date }}</span>
      </div>
      <div class="group">
        <span class="item-group">{{ $t("timeCreate") }}:</span>
        <span class="group-value">{{ ticket.time }}</span>
      </div>
    </div>
    <div class="chat">
      <div
        class="wrap-message"
        v-for="message in messages"
        :key="message.id"
        :class="{ user: message.sender == 'user' }"
      >
        <div class="message" :class="{ userMessage: message.sender == 'user' }">
          <p class="content">{{ message.content }}</p>
          <span class="date">{{ message.date }} {{ message.time }}</span>
        </div>
      </div>
    </div>
    <div class="group-send" v-if="ticket.is_open">
      <textarea
        v-model="text"
        name="text"
        id="text"
        :placeholder="$t('enterText')"
      ></textarea>
      <img @click="sendMessage" class="send" src="../assets/send.png" alt="" />
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

input,
textarea {
  width: 100%;
  border: 1px solid black;
  ;
  padding: 16px;
}

input::placeholder,
textarea::placeholder {
  color: #a5a5a5;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
}

.btn {
  width: fit-content;
  background-color: #E8336E;
  
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.chat {
  height: 60vh;
  padding: 20px;
  border: 1px solid #a5a5a5;
  
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.chat::-webkit-scrollbar {
  width: 0;
}

.wrap-message {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.user {
  justify-content: flex-end;
}

.userMessage {
  background-color: #E8336E;
  color: #fff;
}

.message {
  width: fit-content;
  min-width: 200px;
  padding: 10px;
  border: 1px solid black;
  
  position: relative;
}

.date {
  position: absolute;
  bottom: 4%;
  right: 7%;
  font-size: 10px;
  font-weight: 500;
  opacity: 60%;
}
p {
  margin-bottom: 3px;
}

.group-send {
  display: flex;
  align-items: center;
  gap: 20px;
}

textarea {
  border: 1px solid #a5a5a5;
  
  outline: none;
}

.send {
  cursor: pointer;
  transition: all 500ms ease;
  width: 30px;
  width: 30px;
}

.send:hover {
  transform: translateY(-3px);
}

.wrap-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.title {
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
