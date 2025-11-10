<script>
import axios from "axios";

export default {
  name: "FormFeedback",
  data() {
    return {
      code: "",
      message: "",
      phone: "+7",
      name: "",
      agreement: false,
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.phone ? this.phone.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateFormFeedback", false);
    },

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

    async send() {
      try {
        if (this.name && this.phone) {
          this.message = "Отправка заявки...";
          let response = await this.$api.feedback.create({
            name: this.name,
            phone: this.phone,
          });
          
          // Обработка ответа от API
          if (response.status === 200 || response.status === 201) {
            this.message = "Заявка успешно отправлена! Ожидайте звонка.";
            // Очищаем форму после успешной отправки
            this.name = "";
            this.phone = "";
            setTimeout(() => {
              this.message = "";
              this.cancel(); // Закрываем форму
            }, 3000);
          } else {
            this.message = response.data.message || "Ошибка при отправке заявки";
            setTimeout(() => { this.message = ""; }, 3000);
          }
        } else {
          this.message = "Пожалуйста, заполните все поля";
          setTimeout(() => {
            this.message = "";
          }, 3000);
        }
      } catch (err) {
        console.log('Ошибка отправки заявки:', err);
        this.message = err.response?.data?.error?.message || "Ошибка при отправке заявки";
        setTimeout(() => {
          this.message = "";
        }, 3000);
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
      <div class="title">{{ $t("orderFeedback") }}</div>
      <div class="group">
        <input
          type="text"
          name="name"
          id="name"
          v-model="name"
          :placeholder="$t('enterName')"
        />
        <span class="group-value">{{ $t("name") }}</span>
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
      <div class="agreement">
        <label class="toggler-wrapper style-27">
          <input type="checkbox" v-model="agreement" />
          <div class="toggler-slider">
            <div
              class="toggler-knob"
              :data-i18n-after="$t('checkbox_yes')"
              :data-i18n-before="$t('checkbox_no')"
            ></div>
          </div>
        </label>
        <span class="agreement-text">{{ $t("agreement") }}</span>
      </div>
      <div class="wrap_btns" v-if="!message">
        <button @click="send" class="btn" :class="{ disabled: !agreement }">
          {{ $t("send") }}
        </button>
      </div>
      <div
        class="msg"
        :class="{
          success: this.message == 'Успешно, ожидайте звонка!',
          error: this.message != 'Успешно, ожидайте звонка!',
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 32px;
  
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
  background-color: #E8336E;
  border: none;
  border-radius: 16px;
  padding: 17px 24px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.btn-cancel {
  background-color: #fff;
  border: 1px solid black;
  border-radius: 16px;
  color: #E8336E;
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
  color: #E8336E;
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
  border-radius: 16px;
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
.agreement {
  display: flex;
  align-items: center;
  gap: 7px;
}

.toggler-wrapper {
  display: block;
  width: 45px;
  height: 25px;
  cursor: pointer;
  position: relative;
}

.toggler-wrapper input[type="checkbox"] {
  display: none;
}

.toggler-wrapper input[type="checkbox"]:checked + .toggler-slider {
  background-color: #44cc66;
}

.toggler-wrapper .toggler-slider {
  background-color: #ccc;
  position: absolute;
  border-radius: 100px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;
}

.toggler-wrapper .toggler-knob {
  position: absolute;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;
}
.toggler-wrapper.style-27 {
  width: 54px;
  height: 30px;
}

.toggler-wrapper.style-27
  input[type="checkbox"]:checked
  + .toggler-slider
  .toggler-knob:before {
  left: -100%;
}

.toggler-wrapper.style-27
  input[type="checkbox"]:checked
  + .toggler-slider
  .toggler-knob:after {
  right: 3px;
}

.toggler-wrapper.style-27 .toggler-knob {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.toggler-wrapper.style-27 .toggler-knob:before {
  content: "No";
  position: absolute;
  width: calc(30px - 6px);
  height: calc(30px - 6px);
  border-radius: 50%;
  left: 3px;
  top: 3px;
  background-color: #fff;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 75%;
  font-weight: 500;
}

.toggler-wrapper.style-27 .toggler-knob:after {
  content: "Yes";
  position: absolute;
  width: calc(30px - 6px);
  height: calc(30px - 6px);
  border-radius: 50%;
  right: -100%;
  top: 3px;
  background-color: #fff;
  -webkit-transition: all 300ms ease;
  transition: all 300ms ease;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 75%;
  font-weight: 500;
}

.toggler-wrapper.style-27 .toggler-knob[data-i18n-before]::before {
  content: attr(data-i18n-before);
}

.toggler-wrapper.style-27 .toggler-knob[data-i18n-after]::after {
  content: attr(data-i18n-after);
}

.agreement-text {
  color: #a5a5a5;
  font-weight: 500;
  font-size: 10px;
  line-height: 13.66px;
}

.disabled {
  cursor: not-allowed;
}
</style>
