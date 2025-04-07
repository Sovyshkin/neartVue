<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  name: "AppRegister",
  components: { LoadingSpinner },
  data() {
    return {
      username: "",
      email: "",
      message: "",
      isLoading: false,
    };
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateRegister", false);
    },

    async log() {
      try {
        if (this.username && this.email) {
          let response = await axios.post(`/register`, {
            username: this.username,
            email: this.email,
          });
          console.log(response);
          this.message = response.data.message;
          this.id = response.data.id;
          let cart_id = response.data.cart_id;
          if (this.message == "Успешно") {
            localStorage.setItem("id", this.id);
            localStorage.setItem("cart_id", cart_id);
            setTimeout(() => {
              this.message = "";
            }, 2500);
          }
          setTimeout(() => {
            this.message = "";
          }, 2500);
        }
      } catch (err) {
        console.log(err);
      }
    },

    close() {
      this.$emit("close", false);
    },
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="card">
    <div class="cancel">
      <span class="title">Регистрация</span>
      <img @click="close" src="../assets/close.png" alt="" />
    </div>
    <div class="group">
      <input
        type="text"
        name="username"
        v-model="username"
        placeholder="Введите свой логин"
      />
      <span class="group-value">Логин</span>
    </div>
    <div class="group">
      <input
        type="email"
        name="email"
        v-model="email"
        placeholder="Введите свою почту"
      />
      <span class="group-value">Email</span>
    </div>
    <button @click="log" v-if="!message" class="btn">Авторизоваться</button>
    <div
      class="msg"
      :class="{
        success: this.message == 'Успешно',
        error: this.message != 'Успешно',
      }"
      v-if="message"
    >
      {{ message }}
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  position: absolute;
  height: 100vh;
  width: 100%;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.card {
  min-width: 450px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 32px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #fff;
}

.title {
  font-size: 24px;
  font-weight: 700;
  line-height: 28.8px;
  color: #000;
}

.desc {
  opacity: 80%;
  font-weight: 500;
  font-size: 16px;
  line-height: 22.4px;
}

.btn {
  width: 100%;
  background-color: #aa6a2a;
  border-radius: 10px;
  padding: 17px 24px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.log {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.log span,
a {
  font-weight: 500;
  font-size: 14px;
  line-height: 19.6px;
}

a {
  color: #aa6a2a;
}

.cancel {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel img {
  cursor: pointer;
  height: 24px;
  width: 24px;
}

input {
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 16px;
}

input::placeholder {
  color: #a5a5a5;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
}

.forget_pass {
  text-align: end;
}

.group {
  position: relative;
}

.group-value {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  left: 12px;
  background-color: #fff;
  padding: 0 4px;
  color: #a5a5a5;
  font-weight: 500;
  font-size: 10px;
  line-height: 13.66px;
}

.card:hover {
  cursor: auto;
  transform: none;
}

.msg {
  padding: 10px 13px;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  border-radius: 15px;
  width: fit-content;
  margin: 0 auto;
}

.success {
  background-color: #45ed0b;
}

.error {
  background-color: #aa6a2a;
}

.nofillBorder {
  border: 1px solid #aa6a2a;
}

.nofillText {
  color: #aa6a2a;
}

@media (max-width: 680px) {
  .card {
    gap: 12px;
    min-width: 340px;
    padding: 20px;
  }
}
</style>
