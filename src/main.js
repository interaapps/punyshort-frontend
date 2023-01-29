import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/base.scss'
import PortalVue from 'portal-vue'

import VAnimateCss from 'v-animate-css';
import IAOauth from "@/IAOauth";
import PunyshortAPI from "@/PunyshortAPI";

Vue.use(VAnimateCss)
Vue.use(PortalVue)

Vue.config.productionTip = false

export const apiClient = new PunyshortAPI(window.APP_CONFIG.api || 'https://punyshort.apis.intera.dev');

export async function loadUser() {
    const user = await apiClient.getUser()
    if (user.logged_in) {
        store.state.user = user
    }
}

export async function login(){
    const res = await new IAOauth(window.APP_CONFIG.client_id || 'uk73m9t0odzewt2')
        .addScope("user:read")
        .openInNewWindow("/logging_in.html")

    const callback = await apiClient.get("/v1/auth/oauth2/interaapps/callback", {
        code: res.code,
        popup: "true"
    })

    localStorage["session"] = callback.session
    apiClient.bearer(callback.session)
    await loadUser()
}

(async () => {
    if (localStorage["session"]) {
        apiClient.bearer(localStorage["session"])
        await loadUser()
    }

    console.log("Loaded user")

    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
})()