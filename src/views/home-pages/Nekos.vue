<script setup lang="ts">
import { Request } from "@/apis";
import EntityListView from "@/components/EntityListView.vue";
import type { Neko } from "@/types/Neko";
import { ref } from "vue";

const nekos = ref<Neko[]>([]);
Request.Neko.getAll().then((resp) => {
  nekos.value = resp.data;
});
</script>

<template>
  <EntityListView :entities="nekos" />
</template>

<style scoped></style>
