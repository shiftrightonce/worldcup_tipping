<template>
  <div class="fit row wrap justify-center items-center content-start" v-if="isNotGroupRound">
    <div class="col-12 text-center">
      <div class="row">
        <div class="col">
          <q-btn dense flat>
            <q-badge rounded color="green" transparent v-if="isMatchCompleted">
                {{ match.countryAPenaltyGoals }}
              </q-badge>
          </q-btn>
        </div>
        <div class="col">
          <b>PENALTY KICK-OFF GOALS</b>
        </div>
        <div class="col">
          <q-btn dense flat>
            <q-badge rounded color="green" transparent v-if="isMatchCompleted">
              {{ match.countryBPenaltyGoals }}
            </q-badge>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
  <div class="fit row wrap justify-center items-center content-start q-mb-md" v-if="isNotGroupRound">
  <div class="col text-center">
    <q-input type="number" debounce="500" dense outlined v-model="aScore" label="A" :disable="!isMatchOpen" />
  </div>
    <div class="col text-center">V.</div>
    <div class="col text-center">
      <q-input type="number" debounce="500" dense  outlined v-model="bScore" label="B" :disable="!isMatchOpen" />
    </div>
</div>
<span v-if="!isNotGroupRound"><!-- show nothing --></span>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { Match, Tip, MatchRound, MatchStatus } from 'src/stores/match-store'
import { UserTipState } from 'src/stores/user-store'
import { useUserTipStore } from 'src/stores/user-tip-store'

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
    const isNotGroupRound = props.match.round !== MatchRound.GROUP
    const isMatchCompleted = ref(props.match.status === MatchStatus.COMPLETED)
    const userTipStore = useUserTipStore()

    const aScore = userTipStore.getCountryAComputedPenaltyGoalTip(props.match.id)
    const bScore = userTipStore.getCountryBComputedPenaltyGoalTip(props.match.id)

    return {
      isMatchOpen,
      isNotGroupRound,
      aScore,
      bScore,
      isMatchCompleted
    }
  }
})
</script>
