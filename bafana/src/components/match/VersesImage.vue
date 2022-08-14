<template>
  <div class="fit row justify-center items-center content-start">
    <div class="col text-center">
      <q-btn flat dense round>
          A
          <q-badge floating rounded color="green" v-if="aWins" />
      </q-btn><br/>
      <q-img :src="'/images/' + match.countryA.image" width="60%" /><br/>
      <strong>{{ match.countryA.name}}</strong>
    </div>
    <div class="col-1 text-center">
      <span>V.</span>
      </div>
    <div class="col text-center">
      <q-btn flat dense round>
        B
        <q-badge floating rounded color="green" v-if="bWins" />
      </q-btn>
      <br/>
      <q-img :src="'/images/'+ match.countryB.image" width="60%" /><br/>
      <strong>{{ match.countryB.name }}</strong>
    </div>
  </div>
</template>

<script lang="ts">
import { Match, MatchStatus } from 'src/stores/match-store'
import { defineComponent, PropType, ref } from 'vue'
export default defineComponent({
  name: 'VersesImage',
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true
    }
  },
  setup (props) {
    const isMatchCompleted = ref(props.match.status === MatchStatus.COMPLETED)
    const aWins = ref(false)
    const bWins = ref(false)

    if (isMatchCompleted.value) {
      if (props.match.winner === null) {
        aWins.value = true
        bWins.value = true
      } else if (props.match.winner?.id === props.match.countryA.id) {
        aWins.value = true
      } else if (props.match.winner?.id === props.match.countryB.id) {
        bWins.value = true
      }
    }

    return {
      aWins,
      bWins
    }
  }
})
</script>
