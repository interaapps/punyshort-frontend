<template>
    <div class="datatable">
        <table>
            <thead>
                <tr>
                    <th v-for="(name, i) of structure"
                        :key="name"
                        :colspan="colWidths.length >= i+1 ? colWidths[i] : false"
                    >
                        {{name}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry of data" :key="entry[identifier]">
                    <slot name="entry" :entry="entry" />
                </tr>
            </tbody>
        </table>

        <p v-if="data.length === 0" style="opacity: 0.4; margin: 20px 0; text-align: center">
            no items
        </p>


        <div class="datatable-navigation">
            <i @click="pagLeft()" class="ti ti-arrow-narrow-left icon-button" />
            <span>{{ page }} / {{ totalPages }}</span>
            <i @click="pagRight()" class="ti ti-arrow-narrow-right icon-button" />
        </div>
    </div>
</template>

<script>
import {apiClient} from "@/main";

export default {
    name: "DataTable",
    props: {
        url: { type: String },
        structure: { type: Array },
        colWidths: { type: Array, default: () => [] },
        identifier: { type: String, default: "id" },
        limit: { type: Number, default: 10 },
    },
    data: () => ({
        search: '',
        request: {},
        data: [],
        pagination: {},
        page: 1
    }),
    computed: {
        totalPages() {
            return Math.floor(this.pagination.total || 0 / 10) + 1
        }
    },
    mounted() {
        this.load()
    },
    watch: {
        url() {
            this.load()
        }
    },
    methods: {
        async load() {
            this.request = await (await apiClient.get(this.url, {
                search: this.search,
                page: this.page,
                page_limit: this.limit
            })).json()
            this.pagination = this.request.pagination

            this.data = this.request.data
            this.$emit("loaded", this.data)
        },
        pagLeft() {
            if (this.page > 1) {
                this.page--
                this.load()
            }
        },
        pagRight() {
            if (this.totalPages > this.page) {
                this.page++
                this.load()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
        margin-bottom: 3px;
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