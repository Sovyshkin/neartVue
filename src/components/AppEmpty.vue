<script>
export default {
  name: "AppEmpty",
};
</script>
<template>
  <div class="empty">
    <img src="../assets/empty.png" alt="" />
    <span>Ничего нет</span>
  </div>
</template>
<style scoped>
.empty {
  width: 100%;
  height: 50vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: large;
  line-height: 2rem;
  opacity: 80%;
}
</style>
