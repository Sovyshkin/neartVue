<script>
export default {
  name: "GoTry",
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateGoTry", false);
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
      <div class="title">{{ $t("needRegister") }}</div>
      <div class="desc">
        {{ $t("needAccount") }}
      </div>
      <button @click="this.$emit('updateRegister', true)" class="btn">
        {{ $t("register") }}
      </button>
      <div class="log">
        <span>{{ $t("haveAccount") }}</span>
        <a href="#" @click="this.$emit('updateLogin', true)">{{
          $t("login")
        }}</a>
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
}
</style>
