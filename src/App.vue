<template>
    <div id="app">
        <navigation />
        <router-view />
        <portal-target name="modals" />
    </div>
</template>
<script setup>
import Navigation from "@/components/Navigation.vue";
</script>