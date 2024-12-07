<script setup>
import ZoomableMap from "@/components/ZoomableMap.vue";
import {apiClient} from "@/main";
import DataTable from "@/components/DataTable.vue";
import BrowserIcon from "@/components/browsers/BrowserIcon.vue";
import OperatingSystemIcon from "@/components/operating_systems/OperatingSystemIcon.vue";
import iso166names from "@/assets/data/iso3166names";
import {copyStringToClipboard} from "@/helper";
import OperatingSystemsChart from "@/components/charts/OperatingSystemsChart.vue";
import BrowserChart from "@/components/charts/BrowserChart.vue";
import EngagementChart from "@/components/charts/EngagementChart.vue";
import Tabs from "@/components/Tabs.vue";
import Modal from "@/components/Modal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {onMounted, ref, useTemplateRef} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getFavicon} from "@/helper/helper";
import QRCodeModal from "@/components/QRCodeModal.vue";

const router = useRouter()

const route = useRoute()

const link = ref(null)
const countryPercentages = ref({})
const loaded = ref(false)

const totalClicks = ref(0)
const clicksToday = ref(0)
const clicksThisWeek = ref(0)

const domains = ref([])

const editLink = ref({
  long_link: '',
  domain: '',
  path: ''
})


const deleteConfirmationOpened = ref(false)
const editLinkModalOpened = ref(false)
const qrCodeOpened = ref(false)

const loadLink = async () => {
  link.value = await apiClient.getShortenLink(route.params.id)
}

const loadCountryPercentages = async () => {
  const {data} = await apiClient.get(`/v1/shorten-links/${link.value.id}/stats/countries`, {
    page_limit: 0
  })

  const total = data.reduce((b, t) => b+t.count, 0)
  const percentages = {}
  for (const country of data) {
    percentages[country.country_code] = country.count/total
  }

  countryPercentages.value = percentages
}

const getISOName = (iso) => {
  return iso166names[iso.replace('GB', 'UK')] || iso
}

const deleteLink = async () => {
  await apiClient.delete(`/v1/shorten-links/${route.params.id}`)
  await router.push({name: 'home'})
}

const openEdit = () => {
  editLink.value = {
    long_link: link.value.long_link,
    domain: link.value.domain.id,
    path: link.value.path
  }

  editLinkModalOpened.value = true
}

const edit = async () => {
  await apiClient.update(link.value.id, editLink.value)
  await loadLink()
  editLinkModalOpened.value = false
}

