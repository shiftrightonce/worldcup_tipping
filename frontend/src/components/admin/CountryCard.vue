<template>
  <q-card class="q-mb-md q-mr-md-md" flat bordered>
    <q-item>
      <q-item-section>
        <q-item-label>{{ modelValue.internalId + ' : ' + modelValue.name + ' - ' + modelValue.short}}</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-img :src="modelValue.imageSource" />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-actions>
      <q-input type="number" dense outlined label="Points" v-model="points" />
      <q-space></q-space>
      <q-btn icon="check" round color="primary" @click="saveData" :loading="isSaving"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { useCountryStore } from 'src/stores/country-store'
import { Country } from 'src/stores/match-store'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'CountryCard',
  props: {
    modelValue: {
      type: Object as PropType<Country>,
      required: true
    }
  },
  emits: ['modelValue'],
  setup (props, ctx) {
    const points = ref(props.modelValue.groupPoints || '')
    const isSaving = ref(false)
    const countryStore = useCountryStore()

    const saveData = () => {
      isSaving.value = true
      countryStore.updateCountry(props.modelValue.id, { groupPoints: points.value })
        .then((response) => {
          ctx.emit('modelValue', response)
          isSaving.value = false
        })
        .catch((e) => {
          console.log('error', e)
          isSaving.value = false
        })
    }

    return {
      points,
      isSaving,
      saveData
    }
  }
})
</script>
