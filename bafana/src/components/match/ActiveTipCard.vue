<template>
    <!-- card-->
      <q-card class="q-mb-md q-mr-md-md" flat bordered v-if ="isReady && state">
        <q-item>
        <q-item-section avatar>
          <GameTipPercentage
            :match="match"
            :user-tip-and-state="state"
           ></GameTipPercentage>
        </q-item-section>

        <q-item-section>
          <q-item-label>Game {{ match.number }}</q-item-label>
          <q-item-label caption>
            {{ match.countryA.name }} vs {{ match.countryB.name }}
          </q-item-label>
        </q-item-section>
        <q-space />
          <q-btn
          flat
          round
          :icon="state.state.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="(state)?state.state.expanded = !state.state.expanded: ''"
          ></q-btn>
      </q-item>
        <div class="q-ma-md">
          <slot>
            <VersesImage :match="match"></VersesImage>
          </slot>
        </div>
        <q-separator />
      <q-card-actions>
        <q-space
          v-if="isMatchOpen"
         />
         <BotTipBtn
          :match="match"
          :user-tip-and-state="state"
          @update:user-tip-and-state="onBotGenerate"
          class="q-mr-md"
         ></BotTipBtn>

        <TipBtn
          :match="match"
          :user-tip-and-state="state"
        ></TipBtn>

        <q-space v-if="!isMatchOpen" />

        <q-btn
          flat
          rounded
          v-if="!isMatchOpen"
          :icon="state.state.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="(state)?state.state.expanded = !state.state.expanded: ''"
        />
      </q-card-actions>
        <q-slide-transition>
          <div v-show="state.state.expanded">
            <q-separator />
            <div v-if="isGroupRound" class="q-ma-md text-center">
              Some tips are not available in group round
            </div>
            <q-card-section class="text-subitle2">
            <GoalsTip
              :match="match"
              :user-tip-and-state="state"
            >
            </GoalsTip>
            <PenaltyTip
              :match="match"
              :user-tip-and-state="state"
             ></PenaltyTip>
            <PenaltyGoalsTip
              :match="match"
              :user-tip-and-state="state"
            ></PenaltyGoalsTip>
            <WinnerTip
             :match="match"
             :user-tip-and-state="state"
            ></WinnerTip>
          </q-card-section>
        </div>
      </q-slide-transition>
      <q-separator v-if="isDataChanged"></q-separator>
      <q-card-actions v-if="isDataChanged">
        <q-space></q-space>
        <q-btn icon="check" round color="primary" @click="saveData" :loading="isSaving"></q-btn>
      </q-card-actions>
    </q-card>
    <!--// card-->
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import VersesImage from './VersesImage.vue'
import WinnerTip from './WinnerTip.vue'
import GoalsTip from './GoalsTip.vue'
import PenaltyTip from './PenaltyTip.vue'
import PenaltyGoalsTip from './PenaltyGoalsTip.vue'
import { Match, MatchRound, useMatchStore, MatchStatus } from 'src/stores/match-store'
import GameTipPercentage from './GameTipPercentage.vue'
import { useUserTipStore } from 'src/stores/user-tip-store'
import BotTipBtn from './BotTipBtn.vue'
import TipBtn from './TipBtn.vue'

export default defineComponent({
  name: 'ActiveTipCard',
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true
    }
  },
  setup (props) {
    const userTipStore = useUserTipStore()
    const matchStore = useMatchStore()
    const isMatchOpen = props.match.status === MatchStatus.OPEN
    const isGroupRound = props.match.round === MatchRound.GROUP
    const isDataChanged = ref(false)
    const isSaving = ref(false)
    const { isReady, state } = userTipStore.fetchMatchTip(props.match.id)

    watch(() => isReady.value, () => {
      watch(() => state.value?.tip, () => {
        if (!state.value) {
          return
        }

        // goals
        if (state.value.tip.countryAToScore > state.value.tip.countryBToScore) {
          state.value.tip.toWin = props.match.countryA
        } else if (state.value.tip.countryAToScore < state.value.tip.countryBToScore) {
          state.value.tip.toWin = props.match.countryB
        } else if (state.value.tip.countryAToScore === state.value.tip.countryBToScore) {
          state.value.tip.toWin = { id: 0 }
          state.value.tip.isLevel = true
        }

        if (state.value.tip.toPenalty) {
          state.value.tip.isLevel = false
        }

        // penalty
        if (state.value.tip.countryAPenaltyToScore > state.value.tip.countryBPenaltyToScore) {
          state.value.tip.toWin = props.match.countryA
        } else if (state.value.tip.countryAPenaltyToScore < state.value.tip.countryBPenaltyToScore) {
          state.value.tip.toWin = props.match.countryB
        }

        isDataChanged.value = true
      }, { deep: true })
    })

    const saveData = () => {
      isSaving.value = true;
      (async () => {
        const response = await matchStore.placeTip(props.match.id)
        console.log(response.data)
        isSaving.value = false
        isDataChanged.value = false
      })()
    }

    const onBotGenerate = () => {
      // saveData()
    }

    return {
      isReady,
      state,
      isMatchOpen,
      isGroupRound,
      isDataChanged,
      isSaving,
      saveData,
      onBotGenerate
    }
  },
  components: { VersesImage, WinnerTip, GoalsTip, PenaltyTip, PenaltyGoalsTip, GameTipPercentage, BotTipBtn, TipBtn }
})
</script>
