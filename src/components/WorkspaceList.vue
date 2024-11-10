<script setup>

import CreateWorkspaceModal from "@/components/CreateWorkspaceModal.vue";
import {onMounted, ref} from "vue";
import {apiClient} from "@/main";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/userStore";

const { user } = storeToRefs(useUserStore())

const createWorkspaceModalVisible = ref(false)


const workspaces = ref([])
const invitations = ref([])

const load = async () => {
  workspaces.value = (await apiClient.getWorkspaces()).data
  invitations.value = (await apiClient.getWorkspaces({invitations: true})).data
}

const acceptInvitation = async workspace => {
  await apiClient.acceptWorkspaceInvitation(workspace.id, user.value.id)
  load()
}
const declineInvitation = async workspace => {
  await apiClient.removeWorkspaceUser(workspace.id, user.value.id)
  load()
}

onMounted(async () => {
  load()
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

    <div v-if="invitations.length" class="mt-5">
      <h3 class="mb-3">Invitations</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px">
        <div v-for="workspace of invitations" :to="{name: 'workspace-home', params: {workspace: workspace.slug}}" class="block no-underline">
          <div class="border-1 border-300 p-2 px-3 transition-duration-300 border-round-md text-900 flex justify-content-between">
            <span>
              {{ workspace.name }}
            </span>
            <div class="flex gap-2 align-items-center">
              <i @click="acceptInvitation(workspace)" class="ti ti-check icon-button icon-button-small" />
              <i @click="declineInvitation(workspace)" class="ti ti-x icon-button icon-button-small" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateWorkspaceModal v-model:visible="createWorkspaceModalVisible" />
  </div>
</template>