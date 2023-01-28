<template>
    <div>
        logging in...
    </div>
</template>

<script>
export default {
    name: "Authorize",
    mounted() {
        localStorage["session"] = this.$route.query.key
        this.$router.push({name: 'home'})
    }
}
</script>

<style scoped>

</style>