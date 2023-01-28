<template>
    <div id="home">
        <div id="home-top" :class="{'logged-in': $store.state.user}">
            <div />
            <div id="home-top-contents" class="site-width">
                <h2 v-animate-css="{classes: 'fadeIn', delay: 200}" id="home-slug"><b>shorten</b> your urls with <b>ease</b>.</h2>
                <ShortenURL @created="createdShortenLink" v-animate-css="$store.state.user ? false : {classes: 'fadeIn', delay: 400}" id="shorten-url-home" />
            </div>
            <div />
        </div>

        <div class="site-width mt-5" v-if="$store.state.user">
            <Tabs :tabs="{links: 'Shorten Links', domains: 'Domains'}">
                <template v-slot:[`tab-links`]>
                    <LinksList ref="linksList" class="mt-4" />
                </template>
                <template v-slot:[`tab-domains`]>
                    <DomainsList ref="domainsList" class="mt-4" />
                </template>
            </Tabs>
        </div>


        <span class="floating-info-text"><a href="https://interaapps.de">InteraApps</a> - <a href="https://interaapps.de/privacy">privacy</a>&nbsp;&nbsp;<a href="https://interaapps.de/imprint">imprint</a></span>
    </div>
</template>

<script>
import ShortenURL from "@/components/ShortenURL.vue";
import LinksList from "@/components/LinksList.vue";
import Tabs from "@/components/Tabs.vue";
import DomainsList from "@/components/DomainsList.vue";

export default {
    name: 'HomeView',
    components: {
        DomainsList,
        Tabs,
        LinksList,
        ShortenURL
    },
    methods: {
        createdShortenLink() {
            if (this.$refs.linksList) {
                this.$refs.linksList.load(true)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#home {
    height: 100%;

    #home-top {
        background: #F9F9F9;
        height: 100vh;
        display: grid;
        grid-template-rows: auto fit-content(0px) auto;
        transition: 0.3s height;
        #home-slug {
            text-align: center;
            margin-bottom: 60px;
            font-weight: 400;
            b {
                font-weight: 600;
            }
        }
        #home-top-contents {
        }

        &.logged-in {
            height: initial;
            grid-template-rows: 50px fit-content(60px) 50px;
            #home-slug {
                display: none;
            }
            #home-top-contents {
                margin-top: 55px;
            }
        }


        @media (prefers-color-scheme: dark) {
            background: #111111;
        }
    }
}

.floating-info-text {
    position: sticky;
    display: block;
    display: none;
    margin: 20px 0 30px 0;
    text-align: center;
    font-size: 14px;
    font-weight: 100;
    opacity: 0.2;
    a {
        text-decoration: none;
        color: #FFF;
        font-weight: 500;
    }
    @media (prefers-color-scheme: dark) {
        color: #FFFFFF;
    }
}
</style>