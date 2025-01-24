<script>
import axios from "axios";

export default {
  name: "DeleteAuth",
  data() {
    return {
      code: "",
      message: "",
      status: "",
    };
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateDeleteAuth", false);
    },

    async disableMFA() {
      try {
        if (this.code) {
          let response = await axios.post(
            `/auth/mfa/disable`,
            {
              code: this.code,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(response);
          let status = response.data.status;
          this.status = response.status;
          if (status == "ok") {
            this.message = this.$t("success");
            setTimeout(() => {
              location.reload();
            }, 2500);
          } else {
            this.status = 400;
            let desc = response.data.description;
            if (desc == "Wrong mfa code") {
              this.message = this.$t("wrongCode");
            } else {
              this.message = desc;
              this.status = 400;
            }
            setTimeout(() => {
              this.message = "";
              this.status = "";
            }, 2500);
          }
        }
      } catch (err) {
        console.log(err);
        let status = err.data.description;
        if (status == "Wrong mfa code") {
          this.status = 400;
          this.message = this.$t("wrongCode");
        } else {
          this.message = status;
          this.status = 400;
        }
      }
    },
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  },
};
</script>
<template>
  <div class="wrapper">
    <div class="card">
      <div class="cancel">
        <img @click="cancel" src="../assets/close.png" alt="" />
      </div>
      <div class="title">{{ $t("confirmAction") }}</div>
      <div class="desc">
        {{ $t("lowerSec") }}
      </div>
      <div class="group">
        <input
          type="text"
          name="code"
          id="code"
          v-model="code"
          placeholder="Введите код"
        />
        <span class="group-value">{{ $t("code2fa") }}</span>
      </div>
      <div class="wrap_btns" v-if="!status">
        <button @click="cancel" class="btn">{{ $t("cancelAction") }}</button>
        <button @click="disableMFA()" class="btn btn-cancel">
          {{ $t("delete") }}
        </button>
      </div>
      <div
        class="msg"
        :class="{
          success: this.status == 200,
          error: this.status != 200,
        }"
        v-if="status"
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
  font-size: 28px;
  font-weight: 700;
  line-height: 33.6px;
  color: #000;
}

.desc {
  opacity: 80%;
  font-weight: 500;
  font-size: 16px;
  line-height: 22.4px;
}

.wrap_btns {
  display: flex;
  align-items: center;
  gap: 10px;
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

.btn-cancel {
  background-color: #fff;
  border: 1px solid #aa6a2a;
  color: #aa6a2a;
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
  font-size: 16px;
  line-height: 22.4px;
}

a {
  color: #aa6a2a;
}

.cancel {
  position: absolute;
  top: 3%;
  right: 2%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.cancel img {
  cursor: pointer;
  height: 24px;
  width: 24px;
}

.card:hover {
  cursor: auto;
  transform: none;
  box-shadow: none;
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
</style>
