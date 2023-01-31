<template>
    <i class="ti ti-brand-android" v-if="os === 'ANDROID'"/>
    <i class="ti ti-brand-apple" v-else-if="os === 'IOS'"/>
    <LinuxIcon v-else-if="os === 'LINUX'"/>
    <i class="ti ti-brand-finder" v-else-if="os === 'MAC'"/>
    <i class="ti ti-brand-windows" v-else-if="os === 'WINDOWS'"/>
    <i class="ti ti-question-mark" v-else/>
</template>

<script>
import LinuxIcon from "@/components/operating_systems/LinuxIcon.vue";

export default {
    name: "OperatingSystemIcon",
    components: {LinuxIcon},
    props: {
        os: {default: "OTHER"}
    }
}
</script>