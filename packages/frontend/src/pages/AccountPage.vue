<template>
  <q-page padding>
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div class="row justify-center">
        <div class="col-md-6 col-xs-12">
          <q-form @submit="saveInfoChanges">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6">Login Crendential</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div class="row">
                  <div class="col-xs-12 col-md-4 q-mb-md q-pr-md-md">
                    <q-input outlined label="Username" v-model="username"
                      :rules="[val => val !== null && val.trim() !== '' || 'Username is required', val => val.toString().length <= 50 || 'Must be 50 characters or less']" />
                  </div>
                  <div class="col-xs-12 col-md-4 q-mb-md q-pr-md-md">
                    <q-input outlined label="Password" v-model="password" type="password" />
                  </div>
                  <div class="col-xs-12 col-md-4 q-mb-md">
                    <q-input outlined label="Confirm Password" v-model="confirmPassword" type="password" />
                  </div>
                </div>
              </q-card-section>
              <q-separator inset />
              <q-card-actions align="right">
                <q-btn color="primary" type="submit">Save Changes</q-btn>
              </q-card-actions>
            </q-card>
          </q-form>
          <q-form class="q-mt-md" @submit="saveInfoChanges">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6">Personal Information</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row">
                  <div class="col-xs-12 col-md-5 q-mb-md q-pr-md-md">
                    <q-input outlined label="Email" v-model="email" type="email"
                      :rules="[val => val !== null && val.trim() !== '' || 'Email is required']" />
                  </div>
                </div>
              </q-card-section>

              <q-separator inset />

              <q-card-actions align="right">
                <q-btn color="primary" type="submit">Save Changes</q-btn>
              </q-card-actions>
            </q-card>
          </q-form>
          <div class="q-mt-md">
            <q-card flat bordered class="my-card">
              <q-card-section class="bg-negative">
                <div class="text-h6">Application Information</div>
                <div class="text-subtitle2">For your eyes only 😶</div>
              </q-card-section>
              <q-card-section class="q-pt-sm">
                <div class="row">
                  <div class="col-11 q-mb-md q-pr-md-md">
                    <q-input outlined label="ID" v-model="userId" disable />
                  </div>
                  <div class="col-1 q-mb-md q-pr-md-md" v-if="clipboardApi.isSupported">
                    <q-btn flat dense icon="content_copy" class="q-mt-md" @click="() => copyToClipBoard(userId)">
                    </q-btn>
                  </div>
                  <div class="col-11 q-mb-md q-pr-md-md">
                    <q-input outlined label="API Token" v-model="userToken" disable />
                  </div>
                  <div class="col-1 q-mb-md q-pr-md-md" v-if="clipboardApi.isSupported">
                    <q-btn flat dense icon="content_copy" class="q-mt-md" @click="() => copyToClipBoard(userToken)">
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <q-form class="q-mt-md">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6">Settings</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-btn label="Delete my Account" color="negative" @click="deleteAccount" />
              </q-card-section>
            </q-card>
          </q-form>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { useClipboard } from '@vueuse/core'
import { AxiosError } from 'axios'
import { useQuasar } from 'quasar'
import { useLayoutStore } from 'src/stores/layout-store'
import { useUserStore } from 'src/stores/user-store'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AccountPage',
  setup () {
    const userStore = useUserStore()
    const q = useQuasar()
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const email = ref('')
    const userId = ref('')
    const userToken = ref('')
    const router = useRouter()
    const clipboardApi = useClipboard()
    const layoutStore = useLayoutStore()

    layoutStore.setTitle('My Account');

    (async () => {
      try {
        const user = await userStore.getMyInformation()
        username.value = user.username
        email.value = user.email
        userId.value = user.internalId
        userToken.value = user.token
      } catch (e) {
        const error = e as AxiosError
        if (error.response) {
          const data = error.response.data
          // @todo Make error message more helpful
          switch (data.code) {
            case 'authentication_failed':
              q.dialog({
                title: 'We were unable to fetch your data',
                message: error.response.data.success
              }).onOk(() => {
                router.push({
                  name: 'logout'
                })
              })
          }
        }
      }
    })()

    const saveInfoChanges = () => {
      if ((password.value || confirmPassword.value) && password.value !== confirmPassword.value) {
        q.dialog({
          title: 'Password and confirmation do not match',
          message: 'Your password and the confirmation do not match'
        })
        return
      }

      userStore.updateMyData({
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        email: email.value
      }).then((res) => {
        q.notify('Changes saved')
        console.log('data saved', res)
      }).catch((e) => {
        // @todo Make error message more helpful
        q.dialog({
          title: 'Could not save your changes',
          message: e.message
        })
      })
    }

    const copyToClipBoard = (source: string) => {
      clipboardApi.copy(source)
      q.notify('copied')
    }

    const deleteAccount = () => {
      q.dialog({
        title: 'Delete your account?',
        message: 'You are about to delete your account',
        cancel: true
      }).onOk(() => {
        userStore.deleteMyAccount()
          .then(() => {
            q.dialog({
              title: 'Account deleted',
              message: 'Your account has been deleted'
            }).onDismiss(() => {
              router.push({
                name: 'logout'
              })
            })
          }).catch(() => {
            q.dialog({
              title: 'Account not deleted',
              message: 'Please wait and try again'
            })
          })
      })
    }

    return {
      username,
      password,
      confirmPassword,
      email,
      userId,
      userToken,
      clipboardApi,
      saveInfoChanges,
      copyToClipBoard,
      deleteAccount
    }
  }
})
</script>
