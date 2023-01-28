<template>
    <div class="navigation" v-animate-css="{classes: 'fadeInDown', duration: 300}">
        <div class="navigation-contents site-width">
            <router-link id="logo" class="scale-active" :to="{name: 'home'}">
                <i class="ti ti-arrow-narrow-left" :class="{hidden: $route.name === 'home'}" />
                <span>punyshort</span>
            </router-link>
            <div />
            <div class="navigation-links">
                <!-- <router-link :to="{}" @click.prevent="login" class="scale-active" href="/">
                    <span>admin</span>
                </router-link> -->

                <template v-if="$store.state.user">
                    <a class="profile-picture">
                        <img :src="$store.state.user.profile_picture">
                    </a>
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

<script>
import { login } from "@/main";

export default {
    methods: {
        login() {
            login()
        }
    }
}
</script>

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

            &.hidden {
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

        .navigation-links {
            line-height: 60px;
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