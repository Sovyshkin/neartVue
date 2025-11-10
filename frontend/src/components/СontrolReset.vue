<script>

export default {
  name: "ControlReset",
  data() {
    return {
      new_password: "",
      new_password2: "",
      token: this.$route.query.token,
      message: "",
    };
  },
  methods: {
    cancel() {
      this.$router.push({ name: "home" });
    },

    async save() {
      try {
        if (this.new_password == this.new_password2) {
          let response = await this.$api.auth.resetPassword(this.token, this.new_password);
          console.log(response);
          this.message = response.data.message;
          if (this.message == "ok") {
            this.message = this.$t("success");
          }
        } else {
          this.message = "Пароли не совпадают!";
        }
        setTimeout(() => {
          this.message = "";
        }, 2500);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {},
};
</script>
<template>
  <div class="wrapper">
    <div class="card">
      <div class="cancel">
        <span class="title">{{ $t("comeUpPass") }}</span>
        <img @click="cancel" src="../assets/close.png" alt="" />
      </div>
      <div class="group">
        <input
          type="password"
          name="password"
          v-model="new_password"
          :placeholder="this.$t('enterNewPassword')"
        />
        <span class="group-value">{{ $t("newPass") }}</span>
      </div>
      <div class="group">
        <input
          type="password"
          name="password2"
          v-model="new_password2"
          :placeholder="$t('enterNewPassAgain')"
        />
        <span class="group-value">{{ $t("passAgain") }}</span>
      </div>
      <button @click="save" v-if="!message" class="btn">
        {{ $t("save") }}
      </button>
      <div
        class="msg"
        :class="{
          success: this.message == 'Успешно',
          error: this.message == 'Пароли не совпадают!',
        }"
        v-if="message"
      >
        {{ message }}
      </div>
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
  width: 450px;
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
  border-radius: 16px;
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

.red {
  color: #E8336E;
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
</style>
