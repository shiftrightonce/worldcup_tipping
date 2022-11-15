<template>
  <div class="col-12"
    style="background-image: url('img/bg_3.jpg'); background-size: cover;background-position: center center;overflow: auto;min-height: 100vh;">
    <div class="row items-center" style="height:50%">
      <div class="col-8 col-xs-12 q-mt-xs-xl">
        <div class="row justify-center">
          <div class="col-9 q-mb-xs-lg">
            <div class="row">
              <div class="q-ml-auto col-md-6 col-sm-12 q-pa-md bg-blue-grey-10" style="border-radius: 10px"
                v-if="!token">
                <div class="text-h2 text-bold text-positive">Password Reset</div>
                <q-input type="email" v-model="email" required outlined label="Email" class="q-pa-md" />
                <q-btn label="Request" class="float-right q-mr-md" color="primary" @click="onClick"></q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ForgoLoginPage',
  setup () {
    const email = ref('')
    const userStore = useUserStore()
    const route = useRoute()
    const router = useRouter()
    const token = ref(route.query._t || '')
    const q = useQuasar()

    console.log(token)

    if (token.value) {
      (async () => {
        try {
          const response = await userStore.loginWithToken(token.value as string)
          console.log(response)
          router.push({
            name: 'account'
          })
        } catch (e) {
          q.dialog({
            title: 'Could not athenticate',
            message: (e as Error).message
          })
        }
      })()
    }

    const onClick = () => {
      if (email.value) {
        (async () => {
          const response = await userStore.requestPasswordReset(email.value)
          console.log(response.data)
        })()
      }
      console.log('reset password')
    }

    return {
      token,
      email,
      onClick
    }
  }
})
</script>
