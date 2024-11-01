<script setup>
import Modal from '@/components/Modal.vue'
const visible = defineModel('visible')
defineProps(['title'])

const emit = defineEmits(['confirm'])
</script>
<template>
    <Modal v-model:visible="visible" :title="title" @submit="emit('confirm')">
        <p>
            <slot />
        </p>
        <input style="opacity: 0; height: 1px" autofocus />
        <button type="submit" class="btn right mt-4">Confirm</button>
    </Modal>
</template>

<style scoped>

</style>