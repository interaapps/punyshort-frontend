<script setup>
import DataTable from "@/components/DataTable.vue";
import {onMounted, ref} from "vue";
import {apiClient} from "@/main";

const props = defineProps(["workspace"])

const availableDomains = ref([])

const load = async () => {
  const globalDomains = (await apiClient.getDomains({'filter_isActive': true})).data
  const domains = (await apiClient.getWorkspaceDomains(props.workspace.id, {'filter_isActive': true})).data

  availableDomains.value = [...globalDomains]
  domains.forEach(d => {
    const dom = availableDomains.value.find(dom => dom.id === d.id)
    if (dom) {
      dom.isUsed = true
    } else {
      availableDomains.value.push(d)
    }
  })
}

const emit = defineEmits(['change'])

const add = async (domain) => {
  await apiClient.addWorkspaceDomains(props.workspace.id, domain.id)
  await load();
  emit('change')
}
const remove = async (domain) => {
  await apiClient.removeWorkspaceDomain(props.workspace.id, domain.id)
  await load();
  emit('change')
}

onMounted(async () => {
  load()
})
</script>
<template>
  <div class="mt-4 mb-5">
    <div v-for="domain of availableDomains" class="p-1 mb-2 flex w-full justify-content-between">
      <span>
        {{ domain.name }}
      </span>

      <div @click="remove(domain)" v-if="domain.isUsed" class="cursor-pointer border-1 border-primary bg-primary border-round-md flex justify-content-between align-items-center" style="width: 20px; height: 20px">
        <i class="ti ti-check block" />
      </div>
      <div @click="add(domain)" v-else class="cursor-pointer border-1 border-primary border-round-md flex justify-content-between align-items-center" style="width: 20px; height: 20px" />
    </div>
  </div>

  <p class="mb-2 p-1 opacity-30">
    Domains can be activated here for this workspace. If the checkbox is ticked, you'll be able to use this domain in this namespace.
    You can add custom domains <router-link class="text-primary no-underline hover:underline" :to="{name: 'home', hash: '#domains'}">here</router-link> and enable them for this project.
  </p>
</template>