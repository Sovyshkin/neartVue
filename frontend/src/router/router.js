import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "../stores/main.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../App.vue"),
    },
    {
      path: "/404",
      name: "404",
      component: () => import("../components/App_404.vue"),
    },
    {
      path: "/arts",
      name: "arts",
      component: () => import("../components/AppArts.vue"),
    },
    {
      path: "/arts/art",
      name: "art",
      component: () => import("../components/CardOpen.vue"),
    },
    {
      path: "/support",
      name: "support",
      component: () => import("../components/BlockFaq.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../components/AppProfile.vue"),
    },
    {
      path: "/reset_password",
      name: "controlreset",
      component: () => import("../components/СontrolReset.vue"),
    },
    {
      path: "/create_ticket",
      name: "createTicket",
      component: () => import("../components/CreateTicket.vue"),
    },
    {
      path: "/ticket",
      name: "ticket",
      component: () => import("../components/AppTicket.vue"),
    },
    {
      path: "/tickets",
      name: "tickets",
      component: () => import("../components/AppTickets.vue"),
    },
    {
      path: "/about-us",
      name: "aboutUs",
      component: () => import("../components/AboutUs.vue"),
    },
    {
      path: "/about",
      redirect: "/about-us"
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("../components/AppCart.vue"),
    },
    {
      path: "/checkout",
      name: "checkout",
      component: () => import("../components/AppCheckout.vue"),
    },
    {
      path: "/favorite",
      name: "favorite",
      component: () => import("../components/AppFavorite.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../components/AppAdmin.vue"),
    },
    {
      path: "/artists",
      name: "artists", 
      component: () => import("../components/AppArtists.vue"),
    },
    {
      path: "/artist/:id",
      name: "artist",
      component: () => import("../components/ArtistProfile.vue"),
    },
    {
      path: "/payment/success",
      name: "paymentSuccess",
      component: () => import("../components/PaymentSuccess.vue"),
    },
    {
      path: "/payment/error",
      name: "paymentError",
      component: () => import("../components/PaymentError.vue"),
    },
    {
      path: "/public-offer",
      name: "publicOffer",
      component: () => import("../components/PublicOffer.vue"),
    },
    {
      path: "/privacy-policy",
      name: "privacyPolicy",
      component: () => import("../components/PrivacyPolicy.vue"),
    },
  ],
});

// Navigation guards для управления глобальной анимацией загрузки
router.beforeEach((to, from, next) => {
  const mainStore = useMainStore();
  
  // Включаем анимацию загрузки только при навигации между разными страницами
  if (to.path !== from.path) {
    mainStore.setPageLoading(true);
  }
  
  next();
});

router.onError((error) => {
  console.error('Router error:', error);
  const mainStore = useMainStore();
  mainStore.setPageLoading(false);
  mainStore.showErrorMsg('Ошибка загрузки страницы');
});

router.afterEach(() => {
  const mainStore = useMainStore();
  
  // Выключаем анимацию загрузки после завершения навигации
  // Добавляем небольшую задержку для плавности анимации
  setTimeout(() => {
    mainStore.setPageLoading(false);
  }, 300);
});

export default router;
