<script>
export default {
  name: "CreateTicket",
  components: {},
  data() {
    return {
      title: "",
      text: "",
    };
  },
  methods: {
    async create() {
      try {
        let response = await this.$api.tickets.create({
          title: this.title,
          text: this.text,
        });
        console.log(response);
        if (response.data.data) {
          let id = response.data.data.id;
          this.$router.push({ name: "ticket", query: { id: id } });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  async mounted() {},
};
</script>
<template>
  <div class="wrapper">
    <div class="wrap-title">
      <img
        @click="$router.go(-1)"
        class="back"
        src="../assets/back.png"
        alt=""
      />
      <h1>{{ $t("creationTicket") }}</h1>
    </div>
    <div class="group">
      <input
        type="text"
        name="theme"
        id="theme"
        v-model="title"
        :placeholder="$t('enterTheme')"
      />
      <span class="group-value">{{ $t("theme") }}</span>
    </div>
    <div class="group">
      <textarea
        name="desc"
        id="desc"
        v-model="text"
        :placeholder="$t('enterDesc')"
      />
      <span class="group-value">{{ $t("desc") }}</span>
    </div>
    <button @click="create" class="btn">{{ $t("createTicket") }}</button>
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
  min-height: calc(100vh - 200px);
}

input,
textarea {
  width: 100%;
  border: 1px solid black;
  ;
  padding: 16px;
  outline: none;
}

input::placeholder,
textarea::placeholder {
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
  background-color: #f0f0f5;
  left: 12px;
  padding: 0 4px;
  color: #E8336E;
  font-weight: 500;
  font-size: 10px;
  line-height: 13.66px;
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
