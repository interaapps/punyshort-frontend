<template>
    <div class="shorten-url">
        <form @submit.prevent="shorten">
            <div class="shorten-url-inner">
                <input autofocus spellcheck="false" v-model="longLink" class="shorten-url-input" placeholder="Long URL here" type="text">

                <div />
                <div :style="{opacity: showSettings ? 0 : 1}" class="shorten-url-splitter" />
                <div />

                <select :style="{opacity: showSettings ? 0 : 1}" v-model="domain" class="shorten-url-domain-select">
                    <option v-for="domain of domains" :key="domain.id" :value="domain.name">{{ domain.name }}</option>
                </select>

                <button type="button" class="shorten-url-settings-button scale-active" @click="showSettings = !showSettings" :class="{'settings-shown': showSettings}">
                    <i class="ti ti-adjustments-horizontal" />
                </button>

                <button type="submit" class="shorten-url-send-button scale-active">
                    <i class="ti ti-brand-telegram" />
                </button>
            </div>

            <div class="shorten-url-settings" :class="{shown: showSettings}">
                <h1>REDIRECTION URL</h1>
                <div class="shorten-url-custom-link">
                    <select v-model="domain" class="shorten-url-domain-select">
                        <option v-for="domain of domains" :key="domain.id" :value="domain.name">{{ domain.name }}</option>
                    </select>

                    <div class="shorten-url-slash-splitter">/</div>

                    <input v-model="path" spellcheck="false" class="shorten-url-input" placeholder="Custom path (optional)" type="text">
                </div>
            </div>
        </form>

        <div class="shorten-url-result" v-if="result" v-animate-css="{classes: 'fadeIn', duration: 500}">
            <div v-if="result.error" class="shorten-url-result-inner">
                <a class="link-preview" style="color: #980b2a">Error: {{ result.exception.replace('Exception', '') }}</a>
            </div>
            <div v-else class="shorten-url-result-inner">
                <a class="link-preview">{{ result.full_link }}</a>
                <button class="btn" :class="{'btn-success': copiedResult}" @click="copyPreview()">Copy</button>
                <router-link v-if="$store.state.user" :to="{name: 'link', params: {id: result.id}}" class="btn">Stats</router-link>
            </div>
            <i @click="result = null" class="ti ti-x icon-button shorten-url-close" />
        </div>
    </div>
</template>

<script>
import {apiClient} from "@/main";
import {copyStringToClipboard} from "@/helper";

export default {
    name: "ShortenURL",
    data: () => ({
        result: null,
        showSettings: false,

        longLink: '',
        domain: '',
        path: '',
        copiedResult: false,

        domains: []
    }),
    async mounted() {
        this.domains = await apiClient.get('/v1/domains', {order_by: 'created_at', order_desc: false}).then(r => r.json()).then(r => r.data)
        this.domain = this.domains[0]?.name
    },
    methods: {
        async shorten() {
            let path = this.path.trim() || null

            if (path === '/') {
                path = ""
            }

            const result = await apiClient.shorten({
                long_link: this.longLink,
                path: path,
                domain: this.domain
            })
            this.result = result
            this.copiedResult = false
            this.$emit('created', result)

            if (!result.error) {
                this.path = ""
                this.longLink = ""
                this.showSettings = false
            }
        },
        copyPreview() {
            copyStringToClipboard(this.result.full_link)
            this.copiedResult = true
        }
    }
}
</script>

<style lang="scss" scoped>
.shorten-url {
    background: #FFF;
    border-radius: 30px;
    box-shadow: 0 0 29px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    position: relative;

    .shorten-url-splitter {
        width: 100%;
        height: 35px;
        margin-top: 10px;
        border-radius: 10px;
        background: #00000011;
        @media (prefers-color-scheme: dark) {
            background: #FFFFFF22;
        }
    }

    .shorten-url-inner {
        display: grid;
        grid-template-columns:
            [input] auto
            [splitter-g] 20px
            [splitter] 2px
            [splitter-g2] 20px
            [domain-select] 20%
            [settings-button] 45px
            [send-button] 55px;

        button {
            background: transparent;
            border: none;
            outline: none;

            height: 45px;
            width: 45px;
            border-radius: 100px;
            margin: 5px 0 0 5px;
            cursor: pointer;

            i {
                font-size: 24px;
            }

            &:hover {
                background: #00000011;
            }
        }

        input, select {
            height: 55px;
        }

        .shorten-url-input {
            margin-right: 10px;
            padding-left: 20px;
        }

        .shorten-url-domain-select {
        }

        .shorten-url-settings-button {
            color: #545454;

            &.settings-shown {
                background: #00000011;
            }
        }

        .shorten-url-send-button {
            color: #FF5880;
            cursor: pointer;

            i {
                font-size: 26px;
            }
        }


        @media (prefers-color-scheme: dark) {
            input, select, .shorten-url-settings-button {
                color: #FFF;
            }

            input::placeholder {
                color: #AAA;
            }

            button &:hover, .shorten-url-settings-button.settings-shown {
                background: #FFFFFF11;
            }
        }
    }

    .shorten-url-settings {
        height: 0;
        overflow: hidden;
        transition: 0.3s;
        padding: 0 18px;
        border-top: #00000011 solid 0;

        h1 {
            font-size: 13px;
            margin-bottom: 3px;
            opacity: 0.3;
        }

        input, select {
            height: 35px;
            border-radius: 5px;
            &:hover, &:focus {
                background: #0000000A;
            }

            @media (prefers-color-scheme: dark) {
                color: #FFF;
            }
        }

        .shorten-url-custom-link {
            display: grid;
            grid-template-columns:
                [domain-select] 20%
                [splitter] 40px
                [input] auto;


            .shorten-url-slash-splitter {
                text-align: center;
                line-height: 35px;
            }
        }

        &.shown {
            border-top-width: 2px;
            padding: 10px 15px 12px 15px;
            height: initial;
        }
        @media (prefers-color-scheme: dark) {
            border-top-color: #FFFFFF11;
        }
    }

    .shorten-url-result {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #FFFFFF22;
        top: 0;
        backdrop-filter: blur(10px);
        border-radius: 30px;

        .shorten-url-result-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            width: max-content;
            .link-preview, .btn {
                display: inline-block;
                vertical-align: middle;
            }
            .link-preview {
                font-size: 24px;
                margin-right: 6px;
                max-width: 520px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .btn {
                margin-left: 10px;
            }
        }

        .shorten-url-close {
            position: absolute;
            top: 15.1px;
            left: 16px;
        }

        @media (prefers-color-scheme: dark) {
            background: #00000022;
        }
    }

    @media (prefers-color-scheme: dark) {
        background: #000000;
    }
}
</style>