<script setup>
import DataTable from "@/components/DataTable.vue";
import {onMounted, ref} from "vue";
import {apiClient} from "@/main";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/userStore";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import Modal from "@/components/Modal.vue";

const props = defineProps(["workspace"])

const { user } = storeToRefs(useUserStore())

const users = ref([])

const load = async () => {
  users.value = (await apiClient.getWorkspaceUsers(props.workspace.id, {
    page_limit: 10000
  })).data
}

const inviteModalShown = ref(false)
const inviteEmail = ref("")

const userToRemove = ref(null)
const removeUserModal = ref(false)

const updateUser = async user => {
  await apiClient.updateWorkspaceUser(props.workspace.id, user.id, user)
  load()
}

const removeUser = async user => {
  await apiClient.removeWorkspaceUser(props.workspace.id, user.id, user)
  userToRemove.value = null
  removeUserModal.value = false
  load()
}

const inviteUser = async user => {
  await apiClient.inviteUserToWorkspace(props.workspace.id, inviteEmail.value)
  inviteModalShown.value = false
  inviteEmail.value = ""
  load()
}

const emit = defineEmits(['change'])

onMounted(async () => {
  load()
})
</script>
<template>
  <div class="mt-4 mb-5">
    <div v-for="workspaceUser of users" class="p-1 mb-2 flex w-full justify-content-between" :class="user.id === workspaceUser.id && 'opacity-70 pointer-events-none'">
      <span class="flex gap-3 align-items-center">
        <img v-if="workspaceUser.state === 'ACCEPTED'" class="border-1 border-200 border-round-xl" style="height: 24px; width: 24px;" :src="workspaceUser.avatar">
        <span v-if="workspaceUser.state === 'ACCEPTED'">
          {{ workspaceUser.name }}
        </span>
        <span class="opacity-40">
          {{workspaceUser.email}}
        </span>
        <span v-if="user.id === workspaceUser.id" class="opacity-80 text-primary">
          (you)
        </span>
        <span v-if="workspaceUser.state === 'INVITED'" class="opacity-80 text-primary">
          (invited)
        </span>
      </span>

      <div class="flex align-items-center gap-2">
        <select class="border-1 border-200 p-2 py-1 border-round-md text-sm" v-model="workspaceUser.role" @change="updateUser(workspaceUser)">
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
        </select>

        <i @click="userToRemove = workspaceUser; removeUserModal = true" class="ti ti-x icon-button" :class="user.id === workspaceUser.id && 'opacity-0'" />
      </div>
    </div>

    <button class="btn" @click="inviteModalShown = true">Invite user</button>
  </div>

  <ConfirmationModal @confirm="removeUser(userToRemove)" v-model:visible="removeUserModal">Do you really want to delete this user?</ConfirmationModal>

  <Modal title="Invite" v-model:visible="inviteModalShown" @submit="inviteUser">
    <div class="mb-4">
      <label class="mb-1">E-Mail</label>
      <input v-model="inviteEmail" type="text" class="input">
    </div>

    <button type="submit" class="btn right mt-4">Confirm</button>
  </Modal>

</template>