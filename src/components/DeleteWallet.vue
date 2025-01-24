<script>
export default {
  name: "DeleteWallet",
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateDeleteWallet", false);
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
      <div class="title">{{ $t("deletionWallet") }}</div>
      <div class="desc">{{ $t("sureDeleteWallet") }} {{ this.wallet }}</div>
      <div class="wrap_btns">
        <button class="btn">{{ $t("delete") }}</button>
        <button class="btn btn-cancel">{{ $t("cancelAction") }}</button>
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
  border-radius: 20px;
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
  background-color: #aa6a2a;
  border-radius: 10px;
  padding: 17px 24px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.btn-cancel {
  background-color: #fff;
  border: 1px solid #aa6a2a;
  color: #aa6a2a;
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
  color: #aa6a2a;
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
