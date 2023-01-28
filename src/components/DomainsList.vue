<template>
    <div class="domains-list">
        <input v-model="search" type="text" class="search" placeholder="Search" @input="load(true)">
        <a v-for="domain of domains" :key="domain.id" class="domains-list-item" :to="{name: 'link', params: {id: domain.id}}">
            <div class="domains-list-name">
                <h1>{{ domain.name }}</h1>
            </div>
            <div class="domains-list-status">

            </div>
            <div class="domains-list-actions">
                <button class="btn">Edit</button>
                <button class="btn btn-danger ml-1">Delete</button>
            </div>
        </a>

        <button ref="loadMoreBtn" class="btn load-more" v-if="domains.length < pagination?.pagination?.total" @click="load(page + 1)">Load more</button>

        <p v-if="domains.length === 0" class="no-entries-found">
            no entries found
        </p>
    </div>
</template>

<script>
import {apiClient} from "@/main";

export default {
    data: () => ({
        pagination: {},
        domains: [],
        page: 1,
        loading: false,
        search: ""
    }),
    mounted() {
        this.load(true, 1)

        setTimeout(() => {
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting === true) {
                    if (!this.loading) {
                        this.load(false, this.page + 1)
                    }
                }
            }, {threshold: [0]});

            observer.observe(this.$refs.loadMoreBtn);
        }, 500)
    },
    methods: {
        async load(fresh = false, page = 1) {
            if (fresh)
                this.domains = []

            this.loading = true
            this.pagination = await apiClient.getDomains({
                show_compact_stats: true,
                order_by: 'created_at',
                order_desc: 'true',
                show_public: false,
                search: this.search,
                page
            })
            this.page = page

            this.domains = [...this.domains, ...this.pagination.data]
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.domains-list {
    .domains-list-item {
        display: grid;
        grid-template-columns: auto 40px fit-content(320px);
        align-items: center;
        transition: 0.3s;

        text-decoration: none;
        color: #545454;
        border-radius: 10px;
        padding: 10px;
        margin: -10px;
        margin-bottom: 15px;

        max-width: 100%;
        .domains-list-name {
            white-space: pre;
            max-width: 100%;
            overflow: hidden;
            h1 {
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 50%;
                font-size: 18px;
                font-weight: 500;
            }
        }

        &:hover {
            background: #00000011;
        }


        @media (prefers-color-scheme: dark) {
            .domains-list-name {
                h1 {
                    color: #FFF;
                }
            }

            &:hover {
                background: #FFFFFF11;
            }
        }
    }
}

.load-more {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 20px;
}
</style>