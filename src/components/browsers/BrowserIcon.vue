<template>
    <i class="ti ti-brand-chrome" v-if="browser === 'CHROME'"/>
    <i class="ti ti-brand-firefox" v-else-if="browser === 'FIREFOX'"/>
    <i class="ti ti-brand-safari" v-else-if="browser === 'SAFARI'"/>
    <i class="ti ti-brand-opera" v-else-if="browser === 'OPERA'"/>
    <i class="ti ti-device-mobile" v-else-if="browser === 'MOBILE'"/>
    <KonquerorIcon v-else-if="browser === 'KONQUEROR'"/>
    <MsieIcon v-else-if="browser === 'MSIE'"/>
    <MaxthonIcon v-else-if="browser === 'MAXTHON'"/>
    <NetscapeIcon v-else-if="browser === 'NETSCAPE'"/>
    <i class="ti ti-world" v-else/>
</template>

<script>
import KonquerorIcon from "@/components/browsers/KonquerorIcon.vue";
import MaxthonIcon from "@/components/browsers/MaxthonIcon.vue";
import MsieIcon from "@/components/browsers/MsieIcon.vue";
import NetscapeIcon from "@/components/browsers/NetscapeIcon.vue";

export default {
    components: {
        NetscapeIcon, MsieIcon, MaxthonIcon, KonquerorIcon},
    props: {
        browser: {default: "OTHER"}
    }
}
</script>