<template>
  <div class="fit row wrap justify-center items-center content-start">
    <div class="col-12 text-center">
      <div class="row">
        <div class="col">
          <q-btn dense flat>
            <q-badge rounded color="green" v-if="isMatchCompleted && aIsWinner" />
          </q-btn>
        </div>
        <div class="col">
          <b>WINNER</b>
        </div>
        <div class="col">
          <q-btn dense flat>
            <q-badge rounded color="green" v-if="isMatchCompleted && bIsWinner" />
          </q-btn>
        </div>
      </div>
    </div>
  </div>
  <div class="fit row wrap justify-center items-center content-start q-mb-md">
  <div class="col text-center">
    <q-checkbox :disable="!isMatchOpen" v-model="aValue"  label="A" />
  </div>
    <div class="col text-center">V.</div>
    <div class="col text-center">
      <q-checkbox :disable="!isMatchOpen" v-model="bValue" label="B" />
    </div>
</div>
</template>
<script lang="ts">
import { Match, Tip, MatchStatus } from 'src/stores/match-store'
import { defineComponent, ref, PropType } from 'vue'
import { UserTipState, useUserTipStore } from 'src/stores/user-tip-store'

export default defineComponent({
  name: 'PenaltyGoalsTip',
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true
    },
    userTipAndState: {
      type: Object as PropType<{ tip: Tip, state: UserTipState}>,
      required: true
    }
  },
  setup (props) {
    const isMatchOpen = props.match.status === MatchStatus.OPEN
    const isMatchCompleted = ref(props.match.status === MatchStatus.COMPLETED)
    const userTipStore = useUserTipStore()
    const aIsWinner = ref(false)
    const bIsWinner = ref(false)

    const aValue = userTipStore.getCountryAComputedToWinTip(props.match.id)
    const bValue = userTipStore.getCountryBComputedToWinTip(props.match.id)

    if (isMatchCompleted.value) {
      aIsWinner.value = (props.match.winner) ? props.match.winner.id === props.match.countryA.id : true
      bIsWinner.value = (props.match.winner) ? props.match.winner.id === props.match.countryB.id : true
    }

    return {
      aValue,
      bValue,
      isMatchOpen,
      isMatchCompleted,
      aIsWinner,
      bIsWinner
    }
  }
})
</script>
