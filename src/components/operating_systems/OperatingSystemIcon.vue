<template>
    <AndroidIcon v-if="os === 'ANDROID'"/>
    <IosIcon v-else-if="os === 'IOS'"/>
    <LinuxIcon v-else-if="os === 'LINUX'"/>
    <MacIcon v-else-if="os === 'MAC'"/>
    <WindowsIcon v-else-if="os === 'WINDOWS'"/>
    <OtherIcon v-else/>
</template>

<script>
import AndroidIcon from "@/components/operating_systems/AndroidIcon.vue";
import IosIcon from "@/components/operating_systems/IosIcon.vue";
import LinuxIcon from "@/components/operating_systems/LinuxIcon.vue";
import MacIcon from "@/components/operating_systems/MacIcon.vue";
import WindowsIcon from "@/components/operating_systems/WindowsIcon.vue";
import OtherIcon from "@/components/operating_systems/OtherIcon.vue";

export default {
    name: "OperatingSystemIcon",
    components: {OtherIcon, WindowsIcon, MacIcon, LinuxIcon, IosIcon, AndroidIcon},
    props: {
        os: {default: "OTHER"}
    }
}
</script>