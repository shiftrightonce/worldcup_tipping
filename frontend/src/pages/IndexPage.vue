<template>
  <div v-if="!userStore.isLogin" class="col-12 index-menu"
    style="background-image: url('img/bg_1.jpg'); background-size: cover;background-position: center center;height: 100vh; min-height: 500px;">
    <div class="row justify-evenly">
      <!-- <div class="col-xs-12 col-md-8 items-center">
              <q-toolbar class="text-white q-mt-md">
                <AppLogo size="70px"></AppLogo>
                <q-toolbar-title class="text-positive text-bold">
                  MansTip
                </q-toolbar-title>
                <div class="gt-sm">
                  <q-btn flat v-for="item in menuStore.public" :to="item.to" :icon="item.icon" :key="item.label">
                    &nbsp;{{ item.label }}</q-btn>
                </div>
                <q-btn flat round dense icon="menu" class="lt-md"
                  @click="() => layoutStore.rightDrawer = !layoutStore.rightDrawer" />
              </q-toolbar>
            </div> -->
      <div class="col-12 q-mt-md">
        <div class="row">
          <div class="q-ml-auto col-md-6 col-sm-12 q-pa-md">
            <div class="text-h2 text-bold text-positive">MansTip</div>
            <div class="text-h4 text-bold">Friendly world cup tipping</div>
            <p class="q-mt-lg">
              Simply register and start tipping in order to be in the run
              for awesome prizes 😍🎊🎉
            </p>
          </div>
        </div>
      </div>

      <div class="col-9 q-mt-md">
        <div class="row">
          <div class="q-ml-auto col-md-6 col-sm-12 q-pa-md bg-blue-grey-10"
            style="border-radius: 10px">
            <SignupForm></SignupForm>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from 'src/stores/user-store'
import { defineComponent } from 'vue'
// import LoginForm from 'src/components/login_signup/LoginForm.vue'
import { useRouter } from 'vue-router'
import SignupForm from 'src/components/login_signup/SignupForm.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { SignupForm },
  setup () {
    const userStore = useUserStore()
    const router = useRouter()
    if (userStore.isLogin) {
      router.push({ name: 'scoreboard' })
    }
    return {
      userStore
    }
  }
})
</script>

<style scoped>
.index-menu:before {
  content: "";
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  /* top: 0; */
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
