import { systemName } from "@/main";
import { useUserStore } from "@/stores/user";
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
  type RouteRecordRaw,
} from "vue-router";
import menu from "@/router/menu";
import type { User } from "@/types/User";
import { Request } from "@/apis";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "登录",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/home",
      name: "主页",
      component: () => import("@/views/Home.vue"),
      children: [
        {
          path: "you",
          name: "你",
          component: () => import("@/views/home-pages/You.vue"),
        },
        ...menu,
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.path == "/login") return true;
  if (to.path != "/login" && !useUserStore().token) return "/login";
  else if (!canVisit(to, (await Request.User.getMe()).data[0])) return false;
  else return true;
});

router.afterEach((to) => {
  document.title = `${to.name?.toString()} | ${systemName}`;
});

export function canVisit(
  to: RouteLocationNormalizedGeneric | RouteRecordRaw,
  you: User,
) {
  if (["用户"].includes(to.name!.toString())) return you.userType == "ADMIN";
  return true;
}

export default router;
