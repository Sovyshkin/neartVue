<script>
export default {
  name: "Block_1",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<template>
  <div class="wrapper">
    <button class="btn" @click="$router.push({ name: 'arts' })">
      Начни выбирать уже сейчас
    </button>
    <div class="background"></div>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 92vh;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("https://i.imgur.com/Hg1CFFb.jpeg 768w) 1x, url(https://i.imgur.com/Hg1CFFb.jpeg 2560w");

  background-repeat: no-repeat;
  background-size: cover;
}

.btn {
  z-index: 2;
  box-shadow: 0 22px 70px 4px #0000008f;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #fff;
  background-color: #E8336E;
  padding-bottom: 0.625rem;
  padding-top: 0.625rem;
  padding-left: 0.875rem;
  padding-right: 0.875rem;
}
</style>
