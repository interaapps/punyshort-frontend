<script setup>
import {apiClient} from "@/main";
import {getFavicon} from "@/helper/helper";
import {copyStringToClipboard} from "@/helper";
import {onMounted, ref, watch} from "vue";
import QRCodeModal from "@/components/QRCodeModal.vue";

const pagination = ref({})
const links = ref([])
const page = ref(1)
const loading = ref(false)
const search = ref("")

const qrCodeModalOpened = ref({})


const props = defineProps(["workspace"])

const load = async (fresh = false, currentPage = 1) => {
  if (fresh)
    links.value = []

  loading.value = true
  pagination.value = await apiClient.getShortenLinks({
    show_compact_stats: true,
    order_by: 'created_at',
    order_desc: 'true',
    search: search.value,
    page: currentPage,
    'filter_workspaceId': props.workspace?.id ?? "null"
  })
  page.value = currentPage

  links.value = [...links.value, ...pagination.value.data]
  loading.value = false
}

watch(() => props.workspace, () => load(true))

const observeEl = el => {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting === true) {
      if (!loading.value) {
        load(false, page.value + 1)
      }
    }
  }, {threshold: [0]});

  if (el) {
    observer.observe(el);
  }
}

defineExpose({load})

onMounted(() => {
  load(true, 1)
})
</script>

<template>
    <div class="links-list">
        <input v-model="search" type="text" class="search" placeholder="Search" @input="load(true)">
        <router-link v-for="link of links" :key="link.id" class="links-list-item" :to="workspace ? {name: 'workspace-link', params: {id: link.id, workspace: workspace.slug}} : {name: 'link', params: {id: link.id}}">
            <div class="links-list-name">
                <div class="flex gap-3 align-items-center w-full">
                  <div style="width: 30px; height: 30px" class="border-round-2xl flex-none border-1 border-200 overflow-hidden p-1">
                    <img class="datatable-icon w-full h-full block" :src="getFavicon(link.long_link)" alt="Favicon of url" />
                  </div>

                  <div class="w-full">
                    <div class="mb-1 flex align-items-center gap-2 w-full">
                      <h1>{{ link.domain.name }}/{{ link.path }}</h1>
                      <i @click.stop.prevent="copyStringToClipboard(link.full_link)" class="ti ti-copy scale-active opacity-0 show-on-hover" />
                      <i @click.stop.prevent="qrCodeModalOpened[link.id] = true" class="ti ti-qrcode scale-active opacity-0 show-on-hover" />

                      <QRCodeModal v-model:visible="qrCodeModalOpened[link.id]" :text="link.full_link" />
                    </div>
                    <div class="flex w-full gap-2 align-items-center">
                      <h2>{{ link.long_link }}</h2>

                      <img class="border-1 border-200 border-round-xl" style="height: 16px; width: 16px;" v-if="link.user" :src="link.user.avatar" :title="`${link.user.name} (${link.user.email})`" alt="">
                    </div>
                  </div>
                </div>
            </div>
            <div class="links-list-country-flag opacity-0 transition-duration-300 show-on-hover">
                <img v-if="!link.compact_stats?.most_visiting_country || link.compact_stats?.most_visiting_country === 'UNKN'" src="https://cdn.interaapps.de/icon/flags/misc/UNKNOWN.svg">
                <img v-else :src="`https://cdn.interaapps.de/icon/flags/states/${link.compact_stats?.most_visiting_country}.svg`">
            </div>
            <div class="links-list-stats">
              <span>{{ link.compact_stats?.total }}</span>
              <i class="ti ti-timeline" />
            </div>
        </router-link>

        <button :ref="el => observeEl(el)" class="btn load-more" v-if="links.length < pagination?.pagination?.total" @click="load(page + 1)">Load more</button>

        <p v-if="links.length === 0" class="no-entries-found">
            no entries found
        </p>
    </div>
</template>

<style lang="scss" scoped>
.links-list {
    .links-list-item {
        display: grid;
        grid-template-columns: auto 36px fit-content(120px);
        align-items: center;
        transition: 0.3s;

        text-decoration: none;
        color: #545454;
        border-radius: 10px;
        padding: 10px;
        margin: -10px;
        margin-bottom: 14px;

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
                font-size: 16px;
                font-weight: 500;
            }
            h2 {
                max-width: 40%;
                font-size: 14px;
                font-weight: 400;
                color: #AAA;
            }
        }
        .links-list-country-flag {
            img {
                display: block;
                width: 26px;
                height: 26px;
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
              font-size: 16px;
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

      &:hover {
        .show-on-hover {
          opacity: 1 !important;
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