<script setup>
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const props = defineProps({
  tabs: Object
})

const selected = ref(route.hash?.replace('#', '') || Object.keys(props.tabs)[0])

watch(selected, () => {
  router.push({ hash: `#${selected.value}` })
})
</script>
<template>
    <div class="tabs">
        <div>
            <button v-for="(name, tab) of tabs" :key="tab" class="btn mr-2 mb-1" :class="{'btn-gray': selected !== tab}" @click="selected = tab">{{ name }}</button>
        </div>
        <div>
            <template v-for="(name, tab) of tabs">
                <div v-if="selected === tab" :key="tab" v-animate-css="{classes: 'fadeIn', duration: 300}">
                    <slot :name="`tab-${tab}`" />
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tabs {
    position: relative;
}
</style>