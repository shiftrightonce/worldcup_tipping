<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="!userStore.isLogin">
      <loginForm></loginForm>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useUserStore } from 'src/stores/user-store'
import { defineComponent } from 'vue'
import LoginForm from 'src/components/login_signup/LoginForm.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  components: { LoginForm },
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
