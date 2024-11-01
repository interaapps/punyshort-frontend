import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {useUserStore} from './store/userStore'
import './assets/css/base.scss'

import VAnimateCss from 'v-animate-css';
import IAOauth from "@/IAOauth";
import PunyshortAPI from "@/PunyshortAPI";
import {createPinia} from "pinia";


const pinia = createPinia()
const app = createApp(App)

app.use(VAnimateCss)
app.use(pinia)
app.use(router)


export const apiClient = new PunyshortAPI(window.APP_CONFIG.api || 'https://punyshort.apis.intera.dev');

export async function loadUser() {
    const user = await apiClient.getUser()
    if (user.logged_in) {
        useUserStore().setUser(user)
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

    app.mount('#app')
})()