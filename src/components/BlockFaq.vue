<script>
export default {
  name: "BlockFaq",
  components: {},
  data() {
    return {
      cards: [
        {
          qst: "Как выбрать подходящую картину?",
          ans: `При выборе картины обратите внимание на следующие факторы:
          <ul class="group-list">
            <li class="group-item">Стиль и техника художника</li>
            <li class="group-item">Тематика и композиция</li>
            <li class="group-item">Цветовая гамма и настроение</li>
            <li class="group-item">Качество исполнения</li>
            <li class="group-item">Размер и формат</li>
            <li class="group-item">Цена в сравнении с другими работами художника</li>
          </ul>
          <p>Важно выбрать картину, которая вам нравится и соответствует вашим предпочтениям. Не стоит покупать что-то только потому, что оно "продаваемое".</p>`,
          open: false,
        },
        {
          qst: "Как мы определяем стоимость картины?",
          ans: `Цена картины зависит от нескольких факторов:
          <ul class="group-list">
            <li class="group-item">Техника и качество исполнения</li>
            <li class="group-item">Размер и сложность работы</li>
            <li class="group-item">Стоимость материалов</li>
            <li class="group-item">Ценовая политика галереи</li>
          </ul>`,
          open: false,
        },
        {
          qst: "Какие гарантии мы предоставляем?",
          ans: `Мы предоставляем следующие гарантии:
          <ul class="group-list">
            <li class="group-item">Качество исполнения и материалов</li>
            <li class="group-item">Автентичность произведения</li>
            <li class="group-item">Долгосрочное сохранение цвета и фактуры</li>
            <li class="group-item">Возможность реставрации при необходимости</li>
            <li class="group-item">Постпродажный сервис по консультациям и уходу</li>
            <li class="group-item">Гарантии помогают клиенту чувствовать себя уверенно при покупке картины</li>
          </ul>`,
          open: false,
        },
        {
          qst: "Как долго занимает доставка картины?",
          ans: `Срок доставки зависит от нескольких факторов:
          <ul class="group-list">
            <li class="group-item">Расстояние между местоположением галереи и клиентом</li>
            <li class="group-item">Тип транспортировки (почта, курьерская служба)</li>
            <li class="group-item">Составление заказа и обработка платежа</li>
          </ul>
          <p>В среднем доставка занимает от нескольких дней до недели. Мы предоставляем точную информацию о сроках доставки при оформлении заказа.</p>`,
          open: false,
        },
      ],
    };
  },
  methods: {
    goCreate() {
      let token = localStorage.getItem("token");
      if (token) {
        this.$router.push({ name: "createTicket" });
      } else {
        this.$emit("updateLogin", true);
      }
    },
    goTickets() {
      let token = localStorage.getItem("token");
      if (token) {
        this.$router.push({ name: "tickets" });
      } else {
        this.$emit("updateLogin", true);
      }
    },
  },
  async mounted() {},
};
</script>
<template>
  <div class="wrapper">
    <h2>Часто задаваемые вопросы</h2>
    <!-- <div class="wrap-title">
      <div class="wrap-btns" v-if="$route.name == 'support'">
        <button @click="goCreate" class="btn">{{ $t("createTicket") }}</button>
        <button @click="goTickets" class="btn myTickets">
          {{ $t("myTickets") }}
        </button>
      </div>
    </div> -->

    <div class="cards">
      <div
        class="card"
        v-for="card in cards"
        :key="card"
        @click="card.open = !card.open"
        :class="{ active: card.open }"
      >
        <div class="info">
          <span class="qst">{{ card.qst }}</span>
          <img
            v-if="!card.open"
            class="arr"
            src="../assets/arrow-down.png"
            alt=""
          />
          <img
            v-if="card.open"
            class="arr rot"
            src="../assets/arrow-down.png"
            alt=""
          />
        </div>
        <div v-if="card.open" class="ans" v-html="card.ans"></div>
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
}

.wrap-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.btn {
  background-color: #E8336E;
  color: #fff;
  border: 1px solid black;
  
  padding: 12px 17px;
  width: 224px;
  height: 50px;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 500ms ease;
}

.card {
  cursor: pointer;
  width: 100%;
  padding: 30px;
  
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 500ms ease;
}

.card:hover {
  transform: scale(1.02);
}

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.arr {
  width: 24px;
  height: 24px;
}

.rot {
  transform: rotate(180deg);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.ans {
  animation-name: fade-in;
  animation-duration: 0.5s; /* Задержка анимации */
  animation-fill-mode: forwards; /* Элемент останется в состоянии после окончания анимации */
  font-size: 1.2rem;
  line-height: 1.5rem;
  font-weight: 500;
  transition: all 500ms ease;
}

.qst {
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  color: #0f0f0f;
  transition: all 500ms ease;
}

.active {
  transform: scale(1.02);

  transition: all 500ms ease;
}

.wrap-btns {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.myTickets {
  background-color: transparent;
  border: 1px solid black;
  color: #E8336E;
}
</style>
