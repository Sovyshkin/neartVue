import { createRouter, createWebHistory } from "vue-router";
import AppVue from "../App.vue";
import App404 from "../components/App_404.vue";
import AppMarket from "../components/AppMarket.vue";
import AppCart from "../components/AppCart.vue";
import MyMiners from "../components/MyMiners.vue";
import BlockFaq from "../components/BlockFaq.vue";
import AppProfile from "../components/AppProfile.vue";
import AppMain from "../components/AppMain.vue";
import ControlReset from "../components/СontrolReset.vue";
import MyPayments from "@/components/MyPayments.vue";
import AppAccruals from "@/components/AppAccruals.vue";
import AppDashboard from "@/components/AppDashboard.vue";
import AppProduct from "../components/AppProduct.vue";
import AppPayment from "../components/AppPayment.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: AppVue,
    },
    {
      path: "/404",
      name: "404",
      component: App404,
    },
    {
      path: "/marketplace",
      name: "marketplace",
      component: AppMarket,
    },
    {
      path: "/cart",
      name: "cart",
      component: AppCart,
    },
    {
      path: "/myminers",
      name: "myminers",
      component: MyMiners,
    },
    {
      path: "/support",
      name: "support",
      component: BlockFaq,
    },
    {
      path: "/profile",
      name: "profile",
      component: AppProfile,
    },
    {
      path: "/main",
      name: "main",
      component: AppMain,
    },
    {
      path: "/reset_password",
      name: "controlreset",
      component: ControlReset,
    },
    {
      path: "/mypayments",
      name: "mypayments",
      component: MyPayments,
    },
    {
      path: "/accruals",
      name: "accruals",
      component: AppAccruals,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: AppDashboard,
    },
    {
      path: "/product",
      name: "product",
      component: AppProduct,
    },
    {
      path: "/payment",
      name: "payment",
      component: AppPayment,
    },
  ],
});

export default router;
