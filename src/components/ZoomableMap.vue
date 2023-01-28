<template>
    <div class="zoomable-map">
        <Map
            class="zoomable-map-map"
            :style="{transform: `scale(${scale})`, left: x, top: y}"
            :country-percentages="countryPercentages" />

    </div>
</template>

<script>
import Map from "@/components/Map.vue";

export default {
    name: "ZoomableMap",
    components: {Map},
    props: {
        countryPercentages: {
            type: Object,
            default: () => ({})
        }
    },
    data: () => ({
        x: '50%',
        y: '50%',
        scale: 1
    }),
    methods: {
        zoom(e) {
            console.log("AA")
            e.preventDefault()
        },
        dragStart() {
            console.log("OOH")
        },
        dragEnd() {
            console.log("AASD")
        }
    }
}
</script>

<style lang="scss">
.zoomable-map {
    overflow: hidden;
    .zoomable-map-map {
        overflow: auto;
        margin: auto;
        display: block;
    }
}
</style>