<template>
    <div class="tabs">
        <div>
            <button v-for="(name, tab) of tabs" :key="tab" class="btn mr-1" :class="{'btn-gray': selected !== tab}" @click="selected = tab">{{ name }}</button>
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

<script>
export default {
    name: "Tabs",
    props: {
        tabs: {type: Object}
    },
    data() {
        return {
            selected: Object.keys(this.tabs)[0]
        }
    }
}
</script>

<style lang="scss" scoped>
.tabs {
    position: relative;
}
</style>