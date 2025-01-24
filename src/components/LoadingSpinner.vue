<template>
  <div class="wrapper">
    <orbit-spinner :animation-duration="1200" :size="55" color="#aa6a2a" />
  </div>
</template>

<script>
import { OrbitSpinner } from "epic-spinners";
export default {
  name: "LoadingSpinner",
  components: {
    OrbitSpinner,
  },
};
</script>

<style scoped>
.wrapper {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
