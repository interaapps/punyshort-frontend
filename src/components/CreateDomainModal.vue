<template>
    <div>
        <Modal ref="modal" title="Add Domain" @submit="create">

            <label class="mb-1">DOMAIN NAME</label>
            <input autofocus v-model="createDomain.name" type="text" class="input">

            <label class="mb-1 mt-5">DOMAIN REGISTRATION TYPE</label>
            <select v-model="createDomain.dns_type" class="input">
                <option value="CNAME">CNAME</option>
                <option value="CLOUDFLARE">Cloudflare</option>
                <option value="CUSTOM_PROXY">Custom Proxy</option>
            </select>

            <template v-if="createDomain.dns_type === 'CLOUDFLARE'">
                <label class="mb-1 mt-5">CLOUDFLARE API KEY</label>
                <input v-model="createDomain.dns_settings['cf-api-key']" type="text" class="input">

                <label class="mb-1 mt-5">CLOUDFLARE ZONE ID</label>
                <input v-model="createDomain.dns_settings['cf-zone-id']" type="text" class="input">
            </template>

            <button type="submit" class="btn right mt-4">Confirm</button>
        </Modal>

        <Modal ref="resultModal" title="Domain Created!">
            <div v-if="result">
                <template v-if="result.domain.dns_type === 'CNAME'">
                    <label class="mb-1">CName Value</label>
                    <input :value="result.cname_domain" type="text" class="input" readonly>
                </template>

                <template v-if="result.domain.dns_type === 'CUSTOM_PROXY'">
                    <label class="mb-1">API-KEY</label>
                    <input :value="result.api_key" type="text" class="input" readonly>
                </template>

                <template v-if="result.domain.dns_type === 'CUSTOM_PROXY' || result.domain.dns_type === 'CNAME'">
                    <label class="mb-1 mt-5">TXT-Entry for punyshort-check.{{ result.domain.name }}</label>
                    <input :value="result.domain.dns_settings['txt-entry']" type="text" class="input" readonly>
                </template>
            </div>
        </Modal>
    </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import {apiClient} from "@/main";

export default {
    name: "CreateDomainModal",
    components: {Modal},
    data: () => ({
        createDomain: {},
        result: null
    }),
    methods: {
        open() {
            this.$refs.modal.open()
            this.createDomain = {
                name: '',
                dns_type: 'CNAME',
                dns_settings: {
                    'cf-api-key': '',
                    'cf-zone-id': '',
                }
            }
        },
        async create() {
            const domain = await apiClient.createDomain(this.createDomain)

            let result = {domain}

            console.log(domain)
            if (domain.dns_type === 'CNAME') {
                result.cname_domain = (await apiClient.get("/v1/app/default-cname")).value
                result.cname_domain = (await apiClient.get("/v1/app/default-cname")).value
            } else if (domain.dns_type === 'CUSTOM_PROXY') {
                result.api_key = (await apiClient.post("/v1/access-tokens", {
                    type: 'REDIRECT_PROXY_INSTANCE'
                })).key
            }

            this.result = result

            this.$refs.modal.open()
            this.$refs.resultModal.open()
            this.$emit("created")

            setTimeout(() => {
                apiClient.post(`/v1/domains/${domain.id}/dns-check`)
                    .then(() => {
                        this.$emit("dnsCheckDone")
                    })
            }, 1000);
        }
    }
}
</script>

<style scoped>

</style>