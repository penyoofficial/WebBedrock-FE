<script setup lang="ts">
import { Request } from "@/apis";
import type { User } from "@/types/User";
import { ref } from "vue";

const user = ref<User>();
Request.User.getMe().then((resp) => {
  user.value = resp.data[0];
});
</script>

<template>
  <p>{{ user }}</p>
</template>

<style scoped></style>
