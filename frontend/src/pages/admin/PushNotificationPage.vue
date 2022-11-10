<template>
  <q-page padding>
    <q-input label="Title" v-model="message.title"></q-input>
    <q-input label="Icon" v-model="message.icon"></q-input>
    <q-input label="Body" v-model="message.body"></q-input>
    <q-checkbox label="Test" v-model="test"></q-checkbox>
    <q-separator />
    <q-btn label="Push" @click="onSubmit" color="primary"></q-btn>
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
          void await useAdminStore().sendPushMessage(message)
        } catch (e) {
          // @todo Make error message more helpful
          q.notify((e as Error).message)
        }
      }
    }

    return {
      message,
      test,
      onSubmit
    }
  }
})
</script>
