<script setup>
import {onMounted, ref, useTemplateRef} from "vue";
import {apiClient} from "@/main";
import ConfirmationModal from '@/components/ConfirmationModal.vue'
const pagination = ref({})
const domains = ref(null)
const page = ref(1)
const loading = ref(false)
const search = ref("")

const deleteModalOpened = ref({})


const loadMoreBtn = useTemplateRef('loadMoreBtn')

const load = async (fresh = false, newPage = 1) => {
  if (fresh)
    domains.value = []

  loading.value = true
  pagination.value = await apiClient.getDomains({
    show_compact_stats: true,
    order_by: 'created_at',
    order_desc: 'true',
    show_public: false,
    search: search.value,
    show_internals: true,
    page: newPage
  })
  page.value = newPage

  console.log(domains.value, pagination.value.data)
  domains.value = [...domains.value, ...pagination.value.data]
  loading.value = false
}
const makeDomainCheck = async (id) => {
  await apiClient.post(`/v1/domains/${id}/dns-check`)
  await load(true)
}
const deleteDomain = async (id) => {
  await apiClient.deleteDomain(id)
  await load(true)
}

defineExpose({ load })


const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting === true) {
    if (!loading.value) {
      load(false, page.value + 1)
    }
  }
}, {threshold: [0]});

onMounted(async () => {
  load(true, 1)
})
</script>
<template>
    <div class="domains-list" v-if="domains">
        <input v-model="search" type="text" class="search" placeholder="Search" @input="load(true)">
        <a v-for="(domain, i) of domains" :key="domain.id" class="domains-list-item" :to="{name: 'link', params: {id: domain.id}}">
            <div class="domains-list-status">
                <div v-if="domain.is_active" class="status-active"><div /></div>
                <div v-else class="status-not-active"><div /></div>
            </div>
            <div class="domains-list-name">
                <h1>{{ domain.name }}</h1>
            </div>
            <div class="domains-list-actions">
                <button v-if="!domain.is_active" @click="makeDomainCheck(domain.id)" class="btn  mr-1">Update Status</button>
                <ConfirmationModal v-model:visible="deleteModalOpened[domain.id]" title="Delete domain?" @confirm="deleteDomain(domain.id)">
                    Do you really want to delete the domain '{{ domain.name }}'?
                </ConfirmationModal>
                <button v-if="!domain.locked" @click="deleteModalOpened[domain.id] = true" class="btn btn-danger ml-1">Delete</button>
            </div>
        </a>

        <button :ref="el => el ? observer.observe(el) : 0" class="btn load-more" v-if="domains.length < pagination?.pagination?.total" @click="load(page + 1)">Load more</button>

        <p v-if="domains.length === 0" class="no-entries-found">
            no entries found
        </p>
    </div>

</template>

<style lang="scss" scoped>
.domains-list {
    .domains-list-item {
        display: grid;
        grid-template-columns: 30px auto fit-content(420px);
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

        .domains-list-status {
            .status-active, .status-not-active {
                display: inline-block;
                background: #888;
                padding: 4px;
                border-radius: 10px;
                vertical-align: middle;
                div {
                    display: block;
                    width:  10px;
                    height: 10px;
                    border-radius: 10px;
                    background: #AAA;
                }
            }
            .status-active {
                background: #32a88f66;
                div {
                    background: #32a88f;
                }
            }
            .status-not-active {
                background: #A8323266;
                div {
                    background: #A83232;
                }
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