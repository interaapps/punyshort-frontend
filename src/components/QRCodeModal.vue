<script setup>
import Modal from "@/components/Modal.vue"
import {onMounted, ref} from "vue";
import QRCode from "qrcode";

const props = defineProps({
  text: String
})

const visible = defineModel('visible')

const qrCodeDataURL = ref(null)

const renderQRCode = () => {
  QRCode.toDataURL(props.text, {
    type: 'image/jpeg',
    width: 1000,
    height: 1000,
    margin: 1,
    color: {
      dark:"#000",
      light:"#FFF"
    }
  }, function (err, url) {
    if (err) throw err

    qrCodeDataURL.value = url
  })
}

onMounted(() => {
  renderQRCode()
})
</script>
<template>
  <Modal v-model:visible="visible" title="QR-Code">
    <div v-if="qrCodeDataURL" class="flex align-items-center justify-content-center w-full border-1 border-bg p-3 border-round-xl relative">
      <div class="absolute right-0 top-0 p-2">
        <a :href="qrCodeDataURL" download="">
          <i class="ti ti-download scale-active icon-button" />
        </a>
      </div>
      <img class="w-10rem h-10rem border-round-md block" :src="qrCodeDataURL" alt="">
    </div>
  </Modal>
</template>