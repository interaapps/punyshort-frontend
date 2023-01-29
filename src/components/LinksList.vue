<template>
    <div class="links-list">
        <input v-model="search" type="text" class="search" placeholder="Search" @input="load(true)">
        <router-link v-for="link of links" :key="link.id" class="links-list-item" :to="{name: 'link', params: {id: link.id}}">
            <div class="links-list-name">
                <h1>{{ link.domain.name }}/{{ link.path }}</h1>
                <h2>{{ link.long_link }}</h2>
            </div>
            <div class="links-list-country-flag">
                <img v-if="!link.compact_stats?.most_visiting_country || link.compact_stats?.most_visiting_country === 'UNKN'" src="https://cdn.interaapps.de/icon/flags/misc/UNKNOWN.svg">
                <img v-else :src="`https://cdn.interaapps.de/icon/flags/states/${link.compact_stats?.most_visiting_country}.svg`">
            </div>
            <div class="links-list-stats">
                <span>{{ link.compact_stats?.total }}</span>
                <i class="ti ti-timeline" />
            </div>
        </router-link>

        <button ref="loadMoreBtn" class="btn load-more" v-if="links.length < pagination?.pagination?.total" @click="load(page + 1)">Load more</button>

        <p v-if="links.length === 0" class="no-entries-found">
            no entries found
        </p>
    </div>
</template>

<script>
import {apiClient} from "@/main";

export default {
    name: "LinksList",
    data: () => ({
        pagination: {},
        links: [],
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
                this.links = []

            this.loading = true
            this.pagination = await apiClient.getShortenLinks({
                show_compact_stats: true,
                order_by: 'created_at',
                order_desc: 'true',
                search: this.search,
                page
            })
            this.page = page

            this.links = [...this.links, ...this.pagination.data]
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.links-list {
    .links-list-item {
        display: grid;
        grid-template-columns: auto 40px fit-content(120px);
        align-items: center;
        transition: 0.3s;

        text-decoration: none;
        color: #545454;
        border-radius: 10px;
        padding: 10px;
        margin: -10px;
        margin-bottom: 15px;

        width: 100%;
        width: calc(100% + 20px);

        .links-list-name {
            white-space: pre;
            max-width: 100%;
            overflow: hidden;
            h1, h2 {
                overflow: hidden;
                text-overflow: ellipsis;
            }
            h1 {
                max-width: 50%;
                font-size: 18px;
                font-weight: 500;
            }
            h2 {
                max-width: 40%;
                font-size: 16px;
                font-weight: 400;
                color: #AAA;
            }
        }
        .links-list-country-flag {
            img {
                display: block;
                width: 28px;
                height: 28px;
                border-radius: 100px;
                border: 2px solid #DDD;
            }
        }
        .links-list-stats {
            text-align: right;
            color: #878787;
            min-width: 40px;
            i {
                font-size: 23px;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
                font-weight: 500;
            }
        }


        &:hover {
            transform: scale(1.01);
            background: #00000011;
        }

        &:active {
            transform: none;
        }


        @media (prefers-color-scheme: dark) {
            .links-list-name {
                h1 {
                    color: #FFF;
                }
            }

            .links-list-stats {
                color: #989898;
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