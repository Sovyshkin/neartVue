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
      auth: false,
      code: "",
      codeFill: false,
      id: '',
      cart_id: ''
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
          if (this.message == "Успешно") {
            // localStorage.setItem("id", this.id);
            // localStorage.setItem("cart_id", cart_id);
            this.auth = true
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
        this.message = err.response.data.detail
        setTimeout(() => {
            this.message = "";
          }, 4500);
      }
    },

    async verify() {
      try {
        console.log(this.email);
        if (this.code) {
          let response = await axios.post(`/code_input`, {
            code: this.code,
            email: this.email,
          });
          this.message = response.data.message;
          this.id = response.data.id;
          this.cart_id = response.data.cart_id;
          if (this.id) {
            localStorage.setItem("id", this.id);
            localStorage.setItem("cart_id", this.cart_id);
            setTimeout(() => {
              this.message = "";
              location.reload();
              this.$emit("close", true);
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
  <div class="card" v-if="!auth">
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
  <div class="card" v-else>
    <div class="cancel">
      <span class="title">Подтверждение</span>
      <img @click="close" src="../assets/close.png" alt="" />
    </div>
    <div class="group">
      <input
        type="text"
        name="code"
        v-model="code"
        placeholder="Введите код"
        :class="{
          nofillBorder: codeFill,
        }"
      />
      <span
        class="group-value"
        :class="{
          nofillText: codeFill,
        }"
        >Код из письма email</span
      >
    </div>
    <button @click="verify" v-if="!message" class="btn">Авторизация</button>
    <div
      class="msg"
      :class="{
        success: this.status == '200',
        error: this.status != '200',
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
  background-color: #E8336E;
  
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
  color: #E8336E;
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
  ;
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
  
  width: fit-content;
  margin: 0 auto;
}

.success {
  background-color: #45ed0b;
}

.error {
  background-color: #E8336E;
}

.nofillBorder {
  border: 1px solid black;
}

.nofillText {
  color: #E8336E;
}

@media (max-width: 680px) {
  .card {
    gap: 12px;
    min-width: 340px;
    padding: 20px;
  }
}
</style>
