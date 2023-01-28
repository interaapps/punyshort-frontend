<template>
    <div>

    </div>
</template>

<script>
import {apiClient} from "@/main";
//import {Cajax} from "cajaxjs";

export default {
    name: "FrontendRedirection",
    async mounted() {
        const ip = '185.244.166.122'// (await (await (new Cajax().get('https://4.myip.is/'))).json()).ip

        apiClient.post(`/v1/follow`, {
            path: this.$route.params.id,
            domain: 'pnsh.ga',
            referrer: document.referrer,
            ip: ip,
            user_agent: navigator.userAgent
        })
    }
}
</script>

<style scoped>

</style>