<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "AppProfile",
  components: { LoadingSpinner },
  data() {
    return {
      active: 1,
      id: "",
      email: "",
      admin: "",
      status: "",
      message: "",
      isLoading: false,
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.phone ? this.phone.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (input.length > 12) {
        input = input.slice(0, 12);
      }
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.phone = input;
      e.target.value = this.formatPhoneNumber;
    },

    async load_info() {
      try {
        this.isLoading = true;
        this.id = localStorage.getItem("id");
        if (this.id) {
          let response = await axios.post(`/get_user/${this.id}`);
          console.log(response);
          this.email = response.data.email;
          this.admin = response.data.is_admin;
        }
      } catch (err) {
        console.log(err);
        localStorage.clear();
        location.reload();
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile() {
      try {
        let response = await axios.post(
          "/users/updateProfile",
          {
            id: localStorage.getItem("id"),
            firstname: this.firstname,
            lastname: this.lastname,
            profiletype: this.profiletype,
            email: this.email,
            phone: this.phone,
            country: this.country,
            address: this.address,
            inn: this.inn,
            telegram: this.telegram,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.message = response.data.message;
        if (this.message == "ok") {
          this.message = this.$t("success");
        } else {
          this.message = "Ошибка";
        }
        setTimeout(() => {
          this.message = "";
          this.load_info();
        }, 2500);
      } catch (err) {
        console.log(err);
      }
    },

    exit() {
      localStorage.clear();
      location.reload();
    },
    goChange(b) {
      this.$emit("updateAvatar", b);
    },

    check() {
      this.id = localStorage.getItem("id");
      if (!this.id) {
        this.$router.push({ name: "home" });
      } else {
        this.load_info();
      }
    },

    goAdmin() {
      this.$router.push({ name: "admin", query: { name: "arts" } });
    },
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.check();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <h2>{{ $t("profile") }}</h2>
    <div class="wrap_btns">
      <button
        @click="this.active = 1"
        class="btn"
        :class="{ active: this.active == 1 }"
      >
        Личная информация
      </button>
      <button @click="goAdmin()" v-if="admin" class="btn">Админка</button>
    </div>
    <div class="info" v-if="active == 1">
      <div class="personal">
        <h3>{{ $t("personalData") }}</h3>
        <div class="personal_info">
          <div class="group-avatar">
            <img class="avatar" v-if="image" :src="image" alt="" />
            <img class="avatar" v-else src="../assets/profile.png" alt="" />
            <span class="change_avatar" @click="goChange(true)">{{
              $t("changePhoto")
            }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="login"
              v-model="login"
              placeholder="Придумайте себе имя пользователя"
            />
            <span class="group-value">Имя пользователя</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="firstname"
              v-model="firstname"
              :placeholder="$t('enterName')"
            />
            <span class="group-value">{{ $t("name") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="lastname"
              v-model="lastname"
              :placeholder="$t('enterSurname')"
            />
            <span class="group-value">{{ $t("surname") }}</span>
          </div>
          <div class="group">
            <input
              type="email"
              name="email"
              v-model="email"
              :placeholder="$t('enterEmail')"
            />
            <span class="group-value">Email</span>
          </div>
          <div class="group">
            <input
              :value="formatPhoneNumber"
              @input="updateValue($event)"
              type="tel"
              size="20"
              maxlength="12"
              required
              name="number"
              placeholder="+7"
            />
            <span class="group-value">{{ $t("phone") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="address"
              v-model="address"
              :placeholder="$t('enterAddress')"
            />
            <span class="group-value">{{ $t("address") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="telegram"
              v-model="telegram"
              :placeholder="$t('enterTelegram')"
            />
            <span class="group-value">Telegram</span>
          </div>
          <button v-if="!this.message" class="btn" @click="updateProfile">
            {{ $t("refreshInfo") }}
          </button>
          <div
            class="msg"
            :class="{
              success: this.message == 'Успешно',
              error: this.message == 'Ошибка',
            }"
            v-if="message"
          >
            {{ message }}
          </div>
        </div>
        <button @click="exit()" class="btn exit">Выйти</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
}

.wrap_btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info,
.fa2,
.wallet {
  display: flex;
  gap: 30px;
}

.personal,
.pass,
.connect_wallet,
.current_wallet,
.open,
.confirmation {
  flex: 50%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.personal_info,
.pass_info,
.wallet_info,
.connect_info,
.open_info,
.confirmation_info {
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #fff;
}

.personal_info button,
.pass_info button,
.wallet_info button,
.connect_info button,
.open_info button,
.confirmation_info button {
  background-color: #aa6a2a;
  color: #fff;
}

input,
select {
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
.btn {
  border-radius: 10px;
  background-color: #fff;
  padding: 14.5px 24px;
  box-shadow: none;
  font-size: 15px;
  line-height: 15px;
  font-weight: 600;
  transition: all 400ms ease;
}

.active {
  background-color: #aa6a2a;
  color: #fff;
}

.text {
  font-size: 16px;
  line-height: 25.6px;
  color: #000;
  font-weight: 500;
}

h3 {
  font-size: 20px;
  line-height: 20px;
  font-weight: 600;
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

.qr {
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  flex-direction: column;
  gap: 20px;
}

.exit {
  background-color: #cf0032;
  color: #fff;
}

.group-avatar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  object-fit: cover;
}

.change_avatar {
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #aa6a2a;
  text-decoration: underline;
  cursor: pointer;
}

.enabled {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.enabled img {
  height: 100px;
}

.enabled {
  background-color: #fff;
  padding: 20px 10px;
  border-radius: 20px;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}

.enabled button {
  margin-top: 20px;
}
@media (max-width: 980px) {
  .info,
  .wallet,
  .fa2 {
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .wrap_btns {
    flex-direction: column;
  }

  .wrap_btns button {
    width: 100%;
  }
}
</style>
