import { createRouter, createWebHistory } from "vue-router";

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
      path: "/cart",
      name: "cart",
      component: () => import("../components/AppCart.vue"),
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
      path: "/admin/add/art",
      name: "addart",
      component: () => import("../components/CreateArt.vue"),
    },
    {
      path: "/admin/add/artist",
      name: "addartist",
      component: () => import("../components/CreateArtist.vue"),
    },
    {
      path: "/admin/edit/artist",
      name: "editArtist",
      component: () => import("../components/EditArtist.vue"),
    },
  ],
});

export default router;
