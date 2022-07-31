<template>
    <!-- card-->
      <q-card class="q-mb-md q-mr-md-md" flat bordered>
        <q-item>
        <q-item-section avatar>
          <q-knob
            show-value
            readonly
            :min="0"
            :max="100"
            flat
            v-model="value1"
            size="35px"
            :thickness="0.2"
            color="red-5"
            track-color="grey-3"
          >
            {{ value1 }}%
          </q-knob>
        </q-item-section>

        <q-item-section>
          <q-item-label>Game 1</q-item-label>
          <q-item-label caption>
            Argentina vs Australia
          </q-item-label>
        </q-item-section>
      </q-item>
        <div class="q-ma-md">
          <slot>
            <VersesImage
              a-image="/images/ARG_argentina.png"
              b-image="/images/AUS_australia.png"
              a-label="Argentina"
              b-label="Australia"
              ></VersesImage>
            Arrange each country from highest points to lowest.
          </slot>
        </div>
        <q-separator />
      <q-card-actions>
        <q-btn flat color="secondary" rounded icon="shuffle" />

        <q-space />
        <q-btn flat color="primary" rounded icon="tips_and_updates" />

        <q-space />

        <q-btn
          flat
          rounded
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>
            <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <WinnerTip></WinnerTip>
            <GoalsTip></GoalsTip>
            <PenaltyTip></PenaltyTip>
            <PernaltyGoalsTip></PernaltyGoalsTip>

          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
    <!--// card-->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VersesImage from './VersesImage.vue'
import WinnerTip from './tips/WinnerTip.vue'
import GoalsTip from './tips/GoalsTip.vue'
import PenaltyTip from './tips/PenaltyTip.vue'
import PernaltyGoalsTip from './tips/PernaltyGoalsTip.vue'

export default defineComponent({
  name: 'ActiveTipCard',
  setup () {
    const expanded = ref(false)
    const value1 = ref(70)

    return {
      expanded,
      value1
    }
  },
  components: { VersesImage, WinnerTip, GoalsTip, PenaltyTip, PernaltyGoalsTip }
})
</script>
