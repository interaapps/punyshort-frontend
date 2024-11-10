<script setup>

import CreateWorkspaceModal from "@/components/CreateWorkspaceModal.vue";
import {onMounted, ref} from "vue";
import {apiClient} from "@/main";

const createWorkspaceModalVisible = ref(false)


const workspaces = ref([])

onMounted(async () => {
  workspaces.value = (await apiClient.getWorkspaces()).data
})
</script>
<template>
  <div class="mt-3">
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px">
      <router-link v-for="workspace of workspaces" :to="{name: 'workspace-home', params: {workspace: workspace.slug}}" class="block no-underline">
        <div class="border-1 border-300 p-2 hover:surface-100 transition-duration-300 border-round-md text-900 text-center">
          {{ workspace.name }}
        </div>
      </router-link>

      <div @click="createWorkspaceModalVisible = true" class="cursor-pointer border-1 border-300 p-2 border-dashed hover:surface-100 transition-duration-300 border-round-md text-900 text-center">
        add workspace
      </div>
    </div>
    <CreateWorkspaceModal v-model:visible="createWorkspaceModalVisible" />
  </div>
</template>