<script setup lang="ts">
import {apiClient} from "@/main";
import Navigation from "@/components/Navigation.vue";
import {onMounted, ref, watch} from "vue";
import {useUserStore} from "@/store/userStore";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";

const workspaceMenuShown = ref(false)

const route = useRoute()
const { user } = storeToRefs(useUserStore())

let workspaceListener = (e) => {
  workspaceMenuShown.value = false
  document.removeEventListener('click', workspaceListener)
  e.preventDefault()
  e.stopPropagation()
}
watch(workspaceMenuShown, () => {
  if (workspaceMenuShown.value) {
    document.addEventListener('click', workspaceListener)
  } else {
    document.removeEventListener('click', workspaceListener)
  }
})

const workspace = ref(null)
const workspaceUser = ref(null)
const workspaces = ref([])

const load = async () => {
  workspaces.value = (await apiClient.getWorkspaces({
    limit: 10000
  })).data

  workspace.value = workspaces.value.find(w => w.slug === route.params.workspace)
  if (!workspace.value)
    workspace.value = workspaces.value.find(w => w.id === route.params.workspace)

  workspaceUser.value = workspace.value?.users?.find(u => u.id === user.value.id)
}

watch(() => route.params.workspace, () => load())

onMounted(async () => {
  load()
})
</script>
<template>
  <navigation :home-route="route.name === 'workspace-home' ? null : { name: 'workspace-home', params: { workspace: workspace?.slug } }">
    <template #buttons>
      <div class="relative">
        <button v-if="workspace" class="btn btn-outlined block flex align-items-center gap-2" style="padding-left: 6px !important;" @click.stop="workspaceMenuShown = !workspaceMenuShown">
          <span class="bg-red-100 flex align-items-center justify-content-center" style="width: 20px; height: 20px; border-radius: 4px">
            <span class="text-sm text-red-900">
              {{workspace.name[0]?.toUpperCase()}}
            </span>
          </span>
          {{ workspace.name }}
        </button>

        <template v-if="workspaceMenuShown">
          <div
              class="absolute right-0 w-14rem mt-2 border-round-xl shadow-1 p-1 overflow-hidden px-0 surface-0 border-1 border-100"
              v-animate-css="{classes: 'fadeIn', duration: 500}"
              @click.stop
          >
            <router-link @click="workspaceMenuShown = false" v-for="workspace of workspaces" :to="{name: 'workspace-home', params: {workspace: workspace.slug}}" class="block no-underline">
              <button class="btn btn-transparent w-full flex align-items-center gap-2">
                <span class="bg-red-100 flex align-items-center justify-content-center" style="width: 20px; height: 20px; border-radius: 3px">
                  <span class="text-sm text-red-900">
                    {{workspace.name[0]?.toUpperCase()}}
                  </span>
                </span>
                <span>{{ workspace.name }}</span>
              </button>
            </router-link>

            <div class="surface-200 w-full mt-1 mb-1" style="height: 1px" v-if="workspaces.filter(w => w !== workspace).length" />

            <!--<button class="btn btn-transparent w-full flex align-items-center gap-1">
              <i class="ti ti-logout" />
              <span>Sign out</span>
            </button> -->
          </div>
        </template>
      </div>
    </template>
  </navigation>
  <div v-if="workspace">
    <router-view :key="`workspace-${workspace.id}`" :workspace="workspace" :workspace-user="workspaceUser" />
  </div>
  <p v-else class="mt-5">Workspace not found</p>
</template>