<script>
export default {
  name: "App_404",
  components: {},
  data() {
    return {};
  },
};
</script>
<template>
  <div class="background"></div>
  <div class="wrapper">
    <span class="err">404</span>
    <span class="oops">{{ $t("oops") }}</span>
    <button @click="this.$router.push({ name: 'main' })" class="btn">
      {{ $t("goBack") }}
    </button>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 80vh;
  z-index: 2;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.background {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.1;
}

.err {
  font-size: 128px;
  font-weight: 700;
  color: #E8336E;
  line-height: 153.8px;
  opacity: 50%;
}

.oops {
  opacity: 80%;
  font-weight: 500;
  font-size: 16px;
  line-height: 22.4px;
  color: black;
}

.btn {
  background-color: #E8336E;
  color: #fff;
  
  padding: 17px 24px;
  width: 224px;
  height: 50px;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}
</style>
