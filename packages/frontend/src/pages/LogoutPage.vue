<template>
  <q-page>
    <div class="row"></div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LogoutPage',
  setup () {
    const router = useRouter()
    const userStore = useUserStore()
    const q = useQuasar()

    q.loading.show()
    userStore.logout()
      .then(() => {
        router.push({ name: 'home' })
        q.loading.hide()
      }).catch((e) => {
        q.loading.hide()

        // @todo Make error message more helpful
        q.dialog({
          title: 'We were unable to log yout out',
          message: e.message
        })
      })

    return {
    }
  }
})
</script>
