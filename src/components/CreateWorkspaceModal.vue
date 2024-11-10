<script setup>
import Modal from "@/components/Modal.vue";
import {apiClient} from "@/main";
import {ref, watch, watchEffect} from "vue";
import router from "@/router";

const visible = defineModel('visible')

const resultModalVisible = ref(false)

const slugChanged = ref(false)

const createWorkspace = ref({
  name: '',
  slug: ''
})
const result = ref(null)

const emit = defineEmits(['created', 'dnsCheckDone'])

watch(visible, () => {
  if (visible.value) {
    createWorkspace.value = {
      name: '',
      slug: ''
    }
    slugChanged.value = false
  }
})

watch(() => createWorkspace.value.name, () => {
  if (!slugChanged.value) {
    createWorkspace.value.slug = createWorkspace.value.name.replaceAll(' ', '-').toLowerCase().replace(/[^0-9a-z\-_]/gi, '')
  }
})
const create = async () => {
  const workspace = await apiClient.createWorkspaces(createWorkspace.value)

  result.value = {workspace}


  visible.value = true
  resultModalVisible.value = true

  await router.push({
    name: 'workspace-home',
    params: {
      workspace: workspace.slug
    }
  })
}
</script>
<template>
  <Modal v-model:visible="visible" title="Add Workspace" @submit="create">
    <div class="mb-3">
      <label class="mb-1">NAME</label>
      <input autofocus v-model="createWorkspace.name" type="text" class="input">
    </div>
    <div class="mb-4">
      <label class="mb-1">SLUG (Only a-z, 1-9, _, - are allowed)</label>
      <input @input="slugChanged = true" @change="slugChanged = true" v-model="createWorkspace.slug" type="text" class="input">
    </div>


    <button type="submit" class="btn right mt-4">Confirm</button>
  </Modal>
</template>

<style scoped>

</style>