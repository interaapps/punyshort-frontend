<script setup>
import {apiClient} from "@/main";
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  url: String ,
  structure: Array,
  colWidths: Array,
  identifier: String,
  limit: Number,
})


const search = ref('')
const request = ref({})
const data = ref([])
const pagination = ref({})
const page = ref(1)


const totalPages = computed(() => Math.floor((pagination?.value?.total || 0) / (props.limit ?? 10)) + 1)

const emit = defineEmits(['loaded'])
async function load() {
  request.value = await apiClient.get(props.url, {
    search: search.value,
    page: page.value,
    page_limit: props.limit ?? 0
  })

  pagination.value = request.value.pagination

  data.value = request.value.data
  emit("loaded", data.value)
}
function pagLeft() {
  if (page.value > 1) {
    page.value--
    load()
  }
}
function pagRight() {
  if (totalPages.value > page.value) {
    page.value++
    load()
  }
}


watch(() => props.url, () => {
  load()
})

onMounted(() => {
  load()
})
</script>

<template>
    <div class="datatable">
        <table>
            <thead>
                <tr>
                    <th v-for="(name, i) of structure"
                        :key="name"
                        :colspan="colWidths?.length >= i+1 ? colWidths?.[i] : false"
                    >
                        {{name}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry of data" :key="entry[identifier ?? 'id']">
                    <slot name="entry" :entry="entry" />
                </tr>
            </tbody>
        </table>

        <p v-if="data?.length === 0" style="opacity: 0.4; margin: 20px 0; text-align: center">
            no items
        </p>


        <div class="datatable-navigation">
            <i @click="pagLeft()" class="ti ti-arrow-narrow-left icon-button" />
            <span>{{ page }} / {{ totalPages }}</span>
            <i @click="pagRight()" class="ti ti-arrow-narrow-right icon-button" />
        </div>
    </div>
</template>

<style lang="scss">
.datatable {
    table {
        width: 100%;
        border-spacing: 0;

        thead {
            text-align: left;
            th {
                font-weight: 500;
                color: #AAA;

            }
        }


        tr {
            td, th {
                padding: 4px 15px;
                &:first-child {
                    padding-left: 16px;
                }
                &:last-child {
                    padding-right: 16px;
                }
            }
            th {
                padding: 15px 15px 12px;
                cursor: default;
                user-select: none;
            }
        }

        @media (prefers-color-scheme: dark) {
            thead {
                th {
                    color: #AAAAAA;
                    border-bottom: #3a3a3a 2px solid;
                }
            }
        }

    }

    .datatable-navigation {
        padding: 0 7px;
        margin: auto;
        padding-bottom: 5px;
        width: fit-content;

        i {
            margin: 0 5px 5px 5px;
            padding: 1px;
            vertical-align: middle;
        }

        span {
            display: inline-block;
            vertical-align: middle;
            user-select: none;
            font-weight: 500;
            padding-bottom: 5px;
            margin: 0 5px;
        }
    }
}
</style>