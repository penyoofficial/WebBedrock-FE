import type { RouteRecordRaw } from "vue-router";

const menu: RouteRecordRaw[] = [
  {
    path: "users",
    name: "用户",
    component: () => import("@/views/home-pages/Users.vue"),
  },
  {
    path: "nekos",
    name: "猫猫",
    component: () => import("@/views/home-pages/Nekos.vue"),
  },
];

export default menu;
