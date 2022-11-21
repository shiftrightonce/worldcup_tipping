<template>
  <q-page padding>
    <div class="row">
      <div class="col-md-4 col-xs-12 q-pa-sm">
        <q-input label="Title" outlined v-model="message.title" class="q-mb-xs-md"></q-input>
      </div>
      <div class="col-md-4 col-xs-12 q-pa-sm">
        <q-input label="Body" outlined v-model="message.body" class="q-mb-xs-md"></q-input>
      </div>
      <div class="col-md-4 col-xs-12 q-pa-sm">
        <q-input label="Icon" outlined v-model="message.icon" class="q-mb-xs-md"></q-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-xs-12 q-pa-sm">
        <q-checkbox label="Test" v-model="test"></q-checkbox>
      </div>
      <div class="col-md-6 col-xs-12 q-pa-sm">
        <q-checkbox label="Via Websocket" v-model="viaWebsocket"></q-checkbox>
      </div>
      <div class="col-md-6 col-xs-12 q-pa-sm">
        <q-btn label="Push" @click="onSubmit" color="primary"></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { PushMessage, useAdminStore } from 'src/stores/admin-store'
import { useQuasar } from 'quasar'
import { useLayoutStore } from '../../stores/layout-store'

export default defineComponent({
  name: 'PushNotificationPage',
  setup () {
    const test = ref(false)
    const viaWebsocket = ref(false)
    const q = useQuasar()
    const message = reactive<PushMessage>({
      title: '',
      icon: '',
      body: ''
    })

    const layoutStore = useLayoutStore()

    layoutStore.activeLeftDrawer(false)
    layoutStore.setTitle('Admin Send Push Messages')

    const dialogTitle = 'Notification Test Result'

    const doNotificationTest = () => {
      if (Notification.permission === 'granted') {
        const notification = new Notification(message.title, message)
        notification.addEventListener('show', () => {
          q.dialog({
            title: dialogTitle,
            message: 'Notification shown'
          })
        })
        notification.addEventListener('error', () => {
          q.dialog({
            title: dialogTitle,
            message: 'Notification not shown'
          })
        })
      }
    }

    const onSubmit = async () => {
      if (test.value) {
        doNotificationTest()
      } else {
        try {
          void await useAdminStore().sendPushMessage(message, viaWebsocket.value)
        } catch (e) {
          // @todo Make error message more helpful
          q.notify((e as Error).message)
        }
      }
    }

    return {
      message,
      test,
      viaWebsocket,
      onSubmit
    }
  }
})
</script>
