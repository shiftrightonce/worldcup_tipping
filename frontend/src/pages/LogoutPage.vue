<template>
  <q-page>
    <div class="row">
      <div class="col-md-4 col-xs-12">
        <h4>You have logout and will be redirected shortly</h4>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'

export default defineComponent({
  name: 'LogoutPage',
  setup () {
    const router = useRouter()
    const userStore = useUserStore()

    userStore.logout()
      .then(() => {
        router.push({ name: 'home' })
      }).catch((_e) => {
        // @todo handle error
      })

    return {
    }
  }
})
</script>
