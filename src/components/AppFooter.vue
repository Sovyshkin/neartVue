<script>
import axios from "axios";
import AppLogo from "./AppLogo.vue";
export default {
  name: "AppFooter",
  components: {AppLogo},
  data() {
    return {
      lang: this.$i18n.locale,
      names: {
        marketplace: "Маркет",
        main: "Главная",
        dashboard: "Приборная панель",
        myminers: "Мои майнеры",
        mypayments: "Мои платежи",
        accruals: "Начисления и списания",
        cart: "Корзина",
        support: "Центр помощи",
        profile: "Профиль",
      },
      id: null,
      avatar: "",
      countries: ["RU", "EN", "HE"],
      active: false,
    };
  },
  props: {
    login: Boolean,
  },
  methods: {
    scrollToBottom(name) {
      const element = document.getElementById(name);
      if (element) {
        window.scrollTo({ top: element.offsetTop, behavior: "smooth" });
      } else {
        this.$router.push({ name: "main" });
      }
    },

    async verify_token() {
      try {
        let response = await axios.post(
          `/auth/validate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let message = response.data.message;
        console.log(response);
        if (message != "ok") {
          this.$router.push({ name: "home" });
        }
      } catch (err) {
        console.log(err);
        let token = this.$route.query.token;
        if (!token) {
          localStorage.clear();
          this.$router.push({ name: "home" });
        }
      }
    },
    goRoute(name) {
      try {
        this.$router.push({ name: name });
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
    <AppLogo :color="'white'"/>
    <nav class="group">
      <li class="item-group" @click="goRoute('home')">Главная</li>
      <li @click="goRoute('arts')" class="item-group">Картины</li>
      <li class="item-group" @click="goRoute('aboutUs')">О нас</li>
    </nav>
    <div class="info">
      <span class="text">&copy;2025 НеХудожник | Все права защищены</span>
      <a
        href="https://t.me/vselena_deva"
        target="_blank"
        rel="noopener noreferrer"
        class="contacts"
      >
        <img src="../assets/Telegram.svg" alt="" />
        <span class="number">@vselena_deva</span>
      </a>
      <div class="group-span">
        <span class="text">{{ $t("policy") }}</span>
        <span class="text">{{ $t("offer") }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  min-height: 80px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  justify-content: space-between;
  background-color: #202020;
  margin-bottom: 0px;
  transform: translateY(100%);
}

.text {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #fff;
  opacity: 50%;
}

.contacts {
  transform: translateX(-15px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.flag {
  height: 14px;
}

.arrow {
  height: 20px;
  width: 20px;
}

.item-group {
  color: #fff;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  cursor: pointer;
}

.contacts span {
  color: #fff;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
}

.item-group::after {
  margin-top: 2px;
  background-color: #E8336E; /* Цвет линии при наведении на нее курсора мыши */
  display: block;
  content: "";
  height: 2px; /* Высота линии */
  width: 0%;
  -webkit-transition: width 0.4s ease-in-out;
  -moz--transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}
.item-group:hover:after,
.item-group:focus:after {
  width: 100%;
}

.lan {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  cursor: pointer;
}

.all_flags {
  position: absolute;
  padding: 3px 7px;
  transform: translateY(-60px);
  ;
  background-color: #fff;
  box-shadow: 0 0 10px 0 #00000037;
  z-index: 3;
}

.group-country {
  display: flex;
  align-items: center;
  gap: 6px;
}

.name-country {
  font-size: 14px;
  color: #fff;
  line-height: 14px;
  font-weight: 500;
}

.contacts img {
  height: 28px;
  width: 28px;
  cursor: pointer;
  transition: all 500ms ease;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 60px;
  cursor: pointer;
}

.mainLogo {
  width: 70px;
}

.logoText {
  width: 180px;
  padding-top: 10px;
}

.contacts img:hover {
  transform: translateY(-3px);
}

.info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.group {
  display: flex;
  align-items: center;
  gap: 60px;
  list-style-type: none;
}

.group-span {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.number {
  direction: ltr !important;
}

@media (max-width: 850px) {
  .info {
    flex-direction: column;
  }
  .group-span {
    align-items: center;
  }

  .contacts {
    transform: none;
  }
}

@media (max-width: 769px) {
  .wrapper {
    padding: 20px 40px 100px 40px;
  }
}

@media (max-width: 500px) {
  .contacts {
    gap: 6px;
  }

  .group {
    gap: 20px;
  }
}
</style>
