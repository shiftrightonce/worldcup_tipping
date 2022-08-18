<template>
  <q-page class="row items-evenly items-center flex-center">
    <q-form
       @submit="onSubmit"
       autofocus
    >
      <div class="row">
        <div class="col-12 q-pl-lg q-pr-lg q-mb-md">
          <div class="text-h4">Sign up</div>
        </div>
        <div class="col-12 q-pl-lg q-pr-lg q-mb-md">
          <q-input
            label="Username *"
            outlined
            v-model="model.username"
            :rules="[val => val !== null && val.trim() !== '' || 'Username is required']"
            style="max-width:420px"
          ></q-input>
        </div>
        <div class="col-12 q-pl-lg q-pr-lg q-mb-md">
          <q-input
            label="Password *"
            outlined
            v-model="model.password"
            :rules="[val => val !== null && val.trim() !== '' || 'Password is required']"
            type="password"
            style="max-width:420px"
          ></q-input>
        </div>
        <div class="col-12 q-pl-lg q-pr-lg q-mb-md">
          <q-input
            label="Confirm Password *"
            outlined
            v-model="model.confirmPassword"
            :rules="[val => val && val === model.password || 'Confirmation does not match']"
            type="password"
            style="max-width:420px"
        ></q-input>
        </div>
        <div class="col-12 q-pl-lg q-pr-lg q-mb-md">
          <q-input
           label="Email *"
            outlined
            v-model="model.email"
            :rules="[val => val !== null && val.trim() !== '' || 'Email is required']"
            type="email"
            style="max-width:420px"></q-input>
        </div>
        <div class="col-12 q-pl-lg q-pr-lg q-mb-md">
          <q-input
           :label="number + ' + ' + add + ' ='"
            outlined
            v-model="answer"
            :rules="[val => Number(val) === (number + add) || 'Answer is incorrect']"
            style="max-width:420px"
            type="number"
            hint="Answer this math question"></q-input>
        </div>
        <div class="col-12 q-pl-lg q-pr-lg q-mb-md">
          <q-btn label="Sign up" color="primary" type="submit"></q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { useLayoutStore } from 'src/stores/layout-store'
import { defineComponent, ref, reactive } from 'vue'
import { useSignupStore } from 'src/stores/signup-store'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SignupPage',
  setup () {
    const answer = ref('')
    const layoutStore = useLayoutStore()
    const number = ref(0)
    const add = ref(0)
    const signupStore = useSignupStore()
    const router = useRouter()

    const generateQuestion = () => {
      number.value = Math.floor(Math.random() * 30000)
      add.value = Math.floor(Math.random() * 11)
    }

    const onSubmit = () => {
      signupStore.signup()
        .then((result) => {
          if (result) {
            router.push({
              name: 'scoreboard'
            })
          }
        }).catch((e) => {
          // @todo handle here?
        })
    }

    layoutStore.setTitle('Sign up')
    generateQuestion()

    return {
      model: signupStore.model,
      number,
      add,
      answer,
      onSubmit
    }
  }
})
</script>
