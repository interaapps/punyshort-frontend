<template>
    <div class="site-width site-top-margin">
        <br><br><br>
        <h1 style="font-size: 11vh; font-weight: 1000">{{ $route.query.error.replace("Exception", "") }}</h1>
        <h2 style="font-size: 4vh">We are very sorry.</h2>
    </div>
</template>

<script>
export default {
    name: "NotFound"
}
</script>

<style scoped>

</style>