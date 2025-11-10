<template>
  <div class="wrapper" :class="{'small': height == 'small'}">
    <orbit-spinner :animation-duration="1200" :size="55" color="#E8336E" />
  </div>
</template>

<script>
import { OrbitSpinner } from "epic-spinners";
export default {
  name: "LoadingSpinner",
  components: {
    OrbitSpinner,
  },
  props: {
    height: String
  }
};
</script>

<style scoped>
.wrapper {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.small {
  height: 100% !important;
}
</style>
