<template>
  <div class="wrapper">
    <div class="wrap-card">
      <div class="wrap-cancel">
        <img
          @click="cancel()"
          class="cancel"
          src="../assets/close.png"
          alt=""
        />
      </div>
      <span class="title">{{ $t("moveSlider") }}</span>
      <div class="drag-verify-container">
        <div :style="dragVerifyImgStyle">
          <img
            ref="checkImg"
            :src="imgsrc"
            @load="checkimgLoaded"
            style="width: 100%"
          />
          <canvas ref="maincanvas" class="main-canvas"></canvas>
          <canvas
            ref="movecanvas"
            :style="movecanvasStyle"
            :class="{ goFirst: isOk, goKeep: isKeep }"
          ></canvas>
          <div class="refresh" v-if="showRefresh && !isPassing">
            <i :class="refreshIcon" @click="refreshimg"></i>
          </div>
          <div class="tips success" v-if="showTips && isPassing">
            {{ successTip }}
          </div>
          <div
            class="tips danger"
            v-if="showTips && !isPassing && showErrorTip"
          >
            {{ failTip }}
          </div>
        </div>
        <div
          ref="dragVerify"
          class="drag_verify"
          :style="dragVerifyStyle"
          @mousemove="dragMoving"
          @touchmove="dragMoving"
          @mouseup="dragFinish"
          @mouseleave="dragFinish"
          @touchend="dragFinish"
        >
          <div
            class="dv_progress_bar"
            :class="{ goFirst2: isOk }"
            ref="progressBar"
            :style="progressBarStyle"
          >
            {{ isPassing ? successText : "" }}
          </div>

          {{ isPassing ? "" : text }}

          <div
            class="dv_handler dv_handler_bg"
            :class="{ goFirst: isOk }"
            @mousedown="dragStart"
            @touchstart="dragStart"
            ref="handler"
            :style="handlerStyle"
          >
            <i :class="handlerIcon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "SliderImg",
  props: {
    width: {
      type: Number,
      default: 250,
    },
    height: {
      type: Number,
      default: 40,
    },
    text: {
      type: String,
      default: "",
    },
    successText: {
      type: String,
      default: "",
    },
    background: {
      type: String,
      default: "#eee",
    },
    progressBarBg: {
      type: String,
      default: "#76c61d",
    },
    completedBg: {
      type: String,
      default: "#76c61d",
    },
    handlerIcon: {
      type: String,
      default: "el-icon-d-arrow-right",
    },
    successIcon: {
      type: String,
      default: "el-icon-circle-check",
    },
    handlerBg: {
      type: String,
      default: "#fff",
    },
    textSize: {
      type: String,
      default: "14px",
    },
    textColor: {
      type: String,
      default: "#333",
    },
    imgsrc: {
      type: String,
      default: "https://i.imgur.com/FB9w44d.jpeg",
    },
    barWidth: {
      type: Number,
      default: 40,
    },
    barRadius: {
      type: Number,
      default: 8,
    },
    showRefresh: {
      type: Boolean,
      default: false,
    },
    refreshIcon: {
      type: String,
      default: "el-icon-refresh white",
    },
    showTips: {
      type: Boolean,
      default: true,
    },
    failTip: {
      type: String,
      default: "Неудачно, попробуйте еще раз",
    },
    diffWidth: {
      type: Number,
      default: 2,
    },
  },
  mounted: function () {
    const dragEl = this.$refs.dragVerify;
    dragEl.style.setProperty("--textColor", this.textColor);
    dragEl.style.setProperty("--width", Math.floor(this.width / 2) + "px");
    dragEl.style.setProperty("--pwidth", -Math.floor(this.width / 2) + "px");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  },
  computed: {
    movecanvasStyle: function () {
      return {
        left: -this.clipBarx + "px ",
        position: "absolute",
        top: 0,
      };
    },
    handlerStyle: function () {
      return {
        left: "0px",
        width: this.height + "px",
        height: this.height + "px",
        background: this.handlerBg,
      };
    },
    dragVerifyStyle: function () {
      return {
        width: this.width + "px",
        height: this.height + "px",
        lineHeight: this.height + "px",
        background: this.background,
      };
    },
    dragVerifyImgStyle: function () {
      return {
        width: this.width + "px",
        position: "relative",
        overflow: "hidden",
      };
    },
    progressBarStyle: function () {
      return {
        background: this.progressBarBg,
        height: this.height + "px",
        color: "white",
      };
    },
  },
  data() {
    return {
      successTip: "",
      beginTime: 0,
      endTime: 0,
      isPassing: false,
      isMoving: false,
      x: 0,
      isOk: false,
      isKeep: false,
      clipBarx: 0,
      showErrorTip: false,
    };
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateSlider", false);
    },

    draw: function (ctx, x, y, operation) {
      let l = this.barWidth;
      let r = this.barRadius;
      const PI = Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
      ctx.lineTo(x + l, y);
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
      ctx.lineTo(x + l, y + l);
      ctx.lineTo(x, y + l);
      ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
      ctx.lineTo(x, y);
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.stroke();
      ctx[operation]();
      ctx.globalCompositeOperation = "destination-over";
    },
    checkimgLoaded: function () {
      try {
        // Generate picture missing position
        let barWidth = this.barWidth;
        let imgHeight = this.$refs.checkImg.height;
        let imgWidth = this.$refs.checkImg.width;
        let halfWidth = Math.floor(this.width / 2);
        let refreshHeigth = 25;
        let tipHeight = 20;
        let x = halfWidth + Math.ceil(Math.random() * (halfWidth - barWidth));
        let y =
          refreshHeigth +
          Math.floor(
            Math.random() * (imgHeight - barWidth - refreshHeigth - tipHeight)
          );
        this.$refs.maincanvas.setAttribute("width", imgWidth);
        this.$refs.maincanvas.setAttribute("height", imgHeight);
        this.$refs.maincanvas.style.display = "block";
        let canvasCtx = this.$refs.maincanvas.getContext("2d");
        this.draw(canvasCtx, x, y, "fill");
        this.clipBarx = x;

        let moveCanvas = this.$refs.movecanvas;
        moveCanvas.setAttribute("width", imgWidth);
        this.$refs.movecanvas.style.display = "block";
        const L = barWidth + this.barRadius * 2 + 3; //Actual width
        let moveCtx = this.$refs.movecanvas.getContext("2d");
        moveCtx.clearRect(0, 0, imgWidth, imgHeight);
        this.draw(moveCtx, x, y, "clip");
        moveCtx.drawImage(this.$refs.checkImg, 0, 0, imgWidth, imgHeight);
        y = y - this.barRadius * 2 - 1;
        const ImageData = moveCtx.getImageData(x, y, L, L);
        moveCanvas.setAttribute("width", L);
        moveCanvas.setAttribute("height", imgHeight);
        moveCtx.putImageData(ImageData, 0, y);
      } catch (err) {
        console.log(err);
      }
    },
    dragStart: function (e) {
      this.beginTime = new Date().getTime();
      if (!this.isPassing) {
        this.isMoving = true;
        let handler = this.$refs.handler;
        this.x =
          (e.pageX || e.touches[0].pageX) -
          parseInt(handler.style.left.replace("px", ""), 10);
      }
      this.showErrorTip = false;
      this.$emit("handlerMove");
    },
    dragMoving: function (e) {
      if (this.isMoving && !this.isPassing) {
        let _x = (e.pageX || e.touches[0].pageX) - this.x;

        let handler = this.$refs.handler;
        handler.style.left = _x + "px";
        this.$refs.progressBar.style.width = _x + this.height / 2 + "px";
        this.$refs.movecanvas.style.left = _x - this.clipBarx + "px";
      }
    },
    dragFinish: function (e) {
      this.$nextTick(function () {
        // Код, который будет выполнен после обновления DOM
        if (this.isMoving && !this.isPassing) {
          let _x = (e.pageX || e.changedTouches[0].pageX) - this.x;
          if (Math.abs(_x - this.clipBarx) > this.diffWidth) {
            this.isOk = true;
            let that = this;
            // setTimeout(function () {
            //   that.$refs.handler.style.left = "0";
            //   that.$refs.progressBar.style.width = "0";
            //   (that.$refs.movecanvas.style.left = -this.clipBarx + "px"),
            //     (that.isOk = false);
            // }, 500);
            // this.showErrorTip = true;
          } else {
            this.passVerify();
          }
          this.isMoving = false;
        }
      });
    },
    passVerify: function () {
      this.$nextTick(function () {
        this.endTime = new Date().getTime();

        this.successTip =
          "Ты справился за" +
          " " +
          (this.endTime - this.beginTime) / 1000 +
          " " +
          "сек";
        this.isPassing = true;
        this.isMoving = false;
        let handler = this.$refs.handler;
        let dragVerify = this.$refs.dragVerify;
        dragVerify.style.display = "none";
        handler.children[0].className = this.successIcon;
        this.$refs.progressBar.style.background = this.completedBg;
        // this.$refs.message.style["-webkit-text-fill-color"] = "unset";
        // this.$refs.message.style.animation = "slidetounlock2 3s infinite";
        this.$refs.progressBar.style.color = "#fff";
        this.$refs.progressBar.style.fontSize = this.textSize;
        this.isKeep = true;
        setTimeout(() => {
          this.$refs.movecanvas.style.left = this.clipBarx + "px";
          setTimeout(() => {
            this.isKeep = false;
            this.$refs.maincanvas.style.display = "none";
            this.$refs.movecanvas.style.display = "none";
          }, 200);
        }, 100);
        setTimeout(() => {
          this.$emit("sliderVerify", false);
          // НЕ перезагружаем страницу автоматически
        }, 2500);
      });
    },
    reset: function () {
      this.reImg();
      this.checkimgLoaded();
    },
    reImg: function () {
      this.$emit("update:isPassing", false);
      const oriData = this.$options.data();
      for (const key in oriData) {
        if (oriData.hasOwnProperty(key)) {
          this.$set(this, key, oriData[key]);
        }
      }
      let handler = this.$refs.handler;
      let message = this.$refs.message;
      handler.style.left = "0";
      this.$refs.progressBar.style.width = "0";
      handler.children[0].className = this.handlerIcon;
      message.style["-webkit-text-fill-color"] = "transparent";
      message.style.animation = "slidetounlock 3s infinite";
      message.style.color = this.background;
      this.$refs.movecanvas.style.left = "0px";
    },
    refreshimg: function () {
      this.$emit("refresh");
    },
  },
  watch: {
    imgsrc: {
      immediate: false,
      handler: function () {
        this.reImg();
      },
    },
  },
};
</script>
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

