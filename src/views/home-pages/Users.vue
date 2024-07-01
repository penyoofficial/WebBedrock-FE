<script setup lang="ts">
import { Request } from "@/apis";
import EntityListView from "@/components/EntityListView.vue";
import type { User } from "@/types/User";
import { ref } from "vue";

const users = ref<User[]>([]);
Request.User.getAll().then((resp) => {
  users.value = resp.data;
});
</script>

<template>
  <EntityListView :entities="users" />
</template>

<style scoped></style>
