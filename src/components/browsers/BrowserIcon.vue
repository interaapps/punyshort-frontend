<template>
    <ChromeIcon v-if="browser === 'CHROME'"/>
    <KonquerorIcon v-else-if="browser === 'KONQUEROR'"/>
    <SafariIcon v-else-if="browser === 'SAFARI'"/>
    <MaxthonIcon v-else-if="browser === 'MAXTHON'"/>
    <MobileIcon v-else-if="browser === 'MOBILE'"/>
    <MsieIcon v-else-if="browser === 'MSIE'"/>
    <NetscapeIcon v-else-if="browser === 'NETSCAPE'"/>
    <OtherIcon v-else/>
</template>

<script>
import OtherIcon from "./OtherIcon.vue";
import ChromeIcon from "@/components/browsers/ChromeIcon.vue";
import KonquerorIcon from "@/components/browsers/KonquerorIcon.vue";
import SafariIcon from "@/components/browsers/SafariIcon.vue";
import MaxthonIcon from "@/components/browsers/MaxthonIcon.vue";
import MobileIcon from "@/components/browsers/MobileIcon.vue";
import MsieIcon from "@/components/browsers/MsieIcon.vue";
import NetscapeIcon from "@/components/browsers/NetscapeIcon.vue";

export default {
    components: {NetscapeIcon, MsieIcon, MobileIcon, MaxthonIcon, SafariIcon, KonquerorIcon, ChromeIcon, OtherIcon},
    props: {
        browser: {default: "OTHER"}
    }
}
</script>