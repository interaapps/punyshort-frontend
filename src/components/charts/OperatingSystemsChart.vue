<template>
    <v-chart class="os-chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { RadarChart } from 'echarts/charts';
import {apiClient} from "@/main";

use([
    CanvasRenderer,
    PieChart,
    RadarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
]);

export default {
    components: {
        VChart
    },
    props: {
        linkId: {type: String},
    },
    mounted() {
        this.load()
    },
    watch: {
        linkId() {
            this.load()
        }
    },
    methods: {
        async load() {
            const res = (await apiClient.get(`/v1/shorten-links/${this.linkId}/stats/operating-systems`).then(r=>r.json())).data

            this.option.radar.indicator = res.map(r => ({name: r.operating_system}))
            this.option.series = [
                {
                    name: 'Operating Systems',
                    type: 'radar',
                    data: [{name: 'Operating Systems', value: res.map(r => r.count)}]
                }
            ]
        }
    },
    data() {
        return {
            option: {
                color: '#FF5880',

                tooltip: {
                    show: true
                },
                radar: {
                    indicator: []
                },
                series: [
                ]
            }
        }
    }
};
</script>

<style scoped>
.os-chart {
    height: 300px;
}
</style>