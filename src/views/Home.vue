<script setup>
import ShortenURL from "@/components/ShortenURL.vue";
import LinksList from "@/components/LinksList.vue";
import Tabs from "@/components/Tabs.vue";
import DomainsList from "@/components/DomainsList.vue";
import CreateDomainModal from "@/components/CreateDomainModal.vue";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/userStore";
import {ref, useTemplateRef} from "vue";
import WorkspaceList from "@/components/WorkspaceList.vue";

const { user } = storeToRefs(useUserStore())

const linksList = useTemplateRef('linksList')
const domainsList = useTemplateRef('domainsList')
const addDomainModalOpened = ref(false)

const createdShortenLink = () => {
  if (linksList.value) {
    linksList.value.load(true)
  }
}
</script>
<template>
    <div id="home">
        <div id="home-top" :class="{'logged-in': user}">
            <div />
            <div id="home-top-contents" class="site-width">
                <h2 v-animate-css="{classes: 'fadeIn', delay: 200}" id="home-slug"><b>shorten</b> your urls with <b>ease</b>.</h2>
                <ShortenURL @created="createdShortenLink" v-animate-css="user ? false : {classes: 'fadeIn', delay: 400}" id="shorten-url-home" />
            </div>
            <div />
        </div>

        <div class="site-width mt-5" v-if="user">
            <Tabs :tabs="{links: 'Shorten Links', domains: 'Domains', workspaces: 'Workspaces'}">
                <template v-slot:[`tab-links`]>
                    <LinksList ref="linksList" class="mt-4" />
                </template>
                <template v-slot:[`tab-domains`]>
                    <DomainsList ref="domainsList" class="mt-4" />
                    <button class="btn" @click="addDomainModalOpened = true">Add Domain</button>
                </template>
                <template v-slot:[`tab-workspaces`]>
                  <WorkspaceList />
                </template>
            </Tabs>
        </div>


        <span class="floating-info-text"><a href="https://interaapps.de">InteraApps</a> - <a href="https://interaapps.de/privacy">privacy</a>&nbsp;&nbsp;<a href="https://interaapps.de/imprint">imprint</a></span>

        <CreateDomainModal
            v-model:visible="addDomainModalOpened"
            @created="domainsList.load(true)"
            @dnsCheckDone="domainsList.load(true)"
        />
    </div>
</template>
<style lang="scss" scoped>
.floating-info-text {
    position: sticky;
    display: block;
    display: none;
    margin: 20px 0 30px 0;
    text-align: center;
    font-size: 14px;
    font-weight: 100;
    opacity: 0.2;
    a {
        text-decoration: none;
        color: #FFF;
        font-weight: 500;
    }
    @media (prefers-color-scheme: dark) {
        color: #FFFFFF;
    }
}
</style>