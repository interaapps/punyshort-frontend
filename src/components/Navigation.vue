<script setup>
import { login } from "@/main";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/store/userStore";
import {ref} from "vue";
import {useRouter} from "vue-router";

const { user } = storeToRefs(useUserStore())
const router = useRouter()

const userMenuShown = ref(false)


defineProps(['homeRoute'])

const logout = () => {
  useUserStore().setUser(null)
  router.push({ name: 'home' })
  userMenuShown.value = false
  localStorage.removeItem("session")
}

const goPageBack = (e) => {
  if (window.history.length > 0) {
    router.back();
    e.preventDefault();
  }
};
</script>
<template>
    <div class="navigation" v-animate-css="{classes: 'fadeInDown', duration: 300}">
        <div class="navigation-contents site-width">
            <router-link id="logo" class="scale-active" :to="homeRoute ?? {name: 'home'}">
                <i @click="goPageBack" class="ti ti-arrow-narrow-left" :class="{'i-hidden': $route.name === 'home'}" />
                <span>punyshort</span>
            </router-link>
            <div />
            <div class="navigation-links flex align-items-center">
                <!-- <router-link :to="{}" @click.prevent="login" class="scale-active" href="/">
                    <span>admin</span>
                </router-link> -->
              <slot name="buttons" />

                <template v-if="user">
                  <div class="relative">
                    <a class="profile-picture cursor-pointer" @click="userMenuShown = !userMenuShown">
                        <img :src="user.profile_picture">
                    </a>
                    <template v-if="userMenuShown">
                      <div
                        class="absolute right-0 w-14rem mt-2 border-round-xl shadow-1 p-1 overflow-hidden px-0 surface-0 border-1 border-100"
                        v-animate-css="{classes: 'fadeIn', duration: 500}"
                      >
                        <a href="https://accounts.interaapps.de" class="block m-0">
                          <button class="btn btn-transparent w-full flex align-items-center gap-1">
                            <i class="ti ti-user" />
                            <span>My Account</span>
                          </button>
                        </a>

                        <button @click="logout" class="btn btn-transparent w-full flex align-items-center gap-1">
                          <i class="ti ti-logout" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else>
                    <a @click.prevent="login" class="navigation-links-login scale-active" href="/">
                        <i class="ti ti-user" />
                        <span>login</span>
                    </a>
                </template>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.navigation {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background: #F9F9F944;
    height: 60px;
    backdrop-filter: blur(20px);
    z-index: 100000;

    a, a:visited {
        color: #323232;
        text-decoration: none;
        user-select: none;
    }

    #logo {
        font-weight: 600;
        display: block;
        line-height: 60px;
        transition: 0.3s;
        i, & > span {
            display: inline-block;
            vertical-align: middle;
        }
        i {
            transition: 0.3s;
            font-size: 20px;
            margin-right: 10px;
            padding-top: 3px;

            &.i-hidden {
                font-size: 0;
                margin-right: 0;
            }
        }
        & > span {
            font-size: 20px;
            margin: -5px;
            line-height: initial;
            border-radius: 10px;
            padding: 0 5px 5px;
        }
        &:hover {
            & > span {
                background: #00000011;
            }
        }
    }

    .navigation-contents {
        display: grid;
        grid-template-columns: fit-content(200px) auto fit-content(340px);
        align-items: center;

        .navigation-links {
            font-size: 16px;
            font-weight: 500;

            a {
                vertical-align: middle;
                display: inline-block;
                margin-left: 20px;
            }

            .navigation-links-login {

            }

            .profile-picture {
                vertical-align: middle;
                line-height: 100%;
                img {
                    height: 40px;
                    width: 40px;
                    object-fit: cover;
                    border: 2px solid #DDD;
                    border-radius: 20px;
                }
            }
        }
    }


    @media (prefers-color-scheme: dark) {
        background: #111111AA;

        #logo:hover span {
            background: #FFFFFF11;

        }

        a, a:visited {
            color: #FFF;
            text-decoration: none;
        }
    }
}
</style>