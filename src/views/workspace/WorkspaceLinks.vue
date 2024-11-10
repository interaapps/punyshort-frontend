<script setup>
import LinksList from "@/components/LinksList.vue";
import ShortenURL from "@/components/ShortenURL.vue";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/userStore";
import {useTemplateRef} from "vue";
import Tabs from "@/components/Tabs.vue";
import LinkedDomains from "@/components/workspaces/LinkedDomains.vue";
import WorkspaceUsers from "@/components/workspaces/WorkspaceUsers.vue";
const { user } = storeToRefs(useUserStore())

defineProps(["workspace", "workspaceUser"])

const linksList = useTemplateRef('linksList')

const createdShortenLink = () => {
  linksList.value?.load(true)
}

const shortenLinkRef = useTemplateRef('shortenLinkRef')
</script>
<template>
  <div id="home">
    <div id="home-top" :class="{'logged-in': user}">
      <div />
      <div id="home-top-contents" class="site-width">
        <h2 v-animate-css="{classes: 'fadeIn', delay: 200}" id="home-slug"><b>shorten</b> your urls with <b>ease</b>.</h2>
        <ShortenURL ref="shortenLinkRef" :workspace="workspace" @created="createdShortenLink" v-animate-css="user ? false : {classes: 'fadeIn', delay: 400}" id="shorten-url-home" />
      </div>
      <div />
    </div>

    <div class="site-width mt-5 relative">

      <Tabs :tabs="{
        links: 'Shorten Links', ...(workspaceUser?.role === 'ADMIN' ? {
          domains: 'Linked Domains',
          users: 'Users'
        } : {})
      }">
        <template v-slot:[`tab-links`]>
          <LinksList :workspace="workspace" ref="linksList" class="mt-4" />
        </template>
        <template v-slot:[`tab-domains`]>
          <LinkedDomains @change="shortenLinkRef.loadDomains()" :workspace="workspace" />
        </template>
        <template v-slot:[`tab-users`]>
          <WorkspaceUsers @change="shortenLinkRef.loadDomains()" :workspace="workspace" />
        </template>
      </Tabs>
    </div>
  </div>
</template>