<template>
  <q-card class="q-mb-md q-mr-md-md" flat bordered>
    <q-item>
      <q-item-section avatar>
        S
      </q-item-section>
      <q-item-section>
        <q-item-label>Game #{{ match.number }} <span style="font-size: 9px;"> - {{
            match.fullDate?.toLocaleString()
        }}</span> </q-item-label>
        <q-item-label caption v-if="match.countryA && match.countryB">
          {{ match.countryA.name }} vs {{ match.countryB.name }}
        </q-item-label>
        <q-item-label v-else>
           {{ match.match }}
        </q-item-label>
      </q-item-section>
      <q-space />
      <q-btn flat round :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" @click="expanded = !expanded">
      </q-btn>
    </q-item>
    <div class="q-ma-md">
      <VersesImage :match="match" v-if="match.countryA && match.countryB"></VersesImage>
    </div>
    <q-separator />
    <q-card-actions>
       {{ match.round.split('_').join(' ') }} / {{ match.status.split('_').join(' ') }}
      <q-space />
      <q-btn flat round :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" @click="expanded = !expanded">
      </q-btn>
    </q-card-actions>
    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <div class="row q-ma-md">
          <div class="col-4 text-center">
            <q-input type="number" v-model="countryA.goals" label="Goals" dense outlined />
          </div>
          <div class="col-4 text-center">V.</div>
          <div class="col-4 text-center">
            <q-input type="number" label="Goals" v-model="countryB.goals" dense outlined />
          </div>
        </div>
        <div class="row q-ma-md" v-if="!isGroupRound">
          <div class="col-4 text-center">
            <q-input type="number" label="Penalty Goals" v-model="countryA.penaltyGoals" dense outlined />
          </div>
          <div class="col-4 text-center">V.</div>
          <div class="col-4 text-center">
            <q-input type="number" label="Penalty Goals" v-model="countryB.penaltyGoals" dense outlined />
          </div>
        </div>
        <div class="row q-ma-md" v-if="isGroupRound">
          Note: You need to set the countires's final points before round 16 will be processed.
        </div>
        <div class="row q-ma-md">
          <div class="col-12 text-center">
            <q-select dense outlined emit-value map-options v-model="status" :options="matchStore.matchStatuses" label="Match Status" />
          </div>
        </div>
      <q-separator></q-separator>
        <q-card-actions>
          <q-space></q-space>
          <q-btn icon="check" round color="primary" @click="saveData" :loading="isSaving"></q-btn>
        </q-card-actions>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, reactive } from 'vue'
import { Match, useMatchStore, MatchRound } from 'src/stores/match-store'
import VersesImage from '../match/VersesImage.vue'

export default defineComponent({
  name: 'AdminMatch',
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true
    }
  },
  setup (props) {
    const expanded = ref(false)
    const isDataChanged = ref(false)
    const isSaving = ref(false)
    const status = ref(props.match.status)
    const matchStore = useMatchStore()
    const isGroupRound = ref(props.match.round === MatchRound.GROUP)
    const countryA = reactive({
      goals: props.match.countryAGoals || '',
      penaltyGoals: props.match.countryAPenaltyGoals || ''
    })

    const countryB = reactive({
      goals: props.match.countryBGoals || '',
      penaltyGoals: props.match.countryBPenaltyGoals || ''
    })

    const saveData = () => {
      const penalty = (countryA.penaltyGoals > 0 || countryB.penaltyGoals > 0)
      const winner = { id: 0 }

      if (countryA.goals > countryB.goals) {
        winner.id = props.match.countryA.id
      } else if (countryB.goals > countryA.goals) {
        winner.id = props.match.countryB.id
      }

      if (countryA.penaltyGoals > countryB.penaltyGoals) {
        winner.id = props.match.countryA.id
      } else if (countryB.penaltyGoals > countryA.penaltyGoals) {
        winner.id = props.match.countryB.id
      }

      const data = {
        penalty,
        winner,
        status: status.value,
        countryAGoals: countryA.goals || 0,
        countryBGoals: countryB.goals || 0,
        countryAPenaltyGoals: countryA.penaltyGoals || 0,
        countryBPenaltyGoals: countryB.penaltyGoals || 0
      }

      ;(async () => {
        await matchStore.updateMatch(props.match.id, data)
      })()
    }

    return {
      expanded,
      isDataChanged,
      isGroupRound,
      isSaving,
      countryA,
      countryB,
      status,
      matchStore,
      saveData
    }
  },
  components: { VersesImage }
})

</script>
