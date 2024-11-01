<script setup>
import Modal from "@/components/Modal.vue";
import {apiClient} from "@/main";
import {ref, watch} from "vue";

const visible = defineModel('visible')

const resultModalVisible = ref(false)

const createDomain = ref({
  name: '',
  dns_type: 'CNAME',
  dns_settings: {
    'cf-api-key': '',
    'cf-zone-id': '',
  }
})
const result = ref(null)

const emit = defineEmits(['created', 'dnsCheckDone'])

watch(visible, () => {
  if (visible.value) {
    createDomain.value = {
      name: '',
      dns_type: 'CNAME',
      dns_settings: {
        'cf-api-key': '',
        'cf-zone-id': '',
      }
    }
  }
})
const create = async () => {
  const domain = await apiClient.createDomain(createDomain.value)

  result.value = {domain}

  if (domain.dns_type === 'CNAME') {
    result.value.cname_domain = (await apiClient.get("/v1/app/default-cname")).value
  } else if (domain.dns_type === 'CUSTOM_PROXY') {
    result.value.api_key = (await apiClient.post("/v1/access-tokens", {
      type: 'REDIRECT_PROXY_INSTANCE'
    })).key
  }

  visible.value = true
  resultModalVisible.value = true

  emit("created")

  setTimeout(() => {
    apiClient.post(`/v1/domains/${domain.id}/dns-check`)
        .then(() => {
          emit("dnsCheckDone")
        })
  }, 1000);
}
</script>
<template>
  <Modal v-model:visible="visible" title="Add Domain" @submit="create">
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

  <Modal v-model:visible="resultModalVisible" title="Domain Created!">
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
</template>

<style scoped>

</style>