const loadStats = async () => {
  totalClicks.value = await apiClient.get(`/v1/shorten-links/${route.params.id}/stats/total`)

  const {data: clicksPerDate} = await apiClient.get(`/v1/shorten-links/${route.params.id}/stats/dates`, {
    page_limit: 7,
    order_by: 'date',
    order_desc: true
  })

  const today = new Date()
  const lastFewDates = [...Array(7)].map((_, index) => {
    const date = new Date(0)
    date.setTime(today.getTime() - (index * 24 * 60 * 60 * 1000))
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} 00:00:00`
  }).map(date => ({date, count: 0, ...clicksPerDate.find(e => e.date === date)}))

  clicksToday.value = lastFewDates[0]?.count || 0
  clicksThisWeek.value = lastFewDates.reduce((a, b) => a+b.count, 0)

  loadCountryPercentages()
}

const load = async () => {
  loaded.value = false

  await loadLink()
  await loadStats()

  loaded.value = true

  domains.value = (await apiClient.get('/v1/domains', {order_by: 'created_at', order_desc: false})).data
}

onMounted(() => {
  load()
})
</script>

<template>
    <div id="link" v-if="link">
        <div id="link-top">
            <div class="site-width" id="link-top-inner">
                <div id="link-top-name">
                    <div id="link-top-shorten-preview">
                        <h1>{{ link.domain.name }}/{{ link.path }}</h1>
                        <i @click="copyStringToClipboard(link.full_link)" class="ti ti-copy scale-active" />
                        <i @click="qrCodeOpened = true" class="ti ti-qrcode scale-active" />

                      <QRCodeModal v-model:visible="qrCodeOpened" :text="link.full_link" />
                    </div>
                    <div id="link-top-name-preview">
                        <a :href="link.long_link" target="_blank" class="scale-active">{{ link.long_link }}</a>
                        <!-- <i @click="openEdit()" class="ti ti-pencil scale-active" /> -->
                    </div>
                </div>
                <div />
                <div id="link-top-actions">
                    <i @click="openEdit()" class="ti ti-pencil icon-button mr-1" />

                    <ConfirmationModal v-model:visible="deleteConfirmationOpened" title="Delete Link?" @confirm="deleteLink()">
                        Do you really want to delete the link '{{ link.domain.name }}/{{ link.path }}'
                    </ConfirmationModal>
                    <i @click="deleteConfirmationOpened = true" class="ti ti-trash icon-button" />
                </div>
            </div>
        </div>

        <div v-if="loaded" class="site-width mt-5"  v-animate-css="{classes: 'fadeIn', duration: 500}">
            <h1 class="mb-5">Stats</h1>

            <div class="big-stats-cards grid">
                <div class="big-stats-card col-12 md:col-4">
                    <h1>{{ totalClicks }}</h1>
                    <h2>total</h2>
                </div>
                <div class="big-stats-card col-12 md:col-4">
                    <h1>{{ clicksThisWeek }}</h1>
                    <h2>this week</h2>
                </div>
                <div class="big-stats-card col-12 md:col-4">
                    <h1>{{ clicksToday }}</h1>
                    <h2>today</h2>
                </div>
            </div>

            <h2>Country</h2>

            <div class="grid">
                <ZoomableMap class="col-12 md:col-8 p-3" :country-percentages="countryPercentages" />

                <div class="col-12 md:col-4 countries-list">
                    <DataTable
                        class="datatable-darken-bg"
                        :url="`/v1/shorten-links/${link.id}/stats/countries`"
                        :structure="['Country', 'Clicks']"
                        :col-widths="[2]"
                        :limit="8"
                    >
                        <template v-slot:entry="{entry}">
                            <td style="width: 10px; padding-right: 6px">
                                <img v-if="entry.country_code === 'UNKN'" class="datatable-icon" :src="`https://cdn.interaapps.de/icon/flags/misc/UNKNOWN.svg`">
                                <img v-else class="datatable-icon" :src="`https://cdn.interaapps.de/icon/flags/states/${entry.country_code}.svg`">
                            </td>
                            <td style="padding-left: 7px">{{ getISOName(entry.country_code) }}</td>
                            <td width="100px">{{ entry.count }}</td>
                        </template>
                    </DataTable>
                </div>
            </div>

        </div>
        <div class="pt-6 mt-8 engagement-area">
            <div class="site-width">
                <h2>Engagement</h2>
                <EngagementChart :link-id="link.id" />
            </div>
        </div>
        <div class="site-width mt-6">

            <Tabs :tabs="{os: 'Operating Systems', browsers: 'Browsers', referrers: 'Referrers'}" style="min-height: 80vh">
                <template v-slot:tab-os>
                    <div class="pt-8 pb-5 grid">
                        <div class="col-12 md:col-7">
                            <OperatingSystemsChart :link-id="link.id" />

                        </div>
                        <div class="col-12 md:col-5">
                            <DataTable
                                class="datatable-darken-bg"
                                :url="`/v1/shorten-links/${link.id}/stats/operating-systems`"
                                :structure="['Operating System', 'Clicks']"
                                :col-widths="[2]"
                            >
                                <template v-slot:entry="{entry}">
                                    <td style="width: 10px; padding-right: 6px">
                                        <OperatingSystemIcon class="datatable-icon" :os="entry.operating_system" />
                                    </td>
                                    <td style="padding-left: 7px">{{ ({
                                        ANDROID: 'Android',
                                        MAC: 'Mac',
                                        LINUX: 'Linux',
                                        IOS: 'iOS',
                                        WINDOWS: 'Windows',
                                        OTHER: 'Other'})[entry.operating_system] }}</td>
                                    <td width="160px">{{ entry.count }}</td>
                                </template>
                            </DataTable>
                        </div>
                    </div>
                </template>

                <template v-slot:tab-browsers>
                    <div class="pt-8 pb-5 grid">
                        <div class="col-12 md:col-7">
                            <BrowserChart :link-id="link.id" />
                        </div>
                        <div class="col-12 md:col-5">
                            <DataTable
                                class="datatable-darken-bg"
                                :url="`/v1/shorten-links/${link.id}/stats/browsers`"
                                :structure="['Browser', 'Clicks']"
                                :col-widths="[2]"
                            >
                                <template v-slot:entry="{entry}">
                                    <td style="width: 10px; padding-right: 6px">
                                        <BrowserIcon class="datatable-icon" :browser="entry.browser" />
                                    </td>
                                    <td style="padding-left: 7px">{{ ({
                                        SAFARI: 'Safari',
                                        CHROME: 'Chrome',
                                        FIREFOX: 'Firefox',
                                        KONQUEROR: 'Konqueror',
                                        NETSCAPE: 'Netscape',
                                        MSIE: 'Internet Explorer',
                                        OPERA: 'Opera',
                                        MOBILE: 'Mobile',
                                        OTHER: 'Other'
                                    })[entry.browser] }}</td>
                                    <td width="160px">{{ entry.count }}</td>
                                </template>
                            </DataTable>
                        </div>
                    </div>
                </template>

                <template v-slot:tab-referrers>
                    <DataTable
                        :url="`/v1/shorten-links/${link.id}/stats/referrers`"
                        :structure="['Referrer', 'Clicks']"
                        :col-widths="[2]"
                        :limit="10"
                    >
                        <template v-slot:entry="{entry}">
                            <td style="width: 10px; padding-right: 6px">
                                <img style="padding: 3px" class="datatable-icon" :src="getFavicon(entry.referrer)" />
                            </td>
                            <td style="padding-left: 7px">
                                <span v-if="entry.referrer">{{ entry.referrer }}</span>
                                <i v-else style="opacity: 0.6">no referrer</i>
                            </td>
                            <td width="160px">{{ entry.count }}</td>
                        </template>
                    </DataTable>
                </template>
            </Tabs>
        </div>

        <Modal v-model:visible="editLinkModalOpened" title="Edit" width="520px" @submit="edit()">
            <label class="mb-1">SHORTEN LINK</label>
            <div>
                <select v-model="editLink.domain" style="width: 30%" class="inline-block input" type="text">
                    <option v-for="domain of domains" :key="domain.id" :value="domain.id">{{ domain.name }}</option>
                </select>

                <div style="line-height: 37px; text-align: center; font-size: 18px; display: inline-block; width: 5%">/</div>
                <input v-model="editLink.path" style="width: 65%" class="inline-block input" type="text">
            </div>

            <label class="mt-5">LONG LINK</label>
            <input v-model="editLink.long_link" autofocus type="text" class="input mt-1">

            <button type="submit" class="btn mt-4 right">Save</button>
        </Modal>
    </div>
</template>

<style lang="scss" scoped>
#link {
    height: 100%;

    #link-top {
        background: #F9F9F9;
        height: 180px;
        padding-top: 75px;
        transition: 0.3s height;

        #link-top-inner {
            display: grid;
            grid-template-columns: 70% auto 100px;
            align-items: center;
        }

        #link-top-name {
            #link-top-shorten-preview {
                h1, i {
                    display: inline-block;
                    vertical-align: middle;
                }
                h1 {
                    color: #323232;
                    font-size: 30px;
                    margin-bottom: 2px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 70%;
                    user-select: text;
                }

                i {
                    cursor: pointer;
                    font-size: 20px;
                    margin-left: 10px;
                }

                @media (prefers-color-scheme: dark) {
                    h1 {
                        color: #FFF;
                    }
                }
            }

            #link-top-name-preview {
                white-space: pre;
                a, i {
                    color: #656565;
                    display: inline-block;
                    vertical-align: middle;
                    text-decoration: none;
                    border-radius: 6px;
                    padding: 3px;

                    &:hover {
                        background: #00000011;
                    }

                    @media (prefers-color-scheme: dark) {
                        color: #FFFFFF99;
                        &:hover {
                            background: #FFFFFF11;
                        }
                    }
                }

                a {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: calc(100% - 25px);
                    margin-left: -1px;
                }

                i {
                    font-size: 21px;
                    padding: 3px;
                    cursor: pointer;

                    &:hover {
                        background: #00000011;
                    }
                }
            }
        }

        #link-top-actions {
            text-align: right;
        }

        @media (prefers-color-scheme: dark) {
            background: #111111;
        }
    }
}