.wrap-card {
  padding: 20px;
  background-color: #fff;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.title {
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
}
.cancel {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel img {
  cursor: pointer;
  height: 24px;
  width: 24px;
}
.drag_verify {
  
  position: relative;
  background-color: #e8e8e8;
  text-align: center;
  overflow: hidden;
}

.drag_verify .dv_handler {
  position: absolute;
  top: 0px;
  left: 0px;
  cursor: move;
  background-color: #E8336E !important;
}

.drag_verify .dv_handler i {
  color: #666;
  padding-left: 0;
  font-size: 16px;
}

.drag_verify .dv_handler .el-icon-circle-check {
  color: #6c6;
  margin-top: 9px;
}

.drag_verify .dv_progress_bar {
  position: absolute;
  height: 34px;
  width: 0px;
  background-color: #45ed0b !important;
  text-align: center;
}

.drag_verify .dv_text {
  position: absolute;
  top: 0px;
  color: transparent;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, let(--textColor)),
    color-stop(0.4, let(--textColor)),
    color-stop(0.5, #fff),
    color-stop(0.6, let(--textColor)),
    color-stop(1, let(--textColor))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-size-adjust: none;
  animation: slidetounlock 3s infinite;
}

.drag_verify .dv_text * {
  -webkit-text-fill-color: let(--textColor);
}

.goFirst {
  transition: left 0.5s;
}

.goKeep {
  transition: left 0.2s;
}

.goFirst2 {
  width: 0px !important;
  transition: width 0.5s;
}

.drag-verify-container {
  position: relative;
  line-height: 0;
}

.refresh {
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  font-size: 20px;
  z-index: 200;
}

.tips {
  position: absolute;
  bottom: 0;
  height: 20px;
  line-height: 20px;
  text-align: center;
  width: 100%;
  font-size: 12px;
  z-index: 200;
}

.tips.success {
  background: #fff;
  color: #45ed0b;
  font-weight: 600;
  font-size: 12px;
}

.tips.danger {
  background: rgba(0, 0, 0, 0.6);
  color: yellow;
}

.main-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.white {
  color: white;
}

img {
  
}

.wrap-cancel {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.cancel {
  height: 24px;
  width: 24px;
  cursor: pointer;
}

@-webkit-keyframes slidetounlock {
  0% {
    background-position: let(--pwidth) 0;
  }
  100% {
    background-position: let(--width) 0;
  }
}

@-webkit-keyframes slidetounlock2 {
  0% {
    background-position: let(--pwidth) 0;
  }
  100% {
    background-position: let(--pwidth) 0;
  }
}
</style>
