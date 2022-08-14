<template>
  <transition
    appear
    enter-active-class="animated backInDown"
    leave-active-class="animated backOutUp"
  >
    <div class="row">
      <div class="col-md-4 col-xs-12">
        <q-list dense bordered padding v-if="state.length">
          <q-item v-for="score in state" :key="score.user.id">
           <q-item-section avatar>
              <q-avatar>
                <q-badge floating :label="getPosition(score.totalPoints)" color="teal" />
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ score.user.username }}
              </q-item-section>
              <q-item-section avatar>
                {{ score.totalPoints }}
              </q-item-section>
          </q-item>
      </q-list>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { useLayoutStore } from 'src/stores/layout-store'
import { useTipStore } from 'src/stores/tip-store'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const layoutStore = useLayoutStore()
    layoutStore.setTitle('Scoreboard')
    const { isLoading, isReady, state } = useTipStore().fetchScoreboard()
    let currentPosition = 1
    const positions: {[key:string]: number } = {}

    const getPosition = (points: string | number): number => {
      if (positions[points]) {
        return positions[points]
      }
      positions[points] = currentPosition++
      return getPosition(points)
    }

    return {
      isLoading,
      isReady,
      state,
      getPosition
    }
  }
})
</script>
