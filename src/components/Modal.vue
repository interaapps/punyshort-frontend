<script setup>
const visible = defineModel('visible')


defineProps(['title', 'width'])
const emit = defineEmits(['submit'])
</script>
<template>
    <Teleport to="#modals">
        <div @click="visible = false" v-if="visible" class="modal-bg" v-animate-css="{classes: 'fadeIn', duration: 250}">
            <form @submit.prevent="emit('submit')">
                <div @click.stop class="modal" :style="{width}">
                    <i @click="visible = false" class="ti ti-x icon-button modal-close-button" />
                    <h1 class="modal-title">{{ title }}</h1>

                    <div class="modal-body">
                        <slot />
                    </div>
                </div>
            </form>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
.modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000011;
    backdrop-filter: blur(3px);
    z-index: 10000000;

    .modal {
        width: 420px;
        max-width: 100%;
        max-height: 90%;
        min-height: 100px;
        position: absolute;
        background: #FFFFFF;
        padding: 23px;
        top: 50%;
        left: 50%;
        border-radius: 10px;
        transform: translateX(-50%) translateY(-50%);
        box-shadow: 0 0 20px 0 #00000017;
        border: 2px solid #00000011;

        .modal-title {
            font-size: 22px;
            line-height: 30px;
            font-weight: 600;
        }

        .modal-close-button {
            font-size: 29px;
            float: right;
        }

        .modal-body {
            margin-top: 20px;
        }
    }


    @media (prefers-color-scheme: dark) {
        background: #00000011;

        .modal {
            background: #0f0f0f;
            border-color: #FFFFFF11;
            box-shadow: 0 0 20px 0 #00000017;
        }
    }
}
</style>