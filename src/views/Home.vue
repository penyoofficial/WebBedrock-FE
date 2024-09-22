<script setup lang="ts">
import { Request } from "@/apis";
import { systemName } from "@/main";
import router, { canVisit } from "@/router";
import menu from "@/router/menu";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";
import { ElMessageBox } from "element-plus";
import { ref, watch } from "vue";
import type { RouteRecordRaw } from "vue-router";

const user = ref<User>();
Request.User.getMe().then((resp) => {
  user.value = resp.data;
});

function handleQuit() {
  ElMessageBox.confirm("确定要退出登录吗？", "再次确认", {
    confirmButtonText: "是的",
    cancelButtonText: "手滑了",
  }).then(() => useUserStore().quit());
}

const tags = ref<RouteRecordRaw[]>([]);

function openTag(r: RouteRecordRaw) {
  if (!tags.value.filter((t) => t.path == r.path).length) tags.value.push(r);
  router.push("/home/" + r.path);
}

function closeTag(index: number) {
  tags.value.splice(index, 1);
  router.push(tags.value[index]?.path || tags.value[index - 1]?.path || "/home");
}

router.push("/home");

const menuSelectedPath = ref();

watch(router.currentRoute, (n) => (menuSelectedPath.value = n.path));
</script>

<template>
  <el-container v-if="user">
    <el-header class="g-shadow">
      <div class="flex">
        <div class="left">
          <el-text class="logo">
            <h1>{{ systemName }}</h1>
          </el-text>
        </div>
        <div class="center"></div>
        <div class="right">
          <div>
            <el-button
              type="primary"
              text
              @click="
                () => {
                  const r = {
                    path: 'you',
                    name: '你',
                  };
                  openTag(r as RouteRecordRaw);
                }
              "
              >{{ user.loginName }}</el-button
            >
          </div>
          <div>
            <el-button type="info" text @click="handleQuit">
              退出登录
            </el-button>
          </div>
        </div>
      </div>
    </el-header>
    <el-container class="view">
      <el-aside class="aside">
        <el-menu :default-active="menuSelectedPath">
          <template v-for="e of menu">
            <el-menu-item
              v-if="canVisit(e, user)"
              :index="'/home/' + e.path"
              @click="openTag(e)"
            >
              <span>{{ e.name }}管理</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="tags">
          <el-tag
            v-for="(t, i) in tags"
            :key="t.path"
            size="large"
            :type="$route.path.endsWith(t.path) ? 'warning' : 'primary'"
            closable
            @click="openTag(t)"
            @close="closeTag(i)"
            >{{ t.name }}</el-tag
          >
        </div>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.flex {
  display: flex;
  height: 100%;

  & > * {
    flex: 1;
    display: flex;
    vertical-align: bottom;

    &.left {
      justify-content: start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: end;
    }

    & > * {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}

.view {
  height: calc(100vh - 60px);

  & .aside {
    width: 200px;

    & > * {
      height: 100%;
    }
  }

  & .tags > * {
    margin-right: 0.5rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }
}
</style>
