<script setup lang="ts">
import { Request } from "@/apis";
import dictionary from "@/apis/dictionary";
import type { User } from "@/types/User";
import { ref } from "vue";

defineProps<{
  entities: any[];
}>();

const user = ref<User>();
Request.User.getMe().then((resp) => {
  user.value = resp.data[0];
});
</script>

<template>
  <div v-if="entities.length && user">
    <slot></slot>
    <el-table :data="entities" stripe>
      <el-table-column
        v-for="item of Object.keys(entities?.[0])"
        :prop="item"
        :label="dictionary.get(item) || item"
        width="180"
        sortable
      />
      <el-table-column
        v-if="user.userType == 'ADMIN'"
        fixed="right"
        label="操作"
        width="160"
      >
        <el-button type="primary" text>修改</el-button>
        <el-button type="danger" text>删除</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped></style>
