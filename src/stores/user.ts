import { ref, watch } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import { ElMessage } from "element-plus";
import type { User } from "@/types/User";

export const useUserStore = defineStore("user", () => {
  const token = ref(sessionStorage.getItem("token") || "");

  watch(token, () => sessionStorage.setItem("token", token.value));

  function quit() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    router.push("/login");
    ElMessage({
      message: "已退出登录",
      type: "success",
    });
  }

  return { token, quit };
});