.datatable-darken-bg {
    background: #F9F9F9;
    border-radius: 10px;

    @media (prefers-color-scheme: dark) {
        background: #FFFFFF11;
    }
}

.countries-list {
    height: 100%;
    .datatable-icon {
        border-radius: 20px;
        width: 26px;
        height: 26px;
        border: #00000033 solid 2px;


        @media (prefers-color-scheme: dark) {
            border-color: #545454;
        }
    }
}

.big-stats-cards {
    margin-top: 20px;
    margin-bottom: 70px;
    background: #F9F9F9;
    border: 2px solid #00000011;
    padding: 30px 0;
    border-radius: 10px;
    .big-stats-card {
        text-align: center;
        h1 {
            font-size: 45px;
            color: #323232;
        }
        h2 {
            font-size: 20px;
            opacity: 0.4;
        }
    }

    @media (prefers-color-scheme: dark) {
        background: #FFFFFF11;
        border: 2px solid #FFFFFF0D;

        .big-stats-card {
            h1 {
                color: #FFFFFF;
            }
        }
    }
}

.engagement-area {
    background: #F9F9F9;
    @media (prefers-color-scheme: dark) {
        background: #111111;
    }
}

.datatable-icon {
    width: 30px;
    height: 30px;
    font-size: 30px;
    text-align: center;
}
</style>