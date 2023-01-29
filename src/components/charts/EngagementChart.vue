<template>
    <v-chart class="eng-chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
    TooltipComponent,
    LegendComponent, GridComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { BarChart } from 'echarts/charts';
import {apiClient} from "@/main";

use([
    CanvasRenderer,
    GridComponent,
    BarChart,
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
            const {data: res} = (await apiClient.get(`/v1/shorten-links/${this.linkId}/stats/dates`, {
                order_by: 'date',
                order_desc: false,
                limit: 7
            }))

            this.option.xAxis.data = []
            this.option.series[0].data = []

            if (res.length < 7) {
                for (let i = 0; i < 7 - res.length; i++) {
                    this.option.xAxis.data.push('')
                    this.option.series[0].data.push(0)
                }
            }

            this.option.xAxis.data = [...this.option.xAxis.data, ...res.map(r => r.date.split(" ")[0])]
            this.option.series[0].data = [...this.option.series[0].data, ...res.map(r => r.count)]
        }
    },
    data() {
        return {
            option: {
                tooltip: {
                    trigger: "axis",
                    show: true,
                    formatter: (params) => {
                        return `Clicks: ${params[0].value}`;
                    },
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    splitLine: {
                        show: false
                    },
                },
                color: '#FF5880',
                yAxis: {
                    type: 'value',
                    show: false,
                    splitLine: {
                        show: false
                    },
                },
                series: [
                    {
                        data: [],
                        type: 'bar',

                        itemStyle: {
                            normal: {
                                barBorderRadius: [10, 10, 0 , 0]
                            }
                        }
                    }
                ]
            }
        }
    }
};
</script>

<style scoped>
.eng-chart {
    height: 300px;
}
</style>