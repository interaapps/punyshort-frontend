<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
    TooltipComponent,
    LegendComponent, GridComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { BarChart } from 'echarts/charts';
import {apiClient} from "@/main";
import {onMounted, ref, watch} from "vue";

use([
    CanvasRenderer,
    GridComponent,
    BarChart,
    TooltipComponent,
    LegendComponent
]);

const props = defineProps(['linkId'])

const option = ref({
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
})

const load = async () => {
  const { data: res } = (await apiClient.get(`/v1/shorten-links/${props.linkId}/stats/dates`, {
    order_by: 'date',
    order_desc: true,
    page_limit: 14
  }))

  const today = new Date()
  const lastFewDates = [...Array(14)].map((_, index) => {
    const date = new Date(0)
    date.setTime(today.getTime() - (index * 24 * 60 * 60 * 1000))
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} 00:00:00`
  }).map(date => ({date, count: 0, ...res.find(e => e.date === date)})).toReversed()
  console.log({res, lastFewDates})

  option.value.xAxis.data = []
  option.value.series[0].data = []

  if (lastFewDates.length < 7) {
    for (let i = 0; i < 7 - lastFewDates.length; i++) {
      option.value.xAxis.data.push('')
      option.value.series[0].data.push(0)
    }
  }

  option.value.xAxis.data = [...option.value.xAxis.data, ...lastFewDates.map(r => r.date.split(" ")[0])]
  option.value.series[0].data = [...option.value.series[0].data, ...lastFewDates.map(r => r.count)]
}

watch(() => props.linkId, () => {
  load()
})
onMounted(() => {
  load()
})
</script>
<template>
  <v-chart class="eng-chart" :option="option" />
</template>
<style scoped>
.eng-chart {
    height: 300px;
}
</style>