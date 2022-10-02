<template>
  <div class="fit row wrap justify-center items-center content-start">
    <div class="col-12 text-center">
      <div class="row">
        <div class="col">
          <q-btn dense flat>
            <q-badge floating rounded color="green" transparent v-if="isMatchCompleted">
              {{ match.countryAGoals }}
            </q-badge>
          </q-btn>
        </div>
        <div class="col">
          <b>GOALS</b>
        </div>
        <div class="col">
          <q-btn dense flat>
            <q-badge floating rounded color="green" transparent v-if="isMatchCompleted" >
              {{ match.countryBGoals }}
            </q-badge>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
  <div class="fit row wrap justify-center items-center content-start q-mb-md">
  <div class="col text-center">
    <q-input type="number" :disable="!isMatchOpen" dense outlined v-model="aValue" debounce="500" label="A" />
  </div>
    <div class="col text-center">V.</div>
    <div class="col text-center">
      <q-input type="number" :disable="!isMatchOpen" dense  outlined v-model="bValue" debounce="500" label="B" />
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
<<<<<<< HEAD
import { Match, MatchStatus } from 'src/stores/match-store'
=======
import { Match, Tip, MatchStatus } from 'src/stores/match-store'
>>>>>>> refs/remotes/origin/main
import { useUserTipStore } from 'src/stores/user-tip-store'

export default defineComponent({
  name: 'GoalsTip',
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true
    }
  },
  setup (props) {
    const isMatchOpen = props.match.status === MatchStatus.OPEN
    const isMatchCompleted = ref(props.match.status === MatchStatus.COMPLETED)
    const userTipStore = useUserTipStore()

    const aValue = userTipStore.getCountryAComputedGoalTip(props.match.id)
    const bValue = userTipStore.getCountryBComputedGoalTip(props.match.id)

    return {
      isMatchOpen,
      isMatchCompleted,
      aValue,
      bValue
    }
  }
})
</script>
